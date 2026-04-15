package proyecto.personal.proyectointegradorii.data.remote.dto.platillo

data class PlatilloDto(
    val id: Long,
    val nombre: String,
    val descripcion: String?,
    val precio: Double,
    val urlImagen: String?,
    val disponibilidad: String?,
    val categoriaId: Long?,
    val categoriaNombre: String?,
    val estado: String?
) {
    fun estadoActual(): String {
        return (estado ?: disponibilidad ?: "DISPONIBLE").uppercase()
    }

    fun estaDisponible(): Boolean {
        return estadoActual() !in listOf("AGOTADO", "INACTIVO")
    }
}
