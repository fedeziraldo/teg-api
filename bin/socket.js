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
            if (conexion != null) {
                console.log("Client disconnected", conexion.userId);
                conexiones = conexiones.filter(con => con.socket != socket)
                salas = salas.filter(sala => sala.userId != conexion.userId)
                io.emit("salas", salas)
            }
        });
        socket.on("conectar", token => {
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("New client connected", decoded.id);
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
        socket.on("unirseASala", userIdSala => {
            const conexion = conexiones.find(con => con.socket == socket)
            const sala = salas.find(sala => sala.userId == userIdSala)
            sala.integrantes.push(conexion.userId)
            io.emit("salas", salas)
        });
        socket.on("abandonarSala", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            salas = salas.filter(sala => sala.userId != conexion.userId)
            for (let sala of salas) {
                sala.integrantes = sala.integrantes.filter(integrante => integrante != conexion.userId)
            }
            io.emit("salas", salas)
        });
    });
}

module.exports = iniciar