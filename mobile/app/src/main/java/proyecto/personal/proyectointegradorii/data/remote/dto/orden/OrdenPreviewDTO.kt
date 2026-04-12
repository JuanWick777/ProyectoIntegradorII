package proyecto.personal.proyectointegradorii.data.remote.dto.orden

data class OrdenPreviewDTO(
    val subtotal: Double,
    val descuentoPromo: Double,
    val descuentoPuntos: Double,
    val montoDescuento: Double,
    val codigoPromoAplicado: String?,
    val tituloPromoAplicada: String?,
    val total: Double,
    val puntosGanados: Int
)