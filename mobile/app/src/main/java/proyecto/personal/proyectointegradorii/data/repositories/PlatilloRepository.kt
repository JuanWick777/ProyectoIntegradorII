package proyecto.personal.proyectointegradorii.data.repositories

import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient

class PlatilloRepository {
    suspend fun obtenerPlatillos(): List<PlatilloDto> {
        return RetrofitClient.api.getPlatillos()
    }
}