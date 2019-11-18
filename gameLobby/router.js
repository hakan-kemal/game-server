const { Router } = require("express");
const Game = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

router.use(auth);

router.get("/gameLobby", auth, (req, res, next) => {
  Game.findAll()
    .then(movies => res.send(movies))
    .catch(next);
});

module.exports = router;
