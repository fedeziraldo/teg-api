const socketIo = require("socket.io");
let io;

const iniciar = (server) => {
    io = socketIo(server);

    io.on("connection", socket => {
        console.log("New client connected");
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
        socket.on("chat", msj => {
            console.log(msj);
            io.emit("chat", msj)
        });
    });
}

module.exports = iniciar