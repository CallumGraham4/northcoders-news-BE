const db = require("../connection")
const format = require("pg-format");



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
    img_url VARCHAR(1000) NOT NULL
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
  // .then(() => {
  //   const insertingIntoTopics = `INSERT INTO topics 
  //    (slug, descripiton, img_url)
  //   VALUES %L;'

    
  //   return db.query
  // })
  
  
  ; //<< write your first query in here.
};
module.exports = seed;
