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

            return Promise.reject({status: 404, message: `Not found: id ${articleId} is out of range`})
    
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
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
        if (article.rows.length === 0){
            return Promise.reject({status: 404, message: `Not found: id ${article_id} is out of range`})
        }
        return db
        .query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY comments.created_at DESC;`, [article_id])
    })

}

const insertCommentByArticleId = (article_id, username, body) => { 
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
        if (article.rows.length === 0){
            return Promise.reject({status: 404, message: `Not found: id ${article_id} is out of range`})
        }
    return db
    .query(`INSERT INTO comments (body, author, article_id)
        VALUES ($1, $2, $3)
        RETURNING comment_id, body, author, article_id, votes, created_at`, [body, username, article_id])
    .then((result) => {
        return result.rows[0]
    })
})
}

const existingUsername = (username) => {
    return db
    .query(`SELECT username FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({status: 404, message: "User not found in user table"})
        }
        return result.rows[0]
    })
}




module.exports = {selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, existingUsername}