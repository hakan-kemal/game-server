const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");
const { toData } = require("../auth/jwt");

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

  router.post("/room", async (request, response, next) => {
    console.log("IM IN!");
    const room = await Room.create(request.body);
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

  router.put("/join", auth, async (request, response, next) => {
    const { user } = request;

    response.send(user);
  });

  router.put("/join/:name", auth, async (request, response, next) => {
    // const { user } = request;

    // console.log("dsamdjsadjasd", user, request);

    // const userId = request.user.dataValues.id;
    // // const user = await User.findByPk(request.user.dataValues.id);

    let authData;
    const auth =
      request.headers.authorization && request.headers.authorization.split(" ");
    if (auth && auth[0] === "Bearer" && auth[1]) {
      authData = toData(auth[1]);
    }

    console.log("authorization data??", authData);
    console.log("user Id:", userId);
    console.log("data.userId:", data.userId);

    const user = await User.findByPk(data.userId);

    // console.log("user:", user);

    // // If you use the auth middleware, you only need this --> const { user } = request
    // // user.update(..)

    // if (!user) {
    //   return next("No user found");
    // }

    const { name } = request.params;

    const room = await Room.findOne({ where: { name } });

    const updated = await user.update({ roomId: room.id });

    const rooms = await Room.findAll({ include: [User] });

    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);

    stream.send(string);

    response.send(updated);
  });

  // use this endpoint to add points to the user?
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
