const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");

const router = new Router();

router.post("/signup", (request, response, next) => {
  const { userName, password } = request.body;
  const points = 0;

  if (!userName) {
    return response.status(400).send("You must provide a name");
  }

  if (!password) {
    return response.status(400).send("You must provide a password");
  }

  User.create({
    userName: request.body.userName,
    password: bcrypt.hashSync(request.body.password, 10),
    points: points
  })
    .then(user => response.send(user))
    .catch(next);
});

router.get("/signup", (request, response, next) => {
  console.log("connected to get users");
  User.findAll()
    .then(users => {
      response.send(users);
    })
    .catch(next);
});

module.exports = router;
