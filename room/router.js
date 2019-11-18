const Room = require("./model/");
const { Router } = require("express");

const router = new Router();

function roomFactory(stream) {
  router.post("/room", (request, response) => {
    //stream.send(data)
    Room.create(request.body).then(room => {
      const data = JSON.stringify(room);

      stream.send(data);

      response.send(room);
    });
  });

  return router;
}

module.exports = factory;
