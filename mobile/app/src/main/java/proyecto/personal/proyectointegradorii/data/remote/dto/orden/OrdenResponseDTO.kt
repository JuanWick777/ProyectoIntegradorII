package proyecto.personal.proyectointegradorii.data.remote.dto.orden

import proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden.DetalleOrdenDTO

data class OrdenResponseDTO(
    val id: Long,
    val estado: String,
    val mesaNumero: Int,
    val items: List<DetalleOrdenDTO>,
    val total: Double
)