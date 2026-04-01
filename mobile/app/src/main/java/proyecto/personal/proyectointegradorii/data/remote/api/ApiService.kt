package proyecto.personal.proyectointegradorii.data.remote.api

import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.RegisterRequest
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {

    // USUARIOS
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Usuario

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Usuario

    // PLATILLOS
    @GET("api/platillos")
    suspend fun getPlatillos(): List<PlatilloDto>

    // ÓRDENES
    @POST("api/ordenes/completa")
    suspend fun crearOrden(
        @Body request: OrdenRequest
    ): Response<Unit>
}