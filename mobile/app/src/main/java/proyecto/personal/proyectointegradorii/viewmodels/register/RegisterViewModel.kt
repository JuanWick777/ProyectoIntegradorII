package proyecto.personal.proyectointegradorii.viewmodels.register

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.model.usuario.AppDatabase
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository

class RegisterViewModel(application: Application) : AndroidViewModel(application) {

    private val dao = AppDatabase.getDatabase(application).usuarioDao()
    private val repository = UserRepository()

    private val _name = MutableStateFlow("")
    val name = _name.asStateFlow()

    private val _email = MutableStateFlow("")
    val email = _email.asStateFlow()

    private val _password = MutableStateFlow("")
    val password = _password.asStateFlow()

    private val _confirmPassword = MutableStateFlow("")
    val confirmPassword = _confirmPassword.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _success = MutableStateFlow(false)
    val success = _success.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    private val _errorName = MutableStateFlow<String?>(null)
    val errorName = _errorName.asStateFlow()

    private val _errorEmail = MutableStateFlow<String?>(null)
    val errorEmail = _errorEmail.asStateFlow()

    private val _errorPassword = MutableStateFlow<String?>(null)
    val errorPassword = _errorPassword.asStateFlow()

    private val _errorConfirmPassword = MutableStateFlow<String?>(null)
    val errorConfirmPassword = _errorConfirmPassword.asStateFlow()

    fun onNameChange(newName: String){
        _name.value = newName
        _errorName.value = null
    }

    fun onEmailChange(newEmail: String){
        _email.value = newEmail
        _errorEmail.value = null
    }

    fun onPasswordChange(newPassword: String){
        _password.value = newPassword
        _errorPassword.value = null
    }

    fun onConfirmPasswordChange(newConfirmPassword: String){
        _confirmPassword.value = newConfirmPassword
        _errorConfirmPassword.value = null
    }

    fun registrar() {
        var isValid = true

        if (_name.value.isBlank()) {
            _errorName.value = "Nombre obligatorio"
            isValid = false
        }

        if (_email.value.isBlank()) {
            _errorEmail.value = "Correo obligatorio"
            isValid = false
        }

        if (_password.value.length < 8) {
            _errorPassword.value = "Mínimo 8 caracteres"
            isValid = false
        }

        if (_password.value != _confirmPassword.value) {
            _errorConfirmPassword.value = "No coinciden"
            isValid = false
        }

        if (!isValid) return

        viewModelScope.launch {
            _isLoading.value = true

            val successRegister = repository.register(
                Usuario(
                    nombre_completo = _name.value,
                    correo_electronico = _email.value,
                    contrasena = _password.value
                )
            )

            if (successRegister) {
                _success.value = true
            } else {
                _errorMessage.value = "El correo ya existe"
            }

            _isLoading.value = false
        }
    }
}