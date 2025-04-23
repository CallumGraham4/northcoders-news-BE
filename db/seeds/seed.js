const db = require("../connection")
const format = require("pg-format")
const {convertTimestampToDate, createRef} = require("./utils")

// console.log(convertTimestampToDate)
//console.log(createRef)

const seed = ({ topicData, userData, articleData, commentData }) => {
  
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users;`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY NOT NULL UNIQUE, 
      name VARCHAR(100) NOT NULL,
      avatar_url VARCHAR(1000)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE topics (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(500) NOT NULL,
      img_url VARCHAR(1000)
  );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      topic VARCHAR(100) REFERENCES topics(slug),
      author VARCHAR(100) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(100) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`)
  })
  .then(() => {
    const formattedTopics = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url]
    })
    const insertTopicsQueryString = format(`
      INSERT INTO topics
      (slug, description, img_url)
      VALUES %L`,
      formattedTopics
    )
    return db.query(insertTopicsQueryString)
  })

  .then(() => {
    const formattedUsers = userData.map((user) => {
      return [user.username, user.name, user.avatar_url]
    })
    const insertUsersQueryString = format(`
      INSERT INTO users
      (username, name, avatar_url)
      VALUES %L;`,
      formattedUsers
    )
    return db.query(insertUsersQueryString)
  })
  .then(() => {
    const formattedArticles = articleData.map((article) => {
      const newArticle = convertTimestampToDate(article)
      return [
        newArticle.title, 
        newArticle.topic,
        newArticle.author,
        newArticle.body, 
        newArticle.created_at, 
        newArticle.votes, 
        newArticle.article_img_url]
    })
    const insertArticlesQueryString = format(`
      INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L
      RETURNING *;`,
      formattedArticles
    )
    return db.query(insertArticlesQueryString)
  })
 


  .then((result) => {

    

    const articlesRefObj = createRef(result.rows)
    console.log(articlesLookUp)
    const formattedComments = commentData.map((comment) => {
      const newComment = convertTimestampToDate(comment)
      return [
      articlesRefObj[newComment.article_title],
      newComment.body,
      newComment.votes,
      newComment.author,
      newComment.created_at
    ]
    })


    const insertCommentsQuery = format(
      `INSERT INTO comments(article_id, body, votes, author, created_at)
      VALUES %L;`,
      formattedComments
    )

    return db.query(insertCommentsQuery)

  
  })
};
module.exports = seed;
