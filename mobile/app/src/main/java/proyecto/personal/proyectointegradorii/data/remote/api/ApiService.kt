package proyecto.personal.proyectointegradorii.data.remote.api

import okhttp3.MultipartBody
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.RegisterRequest
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenPreviewDTO
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.data.remote.dto.promocion.PromocionDto
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.UpdateProfileRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.UploadResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Path

interface ApiService {

    // USUARIOS
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Usuario

    @PUT("api/auth/perfil")
    suspend fun updateProfile(
        @Body request: UpdateProfileRequest
    ): LoginResponse

    @Multipart
    @POST("api/auth/foto-perfil")
    suspend fun uploadProfilePhoto(
        @Part file: MultipartBody.Part
    ): UploadResponse

    // PLATILLOS
    @GET("api/platillos")
    suspend fun getPlatillos(): List<PlatilloDto>

    // OFERTAS
    @GET("api/promociones")
    suspend fun getPromociones(): List<PromocionDto>

    @POST("api/ordenes/preview")
    suspend fun previewOrden(
        @Body request: OrdenRequest
    ): OrdenPreviewDTO

    // ÓRDENES
    @POST("api/ordenes/completa")
    suspend fun crearOrden(
        @Body request: OrdenRequest
    ): OrdenResponseDTO

    @GET("api/ordenes/{id}")
    suspend fun obtenerOrden(
        @Path("id") id: Long
    ): OrdenResponseDTO

    @GET("api/ordenes/mis-ordenes")
    suspend fun obtenerMisOrdenes(): List<OrdenResponseDTO>


    // PRUEBAS
    @GET("api/auth/me")
    suspend fun getCurrentUser(): Response<LoginResponse>
}