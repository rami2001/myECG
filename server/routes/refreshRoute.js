const express = require("express");
const router = express.Router();

const { refresh } = require("../controllers/refreshController");

router.get("/", refresh);

module.exports = router;
