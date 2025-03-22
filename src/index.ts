import express from "express";
import dotenv from "dotenv-safe";
import cors from "cors";
import dependencies from "./infrastructure/dependencies";
import userRoutes, { search } from "./ports/rest/routes/user";
import eventRoutes from "./ports/rest/routes/events";
import searchRoutes from "./ports/rest/routes/search";
import homeRoutes from "./ports/rest/routes/home";
import concertRoutes from "./ports/rest/routes/concerts";
import sportRoutes from "./ports/rest/routes/sports";
import otherRoutes from "./ports/rest/routes/others";
import eventDetailRoutes from "./ports/rest/routes/eventDetails";
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
// Allow frontend requests from localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Allow cookies if needed
}));
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
app.use("/concerts", concertRoutes);
app.use("/sports",sportRoutes);
app.use("/others", otherRoutes);
app.use("/eventDetail", eventDetailRoutes);

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const port = 4000;
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });
}

// Export `app` for testing
export default app;
