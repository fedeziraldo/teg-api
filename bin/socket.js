const jwt = require('jsonwebtoken')
const socketIo = require("socket.io")

const Conexion = require('../Sala/Conexion')
const Sala = require('../Sala/Sala')
let io

let salas = []
let conexiones = []

const mensajeUnidoASala = `Te has unido a la sala `

const iniciar = (server) => {
    io = socketIo(server);

    io.on("connection", socket => {
        console.log("New client connected");
        socket.on("disconnect", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                console.log("Client disconnected", conexion.userId);
                conexiones = conexiones.filter(con => con.socket != socket)
                for (let sala of salas) {
                    sala.integrantes = sala.integrantes.filter(integrante => integrante != conexion.userId)
                }
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
                    socket.join("sin sala")
                    socket.sala = "sin sala"
                    socket.emit("chat", `${mensajeUnidoASala} Sin sala`)
                    socket.emit("sala", 'sin sala')
                }
            })
        })
        socket.on("desconectar", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                console.log("Client deslogueado", conexion.userId);
                conexiones = conexiones.filter(con => con.socket != socket)
                for (let sala of salas) {
                    sala.integrantes = sala.integrantes.filter(integrante => integrante != conexion.userId)
                    socket.leave(sala.userId)
                }
                socket.leave("sin sala")
                salas = salas.filter(sala => sala.userId != conexion.userId)
                socket.sala = ""
                io.emit("salas", salas)
            }
        })
        socket.on("chat", msj => {
            console.log(msj);
            io.to(socket.sala).emit("chat", msj)
        });
        socket.on("crearSala", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                const sala = new Sala(conexion.userId)
                salas.push(sala)
                socket.leave("sin sala")
                socket.join(conexion.userId)
                socket.sala = conexion.userId
                socket.emit("chat", `${mensajeUnidoASala} ${conexion.userId}`)
                socket.emit("sala", sala)
                io.emit("salas", salas)
            }
        });
        socket.on("unirseASala", userIdSala => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                const sala = salas.find(sala => sala.userId == userIdSala)
                if (sala) {
                    sala.integrantes.push(conexion.userId)
                    socket.leave("sin sala")
                    socket.join(sala.userId)
                    socket.sala = sala.userId
                    socket.emit("chat", `${mensajeUnidoASala} ${conexion.userId}`)
                    socket.emit("sala", sala)
                    io.emit("salas", salas)
                }
            }
        });
        socket.on("abandonarSala", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                for (let sala of salas) {
                    sala.integrantes = sala.integrantes.filter(integrante => integrante != conexion.userId)
                    socket.leave(sala.userId)
                }
                salas = salas.filter(sala => sala.userId != conexion.userId)
                socket.join("sin sala")
                socket.sala = "sin sala"
                socket.emit("chat", `${mensajeUnidoASala} Sin sala`)
                socket.emit("sala", 'sin sala')
                io.emit("salas", salas)
            }
        });
    });
}

module.exports = iniciar