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

module.exports = {selectTopics, selectArticleById}