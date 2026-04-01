package proyecto.personal.proyectointegradorii.data.remote.dto

data class RegisterRequest(
    val nombreCompleto: String,
    val correo: String,
    val contrasena: String
)