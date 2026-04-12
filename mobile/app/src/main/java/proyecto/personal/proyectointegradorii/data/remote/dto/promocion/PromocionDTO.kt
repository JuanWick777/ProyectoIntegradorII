package proyecto.personal.proyectointegradorii.data.remote.dto.promocion

data class PromocionDto(
    val id: Long,
    val titulo: String,
    val descripcion: String?,
    val tipoDescuento: String,
    val valorDescuento: Double,
    val codigoPromo: String?,
    val activa: Boolean?,
    val fechaInicio: String?,
    val fechaFin: String?
)
