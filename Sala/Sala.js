class Sala {

    constructor (userId, usuario){
        this.userId = userId
        this.usuario = usuario
        this.integrantes = [{con:userId,alias:usuario.email}]
    }
}

module.exports = Sala