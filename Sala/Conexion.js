class Conexion {

    constructor (token, socket, userId, usuario){
        this.token = token
        this.socket = socket
        this.userId = userId
        this.usuario = usuario
    }
}

module.exports = Conexion