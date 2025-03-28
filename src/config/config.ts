import dotenv from "dotenv-safe";

dotenv.config({ allowEmptyValues: true, path: `.env.local` }); //allows environment variables to be accessed.

const ENVIRONMENT = process.env.NODE_ENV ?? "development";
const MONGO_HOST = process.env.MONGO_HOST ?? "";
const MONGO_DATABASE = process.env.MONGO_DATABASE ?? "";
const MONGO_PORT = process.env.MONGO_PASSWORD ?? "";
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
const SECRET_KEY = process.env.SECRET_KEY??"";
const EVENT_API_KEY = process.env.EVENT_API_KEY??"";

export const config = {
  environment: ENVIRONMENT,
  mongo: {
    url: MONGO_URL
  },
  secret:SECRET_KEY, 
  event_api:EVENT_API_KEY
}