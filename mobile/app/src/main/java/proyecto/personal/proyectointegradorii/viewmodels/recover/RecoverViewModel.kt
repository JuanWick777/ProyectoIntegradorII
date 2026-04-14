package proyecto.personal.proyectointegradorii.viewmodels.recover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
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

    fun onEmailChange(newEmail: String) {
        _email.value = newEmail
        validateEmail(newEmail)
    }

    fun onCodeChange(newCode: String) {
        if (newCode.length <= 6 && newCode.all { it.isDigit() }) {
            _code.value = newCode
            _codeError.value = null
        }
    }

    fun onNPasswordChange(newNPassword: String) {
        _nPassword.value = newNPassword
        validatePassword(newNPassword)
    }

    fun onCPasswordChange(newCPassword: String) {
        _cPassword.value = newCPassword
        validateConfirmPassword(newCPassword)
    }

    private fun validateEmail(value: String) {
        // 1. Dividimos el texto en dos partes usando el '@' como referencia
        val parts = value.split("@")

        // Si hay una parte antes del '@', la guardamos en 'username', si no, queda vacío
        val username = if (parts.isNotEmpty()) parts[0] else ""

        // Si hay una parte después del '@', le pegamos el '@' y lo guardamos como 'domain'
        val domain = if (parts.size >= 2) "@" + parts[1] else ""

        // Regex para el usuario: Letras, números, puntos, guiones y guiones bajos
        val usernameRegex = Regex("^[a-zA-Z0-9._-]+$")
        val isValidDomain = domain == "@gmail.com" || domain == "@utez.edu.mx"

        _emailError.value = when {
            value.isBlank() -> "El correo electrónico es obligatorio."
            value.contains(" ") -> "El correo no puede contener espacios."
            !value.contains("@") -> "El correo debe incluir un '@'."
            username.isEmpty() -> "El nombre de usuario no puede estar vacío."
            // Validamos que el usuario (antes del @) no tenga cosas raras
            !username.matches(usernameRegex) -> "Solo se admiten letras, números, '.', '_' y '-'."
            // Aquí está tu blindaje de longitud SIN CONTAR el dominio
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
            value.isBlank() -> "La contraseña es obligatoria."
            value.length !in 8..30 -> "Debe tener entre 8 y 30 caracteres."
            !noSpaces -> "No puede contener espacios."
            !hasUpperCase -> "Debe incluir al menos una mayúscula."
            !hasDigit -> "Debe incluir al menos un número."
            !hasSpecial -> "Debe incluir al menos un carácter especial."
            !hasLowerCase -> "Debe incluir minúsculas."
            else -> null
        }
    }

    private fun validateConfirmPassword(value: String) {
        _npasswordError.value = when {
            value != _nPassword.value -> "Las contraseñas no coinciden."
            else -> null
        }
    }

    private fun validateCode(value: String){
        _codeError.value = when {
            value.isBlank() -> "El código es obligatorio."
            value.length < 6 -> "El código debe ser de 6 dígitos."
            value.length > 6 -> "El código debe ser de 6 dígitos."
            else -> null
        }
    }


    fun sendRecoveryCode(){
        validateEmail(_email.value)
        if (_emailError.value != null) return

        viewModelScope.launch {
            _isLoading.value = true
            _generalMessage.value = null

            // Llamamos a la API
            val result = repository.forgotPassword(_email.value)

            result.fold(
                onSuccess = { mensaje ->
                    _codeSent.value = true
                    _generalMessage.value = mensaje // "Si el correo existe..."
                },
                onFailure = { error ->
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

            // Llamamos a la API real
            val result = repository.resetPassword(_email.value, _code.value, _nPassword.value)

            result.fold(
                onSuccess = { mensaje ->
                    _generalMessage.value = mensaje // "Contraseña actualizada exitosamente."
                    // Aquí podrías hacer que navegue al Login automáticamente después de un delay
                },
                onFailure = { error ->
                    _codeError.value = error.message ?: "Error al verificar el código"
                }
            )

            _isLoading.value = false
        }
    }
}