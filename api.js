const db = require("./db/connection");
const express = require("express");
const app = express();
const {getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId} = require('./controller/controller')

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)


app.all('/api/*splat', (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
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

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error!"});
});



module.exports = app;
