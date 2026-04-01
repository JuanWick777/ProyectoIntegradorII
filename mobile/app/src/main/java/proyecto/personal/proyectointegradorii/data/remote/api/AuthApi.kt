package proyecto.personal.proyectointegradorii.data.remote.api

import proyecto.personal.proyectointegradorii.data.remote.dto.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.RegisterRequest
import proyecto.personal.proyectointegradorii.data.model.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.PlatilloDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface AuthApi {

    // USUARIOS
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Usuario

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Usuario

    // PLATILLOS
    @GET("api/platillos")
    suspend fun getPlatillos(): List<PlatilloDto>
}