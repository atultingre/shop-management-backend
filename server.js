const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const connectDb = require("./db/db");
const errorMiddleware = require("./middlewares/error-middleware");

PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
// Use the cors middleware
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);

// Add this error middleware before connecton creating
app.use(errorMiddleware);

// If Database is connected then Server is starting.
connectDb().then(() => {
  app.listen(PORT, () =>
    console.log(`server is running on http://localhost:${PORT}`)
  );
});
