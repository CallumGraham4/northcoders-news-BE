const db = require("./db/connection");
const express = require("express");
const app = express();
const {getApi, getTopics} = require('./controller/controller')

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.use((req, res) => {
  res.status(404).send({ msg: "404 error: not found" });
});



module.exports = app;
