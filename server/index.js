import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./util/prisma.js";
import taskRoute from "./routes/task.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? "*" : process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  //Controllo che la connessione al database sia stata stabilita
  prisma.$connect().then(() => {
    console.log("Database connected");
  });
});

app.use("/task", taskRoute);

app.get("/", (req, res) => {
  res.send("API are running");
});

// Aggiungi questo middleware alla fine, dopo tutte le altre route
app.use((req, res) => {
  res.status(404).json({ message: "Api not found" });
});




