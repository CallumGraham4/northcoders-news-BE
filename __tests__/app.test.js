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

