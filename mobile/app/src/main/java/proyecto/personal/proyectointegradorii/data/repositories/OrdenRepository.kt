package proyecto.personal.proyectointegradorii.data.repositories

import proyecto.personal.proyectointegradorii.data.remote.api.ApiService
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO

class OrdenRepository(private val api: ApiService) {

    suspend fun crearOrden(request: OrdenRequest): OrdenResponseDTO {
        return api.crearOrden(request)
    }

    suspend fun obtenerOrden(id: Long): OrdenResponseDTO {
        return api.obtenerOrden(id)
    }
}