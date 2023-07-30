import Express from "express";
import cors from "cors";
import { connect, close } from "./db.js";

const app = new Express();

// Cors options

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));

app.use(Express.json());

// routes

// Save route
import saveRoute from "./save.js";
app.use("/save", saveRoute);


// Close connection to database when server is closed
process.on("SIGINT", () => {
    close();
    process.exit();
});

// Start server

connect(() => {
    app.listen(3000, () => {
        console.log("Listening on port 3000");
    })
});