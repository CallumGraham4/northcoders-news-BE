const db = require("../db/connection");
const endpoints = require("../endpoints.json")
const {selectTopics, selectArticleById, selectArticles} = require("../model/model")

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


