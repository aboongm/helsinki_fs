import { useState } from "react";
import Person from "./components/Person";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import { useEffect } from "react";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);

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
    console.log("button clicked: ", event.target);
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      window.alert(`${newName} is already added to phonebook`);
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((response) => {
      setFilteredPersons(filteredPersons.concat(response.data));
    });
  };

  const removePerson = (person) => {
    console.log("person id: ", person.id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          console.log(`Person ${person.name} deleted successfully`);
          const updatedPersons = persons.filter((p) => p.id !== person.id);
          setPersons(updatedPersons);
          setFilteredPersons(updatedPersons);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
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
      <h2>Phonebook</h2>
      <Filter searchName={searchName} handleSearch={handleSearch} />

      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
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
