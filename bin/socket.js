const jwt = require('jsonwebtoken')
const socketIo = require("socket.io")

const Conexion = require('../Sala/Conexion')
const Sala = require('../Sala/Sala')
let io

let salas = []
let conexiones = []

const iniciar = (server) => {
    io = socketIo(server);

    io.on("connection", socket => {
        console.log("New client connected");
        socket.on("disconnect", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            console.log("Client disconnected", conexion.userId);
            conexiones = conexiones.filter(con => con.socket != socket)
            salas = salas.filter(sala => sala.userId != conexion.userId)
        });
        socket.on("conectar", token => {
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.error(err)
                } else {
                    conexiones.push(new Conexion(token, socket, decoded.id))
                    socket.emit("salas", salas)
                }
            })
        })
        socket.on("chat", msj => {
            console.log(msj);
            io.emit("chat", msj)
        });
        socket.on("crearSala", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            salas.push(new Sala(conexion.userId))
            io.emit("salas", salas)
        });
    });
}

module.exports = iniciar