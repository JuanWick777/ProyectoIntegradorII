package proyecto.personal.proyectointegradorii.viewmodels.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.data.repositories.PlatilloRepository

class HomeViewModel : ViewModel() {

    private val repository = PlatilloRepository()

    private val _platillos = MutableStateFlow<List<PlatilloDto>>(emptyList())
    val platillos = _platillos.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    init {
        cargarPlatillos()
    }

    private fun cargarPlatillos() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _platillos.value = repository.obtenerPlatillos()
            } catch (e: Exception) {
                e.printStackTrace()
            }
            _isLoading.value = false
        }
    }
}