# NC News Seeding

Link to website:
https://northcoders-news-be-klxa.onrender.com/

This is my first project with Northcoders and focusses on the back-end of a website. Utilising skills in JavaScript, PostgreSQL, Jest, Supertest and express, I have aimed to present a replicate of a news website's database with four tables: articles, comments, topics and users.

In order to clone this repositiory, you use the HTTPS url on GitHub. In your terminal, you use git clone "url".

As for dependencies, install npm. Then run npm setup-dbs to setup the databases and then npm seed-dev to setup the tables and test information. Tests can be run via "npm test filePath" or just npm test if you want to run all tests. You should create two .env files .env.development and .env.test which sets up database connections. .env.test should have the following code: PGDATABASE=nc_news_test. .env.development should have the following code: PGDATABASE=nc_news.

Node.js v23.10.0 Postgres 16.8
