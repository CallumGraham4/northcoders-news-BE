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
  test("status:404, responds with an error message when passed a non-existent endpoint", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body: {msg} }) => {
        console.log(msg)
        expect(msg).toBe("404 error: not found");
      });
  });
})

describe("/api/articles/:article_id", () => {
  test("200: responds with the requested article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body: {article}}) => {
        expect(article[0]).toEqual({
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

describe("/api/articles/:article_id: Error Handling", () => {
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




