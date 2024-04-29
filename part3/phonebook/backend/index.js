const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
    const maxId = Math.max(...persons.map((person) => person.id), 0);
    return Math.floor(Math.random() * 1000000) + maxId + 1;
  };
  

app.get("/info", (request, response) => {
  const currentTime = new Date();
  response.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${currentTime}</p>
  `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personIndex = persons.findIndex((person) => person.id === id);
  console.log("index", personIndex);
  if (personIndex === -1) {
    return response.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  console.log('body: ', body);
  
  if (!body.name || !body.number) {
    return response.status(400).json({
        error: "The name or number is missing"
    })
  }

  const existingPerson = persons.find(person => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
        error: "name must be unique"
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
