package proyecto.personal.proyectointegradorii.viewmodels.account

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.network.SessionManager
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository
import java.io.File

class PersonalDatesViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = UserRepository()

    private val _name = MutableStateFlow("")
    val name = _name.asStateFlow()

    private val _email = MutableStateFlow("")
    val email = _email.asStateFlow()

    private val _currentPassword = MutableStateFlow("")
    val currentPassword = _currentPassword.asStateFlow()

    private val _fotoPerfil = MutableStateFlow<String?>(null)
    val fotoPerfil = _fotoPerfil.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _saveSuccess = MutableStateFlow(false)
    val saveSuccess = _saveSuccess.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    fun onNameChange(value: String) {
        _name.value = value
        _errorMessage.value = null
    }

    fun onEmailChange(value: String) {
        _email.value = value
        _errorMessage.value = null
    }

    fun loadUser() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val user = repository.getCurrentUser()
                _name.value = user?.nombre.orEmpty()
                _email.value = user?.correo.orEmpty()
                _fotoPerfil.value = user?.fotoPerfil
            } catch (e: Exception) {
                _errorMessage.value = "No se pudieron cargar tus datos"
            }
            _isLoading.value = false
        }
    }

    fun onCurrentPasswordChange(value: String) {
        _currentPassword.value = value
        _errorMessage.value = null
    }

    fun uploadPhoto(file: File) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val response = repository.uploadProfilePhoto(file)
                _fotoPerfil.value = response.path
            } catch (e: Exception) {
                _errorMessage.value = e.message ?: "No se pudo subir la foto"
            }
            _isLoading.value = false
        }
    }

    fun saveProfile() {
        if (_name.value.isBlank()) {
            _errorMessage.value = "El nombre no puede estar vacío"
            return
        }

        if (_email.value.isBlank()) {
            _errorMessage.value = "El correo no puede estar vacío"
            return
        }

        _saveSuccess.value = false
        _errorMessage.value = null

        viewModelScope.launch {
            _isLoading.value = true
            try {
                val currentUser = repository.getCurrentUser()
                val correoCambio = currentUser?.correo?.trim() != _email.value.trim()

                if (correoCambio && _currentPassword.value.isBlank()) {
                    _errorMessage.value = "Ingresa tu contraseña actual para cambiar el correo"
                    _isLoading.value = false
                    return@launch
                }

                val response = repository.updateProfile(
                    nombre = _name.value.trim(),
                    correo = _email.value.trim(),
                    contrasenaActual = if (correoCambio) _currentPassword.value else null,
                    fotoPerfil = _fotoPerfil.value
                )

                if (!response.token.isNullOrBlank()) {
                    SessionManager.saveSession(
                        getApplication(),
                        response.token
                    )
                }

                _name.value = response.nombre
                _email.value = response.correo
                _fotoPerfil.value = response.fotoPerfil
                _currentPassword.value = ""
                _saveSuccess.value = true
            } catch (e: Exception) {
                _errorMessage.value = "No se pudieron guardar los cambios"
            }
            _isLoading.value = false
        }
    }

    fun resetSaveSuccess() {
        _saveSuccess.value = false
    }
}