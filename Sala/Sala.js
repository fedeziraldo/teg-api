class Sala {

    constructor (userId, usuario){
        this.userId = userId
        this.usuario = usuario
        this.integrantes = [userId]
    }
}

module.exports = Sala