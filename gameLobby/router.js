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

    if (!user) {
      return next("No user found");
    }

    const { name } = request.params;

    const room = await Game.findOne({ where: { name } });

    const updated = await user.update({ roomId: room.id });

    const rooms = await Game.findAll({ include: [User] });

    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);

    stream.send(string);

    response.send(updated);
  });

  router.put("/points/:userId", async (request, response, next) => {
    const { userId } = request.params;

    const user = await User.findByPk(userId);

    const updated = await user.update({ points: 1 });

    const rooms = await Room.findAll({ include: [User] });

    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);

    stream.send(string);

    response.send(updated);
  });

  return router;
}

module.exports = roomFactory;
