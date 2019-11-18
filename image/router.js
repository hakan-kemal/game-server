const { Router } = require("express");
const Image = require("./model");

const router = new Router();

router.get("/image", (req, res, next) => {
  Image.findAll()
    .then(image => res.send(image))
    .catch(next);
});

router.post("/image", (req, res, next) => {
  Image.create(req.body)
    .then(image => res.send(image))
    .catch(next);
});

module.exports = router;
