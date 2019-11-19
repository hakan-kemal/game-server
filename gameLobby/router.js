const { Router } = require("express");
const Game = require("./model");
const User = require("../user/model");
// const auth = require("../auth/middleware");

// const router = new Router();

// router.use(auth);

// router.get("/gameLobby", auth, (req, res, next) => {
//   Game.findAll()
//     .then(games => res.send(games))
//     .catch(next);
// });

// function roomFactory(stream) {
//   const router = new Router();

//   router.post("/room", (request, response) => {
//     Game.create(request.body).then(room => {
//       const data = JSON.stringify(room);

//       stream.send(data);

//       response.send(room);
//     });
//   });
//   return router;
// }

function roomFactory(stream) {
  const router = new Router();

  router.post("/room", async (request, response) => {
    console.log("IM IN!");
    const room = await Game.create(request.body);
    console.log({ receivedRoom: room });
    const action = {
      type: "ROOM",
      payload: room
    };

    const string = JSON.stringify(action);

    stream.send(string);

    // just for testing
    response.send(room);
  });

  router.put("/join/:name", async (request, response, next) => {
    const userId = 1;

    const user = await User.findByPk(userId);

    console.log("user Id:", user);

    // If you use the auth middleware, you only need this --> const { user } = request

    const { name } = request.params;

    const room = await Game.findOne({ where: { name } });

    const updated = await user.update({ roomId: room.id });

    response.send(updated);
  });

  return router;
}

// router.put("./join", async (request, response, next) => {
//   const userId = 1;

//   const user = await user.findByPk(userId);

//   console.log("user Id:", user);

// response.send(user)
// });

module.exports = roomFactory;
