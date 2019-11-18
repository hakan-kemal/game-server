const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");

const router = new Router();

router.post("/signup", (request, response, next) => {
  const { name, email, password } = request.body;

  if (!name) {
    return response.status(400).send("You must provide a name");
  }

  if (!password) {
    return response.status(400).send("You must provide a password");
  }

  if (!email) {
    return response.status(400).send("You must provide an email");
  }

  User.create({
    name,
    email: request.body.email,
    password: bcrypt.hashSync(request.body.password, 10)
  })
    .then(user => response.send(user))
    .catch(next);
});

module.exports = router;
