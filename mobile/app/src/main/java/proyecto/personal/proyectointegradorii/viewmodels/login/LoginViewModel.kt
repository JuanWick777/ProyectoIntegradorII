package proyecto.personal.proyectointegradorii.viewmodels.login

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import proyecto.personal.proyectointegradorii.data.remote.network.SessionManager
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository
import retrofit2.HttpException

class LoginViewModel(application: Application) : AndroidViewModel(application) {

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

    private val _usuario = MutableStateFlow<LoginResponse?>(null)
    val usuario = _usuario.asStateFlow()

    fun onEmailChange(newEmail: String){
        _email.value = newEmail
        validateEmail(newEmail)
    }

    fun onPasswordChange(newPassword: String){
        _password.value = newPassword
        validatePassword(newPassword)
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

        _passwordError.value = when {
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

    fun login() {
        validateEmail(_email.value)
        validatePassword(_password.value)

        // Si hay algún error en los estados de error, nos detenemos
        if (_emailError.value != null || _passwordError.value != null) return

        viewModelScope.launch {
            _isLoading.value = true

            try {
                val response = repository.login(
                    _email.value,
                    _password.value
                )

                if (response != null && !response.token.isNullOrBlank()) {
                    if (response.rol.uppercase() != "CLIENTE") {
                        _generalErrorMessage.value = "Esta app solo permite acceso a clientes"
                        _loginSuccess.value = false
                        _isLoading.value = false
                        return@launch
                    }


                    println("LOGIN RESPONSE: $response")

                    _usuario.value = response

                    SessionManager.saveSession(
                        getApplication(),
                        response.token!!
                    )

                    _loginSuccess.value = true

                } else {
                    _generalErrorMessage.value = "Credenciales incorrectas"
                }

            } catch (e: Exception) {
                _generalErrorMessage.value = when (e) {
                    is HttpException -> {
                        try {
                            e.response()?.errorBody()?.string() ?: "HTTP ${e.code()}"
                        } catch (_: Exception) {
                            "HTTP ${e.code()}"
                        }
                    }
                    else -> e.message ?: "Error de conexión"
                }
            }

            _isLoading.value = false
        }
    }
}