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
    .then(({ body: {msg} }) => {
      expect(msg).toBe("Not found");
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
      expect(message).toBe('bad request: make sure you are sending a parameter of type number')
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
      expect(comments[0]).toEqual({
        comment_id: 5,
        article_id: 1,
        body: 'I hate streaming noses',
        votes: 0,
        author: 'icellusedkars',
        created_at: "2020-11-03T21:00:00.000Z"
      }

      );
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
      expect(message).toBe('bad request: make sure you are sending a parameter of type number')
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



