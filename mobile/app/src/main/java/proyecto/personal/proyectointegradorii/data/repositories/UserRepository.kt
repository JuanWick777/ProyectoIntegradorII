package proyecto.personal.proyectointegradorii.data.repositories

import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.RegisterRequest
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient

class UserRepository {
    suspend fun login(email: String, password: String): LoginResponse? {
        return RetrofitClient.api.login(
            LoginRequest(email, password)
        )
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

    // PRUEBAS
    suspend fun getCurrentUser(): LoginResponse? {
        val response = RetrofitClient.api.getCurrentUser()
        return if (response.isSuccessful) {
            response.body()
        } else {
            throw RuntimeException("Error ${response.code()}")
        }
    }
}