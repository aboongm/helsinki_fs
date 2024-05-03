require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require("mongoose");

const logger = require("./utils/logger");
const config = require("./utils/config");

const middleware = require('./utils/middleware')
const blogsRouter = require("./controllers/blogController");
const usersRouter = require("./controllers/userController");
const loginRouter = require("./controllers/loginController")


app.use(cors())
app.use(express.json())



logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });


app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app