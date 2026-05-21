import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./database/db.js";
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// import
import doctors from "./routes/doctorRoute.js";
import appointments from "./routes/appointmentRoute.js";

// database connect
connectDB();


// apis
app.use("/api/doctors", doctors);
app.use("/api/appointments", appointments);

app.get("/", (req, res) => {
    res.send("doc-appoint server running")
});

app.listen(port, () => {
    console.log(`doc-appoint server running on port http://localhost:${port}`);
})