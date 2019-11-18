const { Router } = require("express");
const Game = require("./model");
// const auth = require("../auth/middleware");

const router = new Router();

// router.use(auth);

// router.get("/gameLobby", auth, (req, res, next) => {
//   Game.findAll()
//     .then(games => res.send(games))
//     .catch(next);
// });

function roomFactory(stream) {
  router.post("/room", (request, response) => {
    Game.create(request.body).then(room => {
      const data = JSON.stringify(room);

      stream.send(data);

      response.send(room);
    });
  });

  return router;
}

module.exports = roomFactory;
