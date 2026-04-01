package proyecto.personal.proyectointegradorii.data.remote.dto.usuario

data class LoginRequest(
    val correo: String,
    val contrasena: String
)