package proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden

data class DetalleOrdenDTO(
    val platilloId: Long,
    val nombre: String,
    val cantidad: Int,
    val precioUnitario: Double,
    val notaCliente: String?,
    val estadoPreparacion: String
)