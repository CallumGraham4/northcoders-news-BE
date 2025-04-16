const db = require("../connection")
const format = require("pg-format")
const importObj = require("./utils")
const convertTimestampToDate = importObj.convertTimestampToDate
const importObj2 = require("./utils")
const createRef = importObj2.createRef
// console.log(convertTimestampToDate)
//console.log(createRef)

const seed = ({ topicData, userData, articleData, commentData }) => {
  
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics;`)
  })
  .then(() => {
    return db.query(`CREATE TABLE topics (
    slug VARCHAR(300) PRIMARY KEY,
    "description" VARCHAR(500),
    img_url VARCHAR(1000)
);`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users (
      username VARCHAR(300) PRIMARY KEY, 
      name VARCHAR(300),
      avatar_url VARCHAR(1000)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(300),
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`)
  })
  .then(() => {
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id SERIAL REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username),
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
      VALUES %L
      RETURNING *;`,
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
      VALUES %L
      RETURNING *;`,
      formattedUsers
    )
    return db.query(insertUsersQueryString)
  })
  .then(() => {
    const formattedArticles = articleData.map((article) => {
      const newArticle = convertTimestampToDate(article)
      return [newArticle.title, newArticle.body, newArticle.created_at, newArticle.votes, newArticle.article_img_url]
    })
    const insertArticlesQueryString = format(`
      INSERT INTO articles
      (title, body, created_at, votes, article_img_url)
      VALUES %L
      RETURNING *;`,
      formattedArticles
    )
    return db.query(insertArticlesQueryString)
  })
  .then(() => {
    const formattedComments = commentData.map((comment) => {
      const newComment = convertTimestampToDate(comment)
      const author_id = createRef(articleData)
      console.log(author_id)
      return [author_id, newComment.body, newComment.votes, newComment.created_at]
    })
    const insertCommentsQueryString = format(`
      INSERT INTO comments
      (author_id, body, votes, created_at)
      VALUES %L
      RETURNING *;`,
      formattedComments
    )
    return db.query(insertCommentsQueryString)
  })
};
module.exports = seed;
