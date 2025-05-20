const cors = require('cors');
const db = require("./db/connection");
const express = require("express");
const app = express();
const {getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleVotesByArticleId, deleteCommentByCommentId, getUsers} = require('./controller/controller')

app.use(express.json());

app.use(cors());

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleVotesByArticleId)

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getUsers)

app.use((err, req, res, next) => {

  if(err.code === "22P02"){
      return res.status(400).send({message: "Bad request"})
  } if (err.code === '23503') {
      res.status(404).send({message: "Not found"})
  }
  if(err.status && err.message){
      return res.status(err.status).send({message: err.message})
  }
  res.status(500).send({message: "Internal Server Error"})
})

app.use((req, res) => {
  res.status(404).send({message: "Not found"})
})




module.exports = app;
