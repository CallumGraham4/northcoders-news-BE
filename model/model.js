const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles")


const selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};


const selectCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Not found: id ${article_id} is out of range`,
        });
      }
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1
        ORDER BY comments.created_at DESC;`,
        [article_id]
      );
    });
};

const insertCommentByArticleId = (article_id, username, body) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Not found: id ${article_id} is out of range`,
        });
      }
      return db
        .query(
          `INSERT INTO comments (body, author, article_id)
        VALUES ($1, $2, $3)
        RETURNING comment_id, body, author, article_id, votes, created_at`,
          [body, username, article_id]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};

const existingUsername = (username) => {
  return db
    .query(`SELECT username FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          message: "User not found in user table",
        });
      }
      return result.rows[0];
    });
};

const updateArticleVotesByArticleId = (votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes.inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Not found`,
        });
      }
      return result;
    });
};

const deleteFromComments = (commentId) => {
  return db
    .query(`DELETE FROM Comments WHERE comment_id = $1 RETURNING *;`, [
      commentId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Not found`,
        });
      }
      return result;
    });
};

const selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};

const selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const allowedInputs = [
    "article_id",
    "author",
    "title",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const allowedOrders = ["desc", "asc"];

  if (!allowedInputs.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  if (!allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id) :: INT AS comment_count FROM articles
  LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`;
  const queryValues = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then((result) => {
    if (topic && result.rows.length === 0) {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then((nextResult) => {
          if (nextResult.rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not found" });
          }
          return result.rows;
        });
    }
    return result.rows;
  });
};

const selectArticleById = (articleId) => {
  return db
  .query(`SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.author, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`, [articleId])
  .then((result) => {
      if(result.rows.length === 0){
          return Promise.reject({status: 404, message: "Not found"})
      } else {
          return result.rows[0]
      }
  })
}

module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  existingUsername,
  updateArticleVotesByArticleId,
  deleteFromComments,
  selectUsers,
};
