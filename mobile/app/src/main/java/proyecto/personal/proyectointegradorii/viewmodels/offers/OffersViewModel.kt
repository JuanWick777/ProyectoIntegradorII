package proyecto.personal.proyectointegradorii.viewmodels.offers

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.dto.promocion.PromocionDto
import proyecto.personal.proyectointegradorii.data.repositories.PromocionRepository

class OffersViewModel : ViewModel() {

    private val repository = PromocionRepository()

    private val _promociones = MutableStateFlow<List<PromocionDto>>(emptyList())
    val promociones = _promociones.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    fun cargarPromociones() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _promociones.value = repository.getPromociones()
            } catch (e: Exception) {
                _promociones.value = emptyList()
            }
            _isLoading.value = false
        }
    }
}
