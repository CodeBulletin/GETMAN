import express from "express";
import { get } from "./db.js";

const route = express.Router();

route.post("/", async (req, res) => {

    const db = get();
    const collection = db.collection("pages");

    // Access the headers
    const headers = req.headers;

    // Access the body
    const body = req.body;

    const result = await collection.deleteMany(body);

    res.send(result);
});

export default route;