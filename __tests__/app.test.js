const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../api");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with the topics with all properties", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics}}) => {
      expect(topics.length).toBe(3)
      topics.forEach((singleTopic) => {
        expect(singleTopic).toMatchObject({
          description: expect.any(String),
          slug: expect.any(String),
          img_url: expect.any(String)
        })
      })
    })
  })
})

test("status:404, responds with an error message when passed a non-existent endpoint", () => {
  return request(app)
    .get("/api/notARoute")
    .expect(404)
    .then(({ body: {message} }) => {
      expect(message).toBe("Not found");
    });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the requested article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body: {article}}) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"

        });
      });
  });
});

describe("GET /api/articles/:article_id: Error Handling", () => {
  test("400: responds with bad request when an id is sent that isn't a number", () => {
    return request(app)
    .get("/api/articles/chocolate")
    .expect(400)
    .then(({ body: { message } }) => {
      expect(message).toBe('Bad request')
    })
  }) 

  test("404: responds with error when an id is sent that is out of range but is a correct type", () => {
    return request(app)
    .get("/api/articles/1000000")
    .expect(404)
    .then(({ body: { message } }) => {
      expect(message).toBe('Not found: id 1000000 is out of range')
    })
  }) 
})

describe("GET /api/articles", () => {
  test("200: responds with an array of objects containing articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles
        expect(articles.length).toBeGreaterThan(0)
        articles.forEach((singleArticle) => {
          expect(singleArticle).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
        })
      })
  })

  test("GET /api/articles - Checking the array is sorted in descending order and making sure there is no body property", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      const articles = response.body.articles
      expect(articles).toBeSorted({ descending: true });
      articles.forEach((singleArticle) => { 
        expect(singleArticle).not.toHaveProperty("body")
      })

    })
  })

})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with the requested comments for a given article_id", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then((response) => {
      const comments = response.body.comments

      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
        })

      })
    });
  })
  test("Checking the array is sorted in descending order by date", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then((response) => {
      const comments = response.body.comments
      expect(comments).toBeSorted({ descending: true });
})
})
test("Returns an empty array if the article has zero comments", () => {
  return request(app)
  .get("/api/articles/2/comments")
  .expect(200)
  .then((response) => {
    const comments = response.body.comments
    expect(comments.length).toBe(0)
  })
})
describe("Error Handling", () => {
  test("400: responds with bad request when an id is sent that isn't a number", () => {
    return request(app)
    .get("/api/articles/chocolate/comments")
    .then(({ body: { message } }) => {
      expect(message).toBe('Bad request')
    })
  })
  test("404: responds with error when an id is sent that is out of range but is a correct type", () => {
    return request(app)
    .get("/api/articles/1000000/comments")
    .expect(404)
    .then(({ body: { message } }) => {
      expect(message).toBe('Not found: id 1000000 is out of range')
    })
  })
})
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a posted comment to an article selected by and article id", () => {
    return request(app)
    .post('/api/articles/1/comments')
    .send({username: "icellusedkars",
      body: "Who is this great man?"})
    .expect(201)
    .then(({body: {comment}}) => {
      expect(comment).toMatchObject({
        article_id: 1,
        author: "icellusedkars",
        body: "Who is this great man?"
      })
      expect(typeof comment.body).toBe('string')
      expect(typeof comment.author).toBe('string')
      expect(typeof comment.comment_id).toBe('number')
      expect(typeof comment.created_at).toBe('string')
      expect(typeof comment.votes).toBe('number')
    })
  })
  describe("Error Handling", () => {
    test("400: bad request - responds with bad request when an id is sent that isn't a number", () => {
      return request(app)
      .post("/api/articles/chocolate/comments")
      .send({username: "icellusedkars",
        body: "Who is this great man?"})
        .expect(400)
        .then(({body}) => {
          expect(body.message).toBe('Bad request')
        })
    })
    test("404: ID not found - responds with error when an id is sent that is out of range but is a correct type", () => {
      return request(app)
      .post("/api/articles/1000000/comments")
      .send({username: "icellusedkars",
        body: "Who is this great man?"})
        .expect(404)
        .then(({body}) => {
          expect(body.message).toBe('Not found: id 1000000 is out of range')
        })
    })
  })
  test("404: User not found - when passed a non-existing username", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({username: "nonExisting",
      body: "Who is this great man?"})
      .expect(404)
      .then(({body}) => {
        expect(body.message).toBe("User not found in user table")
      })
  })
})
test("400: Bad request - No username provided in the request", () => {
  return request(app)
  .post("/api/articles/1/comments")
  .send({body: "Who is this great man?"})
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad request: no username provided")
  })
})
test("400 : Bad request - No comment body provided", () => {
return request(app)
  .post("/api/articles/1/comments")
  .send({username: "icellusedkars"})
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad request: no comment body provided")
  })

})

