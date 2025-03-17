import express from "express";
import dotenv from "dotenv-safe";
import cors from "cors";
import dependencies from "./infrastructure/dependencies";
import userRoutes, { search } from "./ports/rest/routes/user";
import eventRoutes from "./ports/rest/routes/events";
import searchRoutes from "./ports/rest/routes/search";
import homeRoutes from "./ports/rest/routes/home";

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

// Database Connection
const { mongoDbClient } = dependencies;
if (process.env.NODE_ENV !== "test") {
  mongoDbClient.ConnectToDb();
}

// Routes
app.use("/user", userRoutes);
app.use("/events", eventRoutes);
app.use("/search", searchRoutes);
app.use("/home", homeRoutes);

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const port = 4000;
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });
}

// Export `app` for testing
export default app;
