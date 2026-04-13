package proyecto.personal.proyectointegradorii.data.remote.dto.usuario

data class UpdateProfileRequest(
    val nombre: String,
    val correo: String,
    val contrasena: String? = null,
    val contrasenaActual: String? = null,
    val fotoPerfil: String? = null
)