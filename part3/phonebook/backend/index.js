require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require('./models/person')

morgan.token("reqBody", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
// app.use(morgan('tiny'))
app.use(
  morgan(
    `:method :url :status :res[content-length] - :response-time ms:reqBody`
  )
);

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

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
  Person.find({}).then(persons => {
    response.json(persons)
  })
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
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return response.status(404).json({ error: "Person not found" });
      }
      response.status(204).end();
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  }

  try {
    const existingPerson = await Person.findOne({ $or: [{ name: body.name }, { number: body.number }] });

    if (existingPerson) {
      return response.status(400).json({
        error: "Name and Number must be unique",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    console.error("Error saving person:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
