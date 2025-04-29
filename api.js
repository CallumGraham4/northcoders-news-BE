const db = require("./db/connection");
const express = require("express");
const app = express();
const {getApi, getTopics, getArticleById} = require('./controller/controller')

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.use((req, res) => {
  res.status(404).send({ msg: "404 error: not found" });
});

app.use((err, req, res, next) => {
  // forced errors
  if (err.status && err.message){
  res.status(err.status).send({message: err.message})
  }
  next(err)
})
app.use((err, req, res, next) => {

  
  if (err.code === '22P02') {
  res.status(400).send({message: 'bad request: make sure you are sending a parameter of type number'})
  } 
  next(err) 
})



module.exports = app;
