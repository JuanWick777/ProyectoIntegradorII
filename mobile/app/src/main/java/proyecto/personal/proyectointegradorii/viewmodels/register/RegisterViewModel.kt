package proyecto.personal.proyectointegradorii.viewmodels.register

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.model.usuario.Usuario
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository

class RegisterViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = UserRepository()

    private val _name = MutableStateFlow("")
    val name = _name.asStateFlow()

    private val _email = MutableStateFlow("")
    val email = _email.asStateFlow()

    private val _password = MutableStateFlow("")
    val password = _password.asStateFlow()

    private val _confirmPassword = MutableStateFlow("")
    val confirmPassword = _confirmPassword.asStateFlow()

    private val _acceptedTerms = MutableStateFlow(false)
    val acceptedTerms = _acceptedTerms.asStateFlow()

    private val _errorName = MutableStateFlow<String?>(null)
    val errorName = _errorName.asStateFlow()

    private val _errorEmail = MutableStateFlow<String?>(null)
    val errorEmail = _errorEmail.asStateFlow()

    private val _errorPassword = MutableStateFlow<String?>(null)
    val errorPassword = _errorPassword.asStateFlow()

    private val _errorConfirmPassword = MutableStateFlow<String?>(null)
    val errorConfirmPassword = _errorConfirmPassword.asStateFlow()

    private val _errorTerms = MutableStateFlow<String?>(null)
    val errorTerms = _errorTerms.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _success = MutableStateFlow(false)
    val success = _success.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    fun onNameChange(newName: String) {
        _name.value = newName
        validateName(newName)
    }

    fun onEmailChange(newEmail: String) {
        _email.value = newEmail
        validateEmail(newEmail)
    }

    fun onPasswordChange(newPassword: String) {
        _password.value = newPassword
        validatePassword(newPassword)
        validateConfirmPassword(_confirmPassword.value)
    }

    fun onConfirmPasswordChange(newConfirmPassword: String) {
        _confirmPassword.value = newConfirmPassword
        validateConfirmPassword(newConfirmPassword)
    }

    fun onAcceptedTermsChange(accepted: Boolean) {
        _acceptedTerms.value = accepted
        validateTerms(accepted)
    }

    private fun validateName(value: String) {
        val nameRegex = Regex("^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$")

        _errorName.value = when {
            value.isBlank() -> "Este campo es obligatorio."
            value.startsWith(" ") || value.endsWith(" ") -> "No debe tener espacios al inicio ni al final."
            value.contains("  ") -> "No se permite mas de un espacio entre nombres."
            !value.matches(nameRegex) -> "No se permiten numeros, caracteres especiales ni emojis."
            value.length !in 2..45 -> "El nombre debe tener entre 2 y 45 caracteres."
            else -> null
        }
    }

    private fun validateEmail(value: String) {
        val parts = value.split("@")
        val username = if (parts.isNotEmpty()) parts[0] else ""
        val domain = if (parts.size >= 2) "@" + parts[1] else ""
        val usernameRegex = Regex("^[a-zA-Z0-9._-]+$")
        val isValidDomain = domain == "@gmail.com" || domain == "@utez.edu.mx"

        _errorEmail.value = when {
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

        _errorPassword.value = when {
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
        _errorConfirmPassword.value = when {
            value != _password.value -> "Las contrasenas no coinciden."
            else -> null
        }
    }

    private fun validateTerms(value: Boolean) {
        _errorTerms.value = if (value) null else "Debes aceptar los terminos para continuar."
    }

    fun registrar() {
        validateName(_name.value)
        validateEmail(_email.value)
        validatePassword(_password.value)
        validateConfirmPassword(_confirmPassword.value)
        validateTerms(_acceptedTerms.value)

        if (_errorName.value != null ||
            _errorEmail.value != null ||
            _errorPassword.value != null ||
            _errorConfirmPassword.value != null ||
            _errorTerms.value != null
        ) {
            return
        }

        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            try {
                val successRegister = repository.register(
                    Usuario(
                        nombre_completo = _name.value.trim(),
                        correo_electronico = _email.value.trim(),
                        contrasena = _password.value
                    )
                )

                if (successRegister) {
                    _success.value = true
                } else {
                    _errorMessage.value = "El correo ya existe"
                }
            } catch (e: Exception) {
                _errorMessage.value = e.message ?: "Error de conexion"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
