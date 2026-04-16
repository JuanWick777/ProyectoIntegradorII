package proyecto.personal.proyectointegradorii.viewmodels.recover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository

class RecoverViewModel : ViewModel() {

    private val repository = UserRepository()
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
    private val _npasswordError = MutableStateFlow<String?>(null)
    val npasswordError = _npasswordError.asStateFlow()
    private val _cpasswordError = MutableStateFlow<String?>(null)
    val cpasswordError = _cpasswordError.asStateFlow()
    private val _generalMessage = MutableStateFlow<String?>(null)
    val generalMessage = _generalMessage.asStateFlow()
    private val _codeSent = MutableStateFlow(false)
    val codeSent = _codeSent.asStateFlow()
    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()
    private val _resetSuccess = MutableStateFlow(false)
    val resetSuccess = _resetSuccess.asStateFlow()

    fun onEmailChange(newEmail: String) {
        _email.value = newEmail
        _generalMessage.value = null
        validateEmail(newEmail)
    }

    fun onCodeChange(newCode: String) {
        if (newCode.length <= 6 && newCode.all { it.isDigit() }) {
            _code.value = newCode
            _codeError.value = null
            _generalMessage.value = null
        }
    }

    fun onNPasswordChange(newNPassword: String) {
        _nPassword.value = newNPassword
        _generalMessage.value = null
        validatePassword(newNPassword)
    }

    fun onCPasswordChange(newCPassword: String) {
        _cPassword.value = newCPassword
        _generalMessage.value = null
        validateConfirmPassword(newCPassword)
    }

    private fun validateEmail(value: String) {
        val parts = value.split("@")
        val username = if (parts.isNotEmpty()) parts[0] else ""
        val domain = if (parts.size >= 2) "@" + parts[1] else ""
        val usernameRegex = Regex("^[a-zA-Z0-9._-]+$")
        val isValidDomain = domain == "@gmail.com" || domain == "@utez.edu.mx"

        _emailError.value = when {
            value.isBlank() -> "El correo electronico es obligatorio."
            value.contains(" ") -> "El correo no puede contener espacios."
            !value.contains("@") -> "El correo debe incluir un '@'."
            username.isEmpty() -> "El nombre de usuario no puede estar vacio."
            !username.matches(usernameRegex) -> "Solo se admiten letras, numeros, '.', '_' y '-'."
            username.length !in 6..30 -> "El correo debe tener entre 6 y 30 caracteres."
            !isValidDomain -> "Solo se admiten @gmail.com o @utez.edu.mx"
            else -> null
        }
    }

    private fun validatePassword(value: String) {
        val hasUpperCase = value.any { it.isUpperCase() }
        val hasLowerCase = value.any { it.isLowerCase() }
        val hasDigit = value.any { it.isDigit() }
        val hasSpecial = value.any { !it.isLetterOrDigit() }
        val noSpaces = !value.contains(" ")

        _npasswordError.value = when {
            value.isBlank() -> "La contrasena es obligatoria."
            value.length !in 8..30 -> "Debe tener entre 8 y 30 caracteres."
            !noSpaces -> "No puede contener espacios."
            !hasUpperCase -> "Debe incluir al menos una mayuscula."
            !hasDigit -> "Debe incluir al menos un numero."
            !hasSpecial -> "Debe incluir al menos un caracter especial."
            !hasLowerCase -> "Debe incluir minusculas."
            else -> null
        }
    }

    private fun validateConfirmPassword(value: String) {
        _cpasswordError.value = when {
            value.isBlank() -> "Confirma tu contrasena."
            value != _nPassword.value -> "Las contrasenas no coinciden."
            else -> null
        }
    }

    private fun validateCode(value: String) {
        _codeError.value = when {
            value.isBlank() -> "El codigo es obligatorio."
            value.length != 6 -> "El codigo debe ser de 6 digitos."
            else -> null
        }
    }

    fun sendRecoveryCode() {
        validateEmail(_email.value)
        if (_emailError.value != null) return

        viewModelScope.launch {
            _isLoading.value = true
            _generalMessage.value = null

            val result = repository.forgotPassword(_email.value)

            result.fold(
                onSuccess = { mensaje ->
                    _codeSent.value = true
                    _emailError.value = null
                    _generalMessage.value = mensaje
                },
                onFailure = { error ->
                    _generalMessage.value = null
                    _emailError.value = error.message ?: "Error de red"
                }
            )

            _isLoading.value = false
        }
    }

    fun resetPassword() {
        validateCode(_code.value)
        validatePassword(_nPassword.value)
        validateConfirmPassword(_cPassword.value)

        if (_codeError.value != null || _npasswordError.value != null || _cpasswordError.value != null) return

        viewModelScope.launch {
            _isLoading.value = true
            _generalMessage.value = null
            _resetSuccess.value = false

            val result = repository.resetPassword(_email.value, _code.value, _nPassword.value)

            result.fold(
                onSuccess = { mensaje ->
                    _codeError.value = null
                    _generalMessage.value = mensaje
                    _resetSuccess.value = true
                },
                onFailure = { error ->
                    _resetSuccess.value = false
                    _codeError.value = error.message ?: "Error al verificar el codigo"
                }
            )

            _isLoading.value = false
        }
    }

    fun consumeResetSuccess() {
        _resetSuccess.value = false
    }
}
