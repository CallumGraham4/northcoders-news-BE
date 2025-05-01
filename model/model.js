const db = require("../db/connection")

const selectTopics = () => {

    return db.query('SELECT * FROM topics').then(({rows})=>{

        
        return rows
    })
}

const selectArticleById = (articleId) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then((result) => {
        if (result.rows.length === 0) {

            return Promise.reject({status: 404, message: 'Not found: id 1000000 is out of range'})
    
            } 
        return result
    })
}

const selectArticles = () => {
    return db
    .query(
        `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id):: INT AS comment_count
        FROM articles
        LEFT OUTER JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(({rows})=>{

        
            return rows
        })
}


const selectCommentsByArticleId = (article_id) => {
    if (Number(article_id) && Number(article_id) < 18) {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY comments.created_at DESC;`, [article_id])
    } else {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1
            ORDER BY comments.created_at DESC;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {

            return Promise.reject({status: 404, message: 'Not found: id 1000000 is out of range'})
    
            } 
        return result
    })
}}




module.exports = {selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId}