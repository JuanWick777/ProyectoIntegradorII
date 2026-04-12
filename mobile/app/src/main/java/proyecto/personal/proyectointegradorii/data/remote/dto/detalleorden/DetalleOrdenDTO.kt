package proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden

data class DetalleOrdenDTO(
    val id: Long,
    val platilloId: Long?,
    val nombre: String?,
    val cantidad: Int,
    val precioUnitario: Double,
    val nota: String?,
    val estadoPreparacion: String?
)
