import { useState } from "react";
import Person from "./components/Person";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import { useEffect } from "react";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log("effect!!!");
    personService.getAll().then((response) => {
      console.log("promise fulfilled!!!");
      setPersons(response.data);
      setFilteredPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const updatedPerson = {
        ...existingPerson,
        number: newNumber,
      };

      if (
        window.confirm(
          `${newName} is already added to phonebook. Number will be updated!`
        )
      ) {
        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            console.log(response.data);
            const updatedPersons = filteredPersons.map((person) =>
              person.id === existingPerson.id ? response.data : person
            );
            setNewName("");
            setNewNumber("");
            setMessage(`Updated ${response.data.name}`);
            setFilteredPersons(updatedPersons);
            setIsError(false)

            setTimeout(() => {
              setMessage("");
            }, 1000);
          })
          .catch((error) => {
            console.error("Error updating person:", error);
          });
        return;
      } else {
        setNewName("");
        setNewNumber("");
        return;
      }
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setFilteredPersons(filteredPersons.concat(response.data));
        setNewName("");
        setNewNumber("");
        setIsError(false)

        setMessage(`Added ${response.data.name}`);
        setTimeout(() => {
          setMessage("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating person:", error);
      });
  };

  const removePerson = (person) => {
    console.log("person id: ", person.id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then((response) => {
          console.log(`Person ${person.name} deleted successfully`);
          const updatedPersons = persons.filter((p) => p.id !== person.id);
          setPersons(updatedPersons);
          setFilteredPersons(updatedPersons);
          setIsError(false)

          setMessage(`Deleted ${person.name}`);
          setTimeout(() => {
            setMessage("");
          }, 2000);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          setIsError(true)

          setMessage(`Information of ${person.name} has already been removed from server`);
          setTimeout(() => {
            setMessage("");
          }, 2000);
        });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchName(searchValue);
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPersons(filteredPersons);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      {message && <Notification message={message} isError={isError} />}
      <Filter searchName={searchName} handleSearch={handleSearch} />

      <h1>add a new</h1>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h1>Numbers</h1>
      <div>
        {filteredPersons.map((person) => (
          <Person
            key={person.id}
            person={person}
            removePerson={() => removePerson(person)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
