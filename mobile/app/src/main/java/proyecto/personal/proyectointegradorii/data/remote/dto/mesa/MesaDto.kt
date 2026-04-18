package proyecto.personal.proyectointegradorii.data.remote.dto.mesa

data class MesaDto(
    val id: Long,
    val numero: Int,
    val estado: String?,
    val cuentaAbierta: Boolean = false,
    val qrActivo: Boolean = true,
    val ordenActivaId: Long? = null
)
