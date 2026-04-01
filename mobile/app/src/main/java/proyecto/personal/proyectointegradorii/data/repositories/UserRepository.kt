package proyecto.personal.proyectointegradorii.data.repositories

import kotlinx.coroutines.delay
import proyecto.personal.proyectointegradorii.data.model.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.RegisterRequest
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient

class UserRepository {
    suspend fun login(correo: String, password: String): Usuario? {
        return try {
            RetrofitClient.api.login(
                LoginRequest(correo, password)
            )
        } catch (e: Exception) {
            null
        }
    }

    suspend fun register(usuario: Usuario): Boolean {
        return try {
            RetrofitClient.api.register(
                RegisterRequest(
                    nombreCompleto = usuario.nombre_completo,
                    correo = usuario.correo_electronico,
                    contrasena = usuario.contrasena
                )
            )
            true
        } catch (e: Exception) {
            false
        }
    }
}