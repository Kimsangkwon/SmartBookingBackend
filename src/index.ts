import express from "express";
import dotenv from "dotenv-safe";
import cors from 'cors';
import dependencies from "./infrastructure/dependencies";
import userRoutes from "./ports/rest/routes/user";
import eventRoutes from "./ports/rest/routes/events"

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(cors())
app.use(express.json());

dotenv.config(); //allows environment variables to be accessed.

const {mongoDbClient} = dependencies;
mongoDbClient.ConnectToDb();

app.use("/user", userRoutes)
app.use("/events", eventRoutes )

const port = 4000;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