describe("PATCH: /api/articles/:article_id", () => {
  test("200: Updates the vote property in a relevant article_id", () => {
    const newVote = {inc_votes: 10}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then((response) => {
      const updatedArticle = response.body.article
      expect(updatedArticle.votes).toBe(110)
    })

  })
  describe("Error Handling", () => {
     

test("400: bad request - responds with bad request when the votes to take away is greater than the initial number of votes on the article", () => { 
  const newVote = {inc_votes: -110} 
  return request(app) 
  .patch("/api/articles/1") 
  .send(newVote) 
  .expect(400) 
  .then(({body}) => { 
  expect(body.message).toBe("bad request: the article does not have this many votes") 
  }) 
  }) 
    test("400: bad request - responds with bad request when an id is sent that isn't a number", () => {
      const newVote = {inc_votes: 10}
      return request(app)
      .patch("/api/articles/chocolate")
      .send(newVote)
      .expect(400)
      .then(({body}) => {
        expect(body.message).toBe("Bad request")
      })
    })
  })
  test("404: ID not found - responds with error when an id is sent that is out of range but is a correct type", () => {
    const newVote = {inc_votes: 10}
    return request(app)
    .patch("/api/articles/1000000")
    .send(newVote)
    .expect(404)
    .then(({body}) => {
      expect(body.message).toBe("Not found")
    })
  })
  test("400: Bad request - responds with an error when the body does not contain the correct fields", () => {
    const newVote = {}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body}) => {
      expect(body.message).toBe("Bad request: body does not contain the correct fields")
    })
  })
  test("400: Bad request - responds with an error when the body is valid but has invalid fields", () => {
    const newVote = {inc_votes: "invalid"}
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body}) => {
      expect(body.message).toBe("Bad request: body does not contain a valid field")
    })
  })
})

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: checks for successfull deletion", () => {
    return db
      .query("SELECT COUNT(*) FROM COMMENTS")
      .then((result) => {
        return result.rows[0].count;
      })
      .then((totalBeforeDeletion) => {
        return request(app)
          .delete("/api/comments/3")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          })
          .then(() => {
            return db.query("SELECT COUNT(*) FROM COMMENTS").then((result) => {
              const totalAfterDeletion = result.rows[0].count;
              expect(parseInt(totalAfterDeletion)).toEqual(
                parseInt(totalBeforeDeletion) - 1
              );
            });
          });
      });
  });
  describe("DELETE: /api/comments/:comment_id - error handling", () => {
    test("404: when trying to delete a comment which isnt found", () => {
      return request(app)
        .delete("/api/comments/1000000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(
           "Not found"
          );
        });
    });

    test("400: when trying to delete a comment at an invaid datatype", () => {
      return request(app)
        .delete("/api/comments/hello")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad request"
          );
        });
    });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of user objects with properties username, name, avatar_url", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      const users = response.body.users
      expect(users.length).toBe(4)
      users.forEach((user) => {
        expect(user).toHaveProperty("username")
        expect(user).toHaveProperty("name")
        expect(user).toHaveProperty("avatar_url")
      })
    })
  })
})

describe("GET /api/users error handling", () => {
  test("404: responds with error if endpoint doesn't exist", () => {
    return request(app)
    .get("/api/bananas")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Not found")
    })
  })
})

describe("GET /api/articles (topic query", () => {
  test("200: responds with filtered articles by specified topic", () => {
    return request(app)
    .get("/api/articles?topic=cats")
    .expect(200)
    .then((response) => {
    const articles = response.body.articles
    expect(articles.length).toBe(1)
    articles.forEach((article) => {
      console.log(article)
      expect(article).toHaveProperty("article_id")
      expect(article).toHaveProperty("topic")
      expect(article).toHaveProperty("author")
      expect(article).toHaveProperty("created_at")
      expect(article).toHaveProperty("votes")
      expect(article).toHaveProperty("article_img_url")
      expect(article.topic).toBe("cats")
    })
  })
  })
  test("200: responds with an empty array if there are no articles with that topic (valid topic)", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then((response) => {
      expect(response.body.articles).toEqual([])
    })
  })
})

describe("GET /api/articles (topic query) error handling", () => {
  test("404: responds with error if no topic with that name", () => {
    return request(app)
    .get("/api/articles?topic=bananas")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Not found")
    })
  })
})
