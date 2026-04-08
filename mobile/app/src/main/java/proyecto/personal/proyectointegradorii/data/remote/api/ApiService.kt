package proyecto.personal.proyectointegradorii.data.remote.api

import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.RegisterRequest
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {

    // USUARIOS
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Usuario

    // PLATILLOS
    @GET("api/platillos")
    suspend fun getPlatillos(): List<PlatilloDto>

    // ÓRDENES
    @POST("api/ordenes/completa")
    suspend fun crearOrden(
        @Body request: OrdenRequest
    ): OrdenResponseDTO

    @GET("api/ordenes/{id}")
    suspend fun obtenerOrden(
        @Path("id") id: Long
    ): OrdenResponseDTO

    // PRUEBAS
    @GET("api/auth/me")
    suspend fun getCurrentUser(): Response<LoginResponse>
}