package proyecto.personal.proyectointegradorii.viewmodels.account

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository

class ConfigurateViewModel : ViewModel() {

    private val repository = UserRepository()

    private val _currentPassword = MutableStateFlow("")
    val currentPassword = _currentPassword.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _deleteSuccess = MutableStateFlow(false)
    val deleteSuccess = _deleteSuccess.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    fun onCurrentPasswordChange(value: String) {
        _currentPassword.value = value
        _errorMessage.value = null
    }

    fun deleteAccount() {
        if (_currentPassword.value.isBlank()) {
            _errorMessage.value = "Ingresa tu contraseña actual"
            return
        }

        _isLoading.value = true
        _errorMessage.value = null
        _deleteSuccess.value = false

        viewModelScope.launch {
            try {
                repository.deleteAccount(_currentPassword.value)
                _deleteSuccess.value = true
            } catch (e: Exception) {
                _errorMessage.value = "No se pudo eliminar la cuenta"
            }
            _isLoading.value = false
        }
    }

    fun resetDeleteSuccess() {
        _deleteSuccess.value = false
    }
}