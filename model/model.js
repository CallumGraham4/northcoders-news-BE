const db = require("../db/connection")

const selectTopics = () => {

    return db.query('SELECT * FROM topics').then(({rows})=>{

        
        return rows
    })
}

module.exports = {selectTopics}