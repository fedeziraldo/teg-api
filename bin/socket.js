const jwt = require('jsonwebtoken')
const socketIo = require("socket.io")

const Conexion = require('../Sala/Conexion')
const Sala = require('../Sala/Sala')
const usuario = require("../model/usuario")
let io

/**
 * lista de Sala
 */
let salas = []
/**
 * lista de Conexion
 */
let conexiones = []

const mensajeUnidoASala = `Te has unido a la sala `

/**
 * en caso de una salida filtrar las salas y los integrantes 
 * @param {*} conexion 
 */
const filtrarSalasALSalir = conexion => {
    const sala = salas.find(sala => sala.userId == conexion.userId)
    if (sala) {
        for (let integrante in sala.integrantes) {
            const conIntegrante = conexiones.find(con => con.userId == integrante)
            if (conIntegrante) {
                conIntegrante.socket.leave(sala.userId)
            }
        }
    }
    for (let sala of salas) {
        sala.integrantes = sala.integrantes.filter(integrante => integrante != conexion.userId)
    }
    salas = salas.filter(sala => sala.userId != conexion.userId)
}


const iniciar = (server) => {
    io = socketIo(server);

    io.on("connection", socket => {
        console.log("New client connected");
        socket.on("disconnect", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                console.log("Client disconnected", conexion.userId);
                filtrarSalasALSalir(conexion)
                conexiones = conexiones.filter(con => con.socket != socket)
                io.emit("salas", salas)
            }
        });
        socket.on("conectar", token => {
            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    console.error(err)
                    socket.emit("errorConexion")
                } else {
                    console.log("New client connected", decoded.id);
                    const usu = await usuario.findById(decoded.id)
                    const conexion = conexiones.find(con => con.userId == decoded.id)
                    if (conexion) {
                        const sala = salas.find(sala => sala.userId == conexion.socket.sala)
                        if (sala) {
                            conexion.socket.leave(conexion.socket.sala)
                            socket.join(sala.userId)
                            socket.sala = sala.userId
                            socket.emit("chat", `${mensajeUnidoASala} ${sala.userId}`)
                            socket.emit("sala", sala)
                            socket.emit("usuario", usu)
                            socket.emit("salas", salas)
                            conexion.token = token
                            conexion.socket = socket
                            return
                        } else {
                            conexion.socket.leave("sin sala")
                            conexion.token = token
                            conexion.socket = socket
                        }
                    } else {
                        conexiones.push(new Conexion(token, socket, decoded.id, usu))
                    }
                    socket.join("sin sala")
                    socket.sala = "sin sala"
                    socket.emit("chat", `${mensajeUnidoASala} Sin sala`)
                    socket.emit("sala", 'sin sala')
                    socket.emit("usuario", usu)
                    socket.emit("salas", salas)
                }
            })
        })
        socket.on("desconectar", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                console.log("Client deslogueado", conexion.userId);
                filtrarSalasALSalir(conexion)
                socket.leave("sin sala")
                conexiones = conexiones.filter(con => con.socket != socket)
                socket.sala = ""
                io.emit("salas", salas)
            }
        })
        socket.on("chat", msj => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                console.log(msj);
                io.to(socket.sala).emit("chat", msj)
            }
        });
        socket.on("crearSala", async () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                const usu = await usuario.findById(conexion.userId)
                const sala = new Sala(conexion.userId, usu)
                salas.push(sala)
                socket.leave("sin sala")
                socket.join(sala.userId)
                socket.sala = sala.userId
                socket.emit("chat", `${mensajeUnidoASala} ${sala.userId}`)
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
                    io.to(sala.userId).emit("sala", sala)
                    io.emit("salas", salas)
                }
            }
        });
        socket.on("abandonarSala", () => {
            const conexion = conexiones.find(con => con.socket == socket)
            if (conexion) {
                filtrarSalasALSalir(conexion)
                socket.leave(socket.sala)
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