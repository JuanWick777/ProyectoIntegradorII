package proyecto.personal.proyectointegradorii.viewmodels.account

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient
import proyecto.personal.proyectointegradorii.data.repositories.OrdenRepository

class HistoryViewModel : ViewModel() {

    private val repository = OrdenRepository(RetrofitClient.api)

    private val _ordenes = MutableStateFlow<List<OrdenResponseDTO>>(emptyList())
    val ordenes = _ordenes.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    fun cargarHistorial() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null

            try {
                _ordenes.value = repository.obtenerMisOrdenes()
            } catch (e: Exception) {
                _errorMessage.value = "No se pudo cargar el historial"
            }

            _isLoading.value = false
        }
    }
}
