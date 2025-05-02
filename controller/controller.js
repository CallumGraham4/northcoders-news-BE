const db = require("../db/connection");
const endpoints = require("../endpoints.json")
const {selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, existingUsername} = require("../model/model")

exports.getApi = (req, res) => {
    res.status(200).send({endpoints})
}

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res, next) => {
    const articleId = req.params;
  
    selectArticleById(articleId.article_id).then((result) => {
        res.status(200).send({ article: result.rows[0]});   
    })
    .catch((err) => {
        next(err)
      })
}

exports.getArticles = (req, res) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
    
    
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params; 
    selectCommentsByArticleId(article_id).then((result) => {
        res.status(200).send({ comments: result.rows});
    })
    .catch((err) => {
        next(err)
      }) 
}

exports.postCommentByArticleId = (req, res, next) => {
    const {username, body} = req.body
    const {article_id} = req.params
    if (!username){
        res.status(400).send({message: "Bad request: no username provided"})
    }
    if (!body){
        res.status(400).send({message: "Bad request: no comment body provided"})
    }
    const existingUser = existingUsername(username)
    Promise.all([existingUser])
    .then(() => {
    return insertCommentByArticleId(article_id, username, body).then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next)

    })
    .catch(next)

}









