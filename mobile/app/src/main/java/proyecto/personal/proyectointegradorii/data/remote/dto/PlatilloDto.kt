package proyecto.personal.proyectointegradorii.data.remote.dto

data class PlatilloDto(
    val id: Long,
    val nombre: String,
    val descripcion: String?,
    val precio: Double,
    val urlImagen: String?,
    val estado: String?
)