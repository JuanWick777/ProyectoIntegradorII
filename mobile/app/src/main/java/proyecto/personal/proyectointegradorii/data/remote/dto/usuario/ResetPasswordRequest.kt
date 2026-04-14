package proyecto.personal.proyectointegradorii.data.remote.dto.usuario

data class ResetPasswordRequest(
    val correo: String,
    val codigo: String,
    val nuevaContrasena: String
)