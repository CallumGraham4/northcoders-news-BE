const db = require("../db/connection");
const endpoints = require("../endpoints.json")
const {selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, existingUsername, updateArticleVotesByArticleId, deleteFromComments, selectUsers} = require("../model/model")

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
    existingUsername(username)
    
    .then(() => {
    return insertCommentByArticleId(article_id, username, body).then((comment) => {
        res.status(201).send({ comment });
    })
    })
    .catch(next)
}

exports.patchArticleVotesByArticleId = (req, res, next) => {
    const votes = req.body
    const {article_id} = req.params
    if (!votes.inc_votes){
        res.status(400).send({message: "Bad request: body does not contain the correct fields"})
    }
    if(typeof votes.inc_votes !== 'number'){
        res.status(400).send({message: "Bad request: body does not contain a valid field"})
    }
    updateArticleVotesByArticleId(votes, article_id)
    .then(({rows}) => {
        const updatedArticle = rows[0]
        res.status(200).send({article: updatedArticle})
    })
    .catch(next)

}

exports.deleteCommentByCommentId = (req, res, next) => {
    const commentId = req.params.comment_id;
    deleteFromComments(commentId)
      .then((result) => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((result) => {
        res.status(200).send({users: result})
    })
    .catch((err) => {
        next(err)
    })
}









