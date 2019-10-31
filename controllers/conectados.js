const jugadores = {}

module.exports = {
    conectar: function(jugador) {
        jugadores[jugador._id] = jugador
    },
    desconectar: function(jugadorId) {
        delete jugadores[jugadorId]
    },
    obtener: function(jugadorId) {
        return jugadores[jugadorId]
    },
    jugadores: function() {
        return jugadores
    }
}