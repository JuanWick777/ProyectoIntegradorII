package proyecto.personal.proyectointegradorii.data.repositories

import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.RegisterRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.UpdateProfileRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.UploadResponse
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient
import java.io.File

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

    suspend fun updateProfile(
        nombre: String,
        correo: String,
        contrasenaActual: String?,
        fotoPerfil: String?
    ): LoginResponse {
        return RetrofitClient.api.updateProfile(
            UpdateProfileRequest(
                nombre = nombre,
                correo = correo,
                contrasenaActual = contrasenaActual,
                fotoPerfil = fotoPerfil
            )
        )
    }

    suspend fun uploadProfilePhoto(file: File): UploadResponse {
        val requestFile = file.asRequestBody("image/jpeg".toMediaTypeOrNull())
        val body = MultipartBody.Part.createFormData("file", file.name, requestFile)
        return RetrofitClient.api.uploadProfilePhoto(body)
    }
}