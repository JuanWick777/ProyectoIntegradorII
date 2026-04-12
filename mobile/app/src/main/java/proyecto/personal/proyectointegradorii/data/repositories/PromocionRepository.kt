package proyecto.personal.proyectointegradorii.data.repositories

import proyecto.personal.proyectointegradorii.data.remote.dto.promocion.PromocionDto
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient

class PromocionRepository {
    suspend fun getPromociones(): List<PromocionDto> {
        return RetrofitClient.api.getPromociones()
    }
}
