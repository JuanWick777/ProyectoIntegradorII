package proyecto.personal.proyectointegradorii.data.repositories

import proyecto.personal.proyectointegradorii.data.remote.api.ApiService
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest

class OrdenRepository(private val api: ApiService) {

    suspend fun crearOrden(request: OrdenRequest): Boolean {
        val response = api.crearOrden(request)
        return response.isSuccessful
    }
}