package proyecto.personal.proyectointegradorii.viewmodels.login

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.model.usuario.AppDatabase
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    private val dao = AppDatabase.getDatabase(application).usuarioDao()
    private val repository = UserRepository()

    private val _email = MutableStateFlow("")
    val email = _email.asStateFlow()

    private val _password = MutableStateFlow("")
    val password = _password.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _loginSuccess = MutableStateFlow(false)
    val loginSuccess = _loginSuccess.asStateFlow()

    private val _generalErrorMessage = MutableStateFlow<String?>(null)
    val generalErrorMessage = _generalErrorMessage.asStateFlow()

    private val _emailError = MutableStateFlow<String?>(null)
    val emailError = _emailError.asStateFlow()

    private val _passwordError = MutableStateFlow<String?>(null)
    val passwordError = _passwordError.asStateFlow()

    fun onEmailChange(newEmail: String){
        _email.value = newEmail
        _emailError.value = null
        _generalErrorMessage.value = null
    }

    fun onPasswordChange(newPassword: String){
        _password.value = newPassword
        _passwordError.value = null
        _generalErrorMessage.value = null
    }

    fun login() {
        var isValid = true

        if (_email.value.isBlank()) {
            _emailError.value = "El correo no puede estar vacío"
            isValid = false
        }

        if (_password.value.isBlank()) {
            _passwordError.value = "La contraseña no puede estar vacía"
            isValid = false
        }

        if (!isValid) return

        viewModelScope.launch {
            _isLoading.value = true

            val usuario = repository.login(
                _email.value,
                _password.value
            )

            if (usuario != null) {
                _loginSuccess.value = true
            } else {
                _generalErrorMessage.value = "Credenciales incorrectas"
            }

            _isLoading.value = false
        }
    }
}