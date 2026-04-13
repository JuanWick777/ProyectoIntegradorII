package proyecto.personal.proyectointegradorii.data.remote.dto.orden

import proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden.DetalleOrdenDTO

data class OrdenResponseDTO(
    val id: Long,
    val estado: String,
    val mesaNumero: Int?,
    val detalles: List<DetalleOrdenDTO>,
    val subtotal: Double,
    val montoDescuento: Double,
    val codigoPromoAplicado: String?,
    val total: Double,
    val fechaCreacion: String?
)