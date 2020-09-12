class Conexion {

    constructor (token, socket, userId){
        this.token = token
        this.socket = socket
        this.userId = userId
    }
}

module.exports = Conexion