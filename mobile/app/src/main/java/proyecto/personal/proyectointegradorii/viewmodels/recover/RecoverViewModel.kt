package proyecto.personal.proyectointegradorii.viewmodels.recover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class RecoverViewModel : ViewModel() {

    private val _email = MutableStateFlow("")
    val email = _email.asStateFlow()
    private val _code = MutableStateFlow("")
    val code = _code.asStateFlow()
    private val _nPassword = MutableStateFlow("")
    val nPassword = _nPassword.asStateFlow()
    private val _cPassword = MutableStateFlow("")
    val cPassword = _cPassword.asStateFlow()
    private val _emailError = MutableStateFlow<String?>(null)
    val emailError = _emailError.asStateFlow()
    private val _codeError = MutableStateFlow<String?>(null)
    val codeError = _codeError.asStateFlow()
    private val _passwordError = MutableStateFlow<String?>(null)
    val passwordError = _passwordError.asStateFlow()
    private val _generalMessage = MutableStateFlow<String?>(null)
    val generalMessage = _generalMessage.asStateFlow()
    private val _codeSent = MutableStateFlow(false)
    val codeSent = _codeSent.asStateFlow()
    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    fun onEmailChange(newEmail: String) {
        _email.value = newEmail
        _emailError.value = null
    }

    fun onCodeChange(newCode: String) {
        if (newCode.length <= 6 && newCode.all { it.isDigit() }) {
            _code.value = newCode
            _codeError.value = null
        }
    }

    fun onNPasswordChange(newNPassword: String) {
        _nPassword.value = newNPassword
        _passwordError.value = null
    }

    fun onCPasswordChange(newCPassword: String) {
        _cPassword.value = newCPassword
        _passwordError.value = null
    }

    fun sendRecoveryCode(){
        var isValid = true

        if (_email.value.isBlank()) {
            _emailError.value = "Ingresa el correo para buscar tu cuenta"
            isValid = false
        } else if (!_email.value.endsWith("@gmail.com")) {
            _emailError.value = "Debe ser un correo electronico válido (@gmail.com)."
            isValid = false
        }

        if (!isValid) return

        viewModelScope.launch {
            _isLoading.value = true
            _generalMessage.value = null
            delay(1500)

            if (_email.value == "admin@gmail.com" || _email.value == "tu@gmail.com") {
                _codeSent.value = true
                _generalMessage.value = "Código enviado a ${_email.value}"
            } else {
                _emailError.value = "Este correo no está registrado"
            }

            _isLoading.value = false
        }
    }

    fun resetPassword() {
        var isValid = true

        if (_code.value.length < 6) {
            _codeError.value = "El código debe ser de 6 dígitos."
            isValid = false
        }

        if (_nPassword.value.isBlank() || _nPassword.value.length < 8) {
            _passwordError.value = "La contraseña debe tener al menos 8 caracteres"
            isValid = false
        }

        if (_cPassword.value.isBlank() || _nPassword.value != _cPassword.value) {
            _passwordError.value = "Las contraseñas no coinciden"
            isValid = false
        }

        if (!isValid) return

        viewModelScope.launch {
            _isLoading.value = true
            delay(2000)

            if (_code.value == "123456") {
                println("¡Contraseña actualizada con éxito!")
                _generalMessage.value = "Tu contraseña ha sido actualizada exitosamente."

            } else {
                _codeError.value = "Código incorrecto o expirado"
            }

            _isLoading.value = false
        }
    }
}