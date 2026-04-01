package proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden

data class DetalleOrdenRequest(
    val platilloId: Long,
    val cantidad: Int,
    val nota: String
)