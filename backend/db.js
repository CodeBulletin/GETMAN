import { MongoClient } from 'mongodb';
import 'dotenv/config'

let mongodb_uri = "mongodb://<dbuser>:<dbpassword>@localhost:27017";
let mongodb_db = process.env.MONGODB_DB;
let mongodb_user = process.env.MONGODB_USER;
let mongodb_pass = process.env.MONGODB_PASS;

mongodb_uri = mongodb_uri.replace('<dbuser>', mongodb_user);
mongodb_uri = mongodb_uri.replace('<dbpassword>', mongodb_pass);

let mongodb_client;
let mongodb;

export async function connect(callback) {
    mongodb_client = new MongoClient(mongodb_uri);
    
    console.log("Connecting to database", mongodb_db, "at", mongodb_uri);

    await mongodb_client.connect();

    mongodb = await mongodb_client.db(mongodb_db);

    console.log("Connected to database", mongodb_db, "at", mongodb_uri);

    callback();
}

export function get() {
    return mongodb;
}

export function close() {
    console.log("Closing connection to database");
    mongodb_client.close();
}