package proyecto.personal.proyectointegradorii.data.remote.dto.usuario

data class LoginResponse(
    val id: Long,
    val nombre: String,
    val correo: String,
    val rol: String,
    val token: String
)