require("dotenv").config();
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require('./utils/middleware')

const app = require("./app");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

const blogsRouter = require("./controllers/blogController");

app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
