const db = require("../db/connection");
const endpoints = require("../endpoints.json")
//const {selectEndpoints} = require("../model/model");

exports.getApi = (req, res) => {
    res.status(200).send({endpoints})
}

