package proyecto.personal.proyectointegradorii.data.repositories

import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONObject
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.DeleteAccountRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.ForgotPasswordRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.RegisterRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.ResetPasswordRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.UpdateProfileRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.UploadResponse
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient
import java.io.File

class UserRepository {
    suspend fun login(email: String, password: String): LoginResponse? {
        return try {
            RetrofitClient.api.login(
                LoginRequest(email, password)
            )
        } catch (e: Exception) {
            e.message
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
            e.message
            false
        }
    }

    suspend fun forgotPassword(correo: String): Result<String> {
        return try {
            val response = RetrofitClient.api.forgotPassword(ForgotPasswordRequest(correo))
            if (response.isSuccessful) {
                val body = response.body()
                Result.success(body?.message ?: "Codigo enviado")
            } else {
                val errorBody = response.errorBody()?.string()
                Result.failure(Exception(extractMessage(errorBody, "Error al enviar el codigo")))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun resetPassword(correo: String, codigo: String, nuevaContrasena: String): Result<String> {
        return try {
            val response = RetrofitClient.api.resetPassword(
                ResetPasswordRequest(correo, codigo, nuevaContrasena)
            )
            if (response.isSuccessful) {
                val body = response.body()
                Result.success(body?.message ?: "Contrasena actualizada")
            } else {
                val errorBody = response.errorBody()?.string()
                Result.failure(Exception(extractMessage(errorBody, "Error al actualizar la contrasena")))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

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

    suspend fun deleteAccount(contrasenaActual: String): Boolean {
        RetrofitClient.api.deleteAccount(
            DeleteAccountRequest(contrasenaActual = contrasenaActual)
        )
        return true
    }

    private fun extractMessage(raw: String?, fallback: String): String {
        if (raw.isNullOrBlank()) return fallback

        return try {
            val json = JSONObject(raw)
            json.optString("message")
                .takeIf { it.isNotBlank() }
                ?: json.optString("error").takeIf { it.isNotBlank() }
                ?: fallback
        } catch (_: Exception) {
            fallback
        }
    }
}
