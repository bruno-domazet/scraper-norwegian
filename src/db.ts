import * as mongo from "mongodb";
import { Collection, MongoClient } from "mongodb";
import { dbConfig, dbClientOptions } from "./config";

export const getDbClient = async (): Promise<MongoClient> => {
  return mongo.connect(dbConfig.host, dbClientOptions).then(client => {
    return client;
  });
};

export const getCollection = (client: MongoClient): Collection => {
  return client.db(dbConfig.db).collection(dbConfig.collection);
};

export const closeDb = (client: MongoClient, force?: boolean) => {
  return client.close(force);
};
/*
// initial run of service
export const initDb = () => {
  // setup DB name and collection and
  // setup unique compound indexes
  getDbClient().then(client => {
    client
      .db(dbConfig.db)
      .collection(dbConfig.collection)
      .createIndex({ flightDate: 1, price: 1, origin: 1 }, { unique: true })
      .catch(err => console.error(err));
  });
};
*/