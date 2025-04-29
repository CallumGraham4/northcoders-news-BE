const db = require("../db/connection");
const endpoints = require("../endpoints.json")
const {selectTopics} = require("../model/model")

exports.getApi = (req, res) => {
    res.status(200).send({endpoints})
}

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}


