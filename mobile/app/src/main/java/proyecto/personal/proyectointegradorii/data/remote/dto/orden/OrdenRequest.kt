package proyecto.personal.proyectointegradorii.data.remote.dto.orden

import proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden.DetalleOrdenRequest

data class OrdenRequest(
    val mesaId: Long,
    val detalles: List<DetalleOrdenRequest>,
    val usarPuntos: Boolean
)