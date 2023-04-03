import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";
import morgan from "morgan";

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.post(
  "https://tusomekenya.herokuapp.com/insertTesterDetails",
  (req, res) => {
    const body = req.body;
    const { name, number, email } = body;
    db.insert({
      name,
      email,
      number,
    })
      .into("testers")
      .then(function (id) {
        console.log("Tester inserted");
        res.json({ detail: "success" });
      })
      .catch((error) => {
        res.json({ detail: "failed" });
      });
  }
);
