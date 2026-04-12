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

    // States para los valores
    private val _name = MutableStateFlow("")
    val name = _name.asStateFlow()

    private val _email = MutableStateFlow("")
    val email = _email.asStateFlow()

    private val _password = MutableStateFlow("")
    val password = _password.asStateFlow()

    private val _confirmPassword = MutableStateFlow("")
    val confirmPassword = _confirmPassword.asStateFlow()

    // States para los errores
    private val _errorName = MutableStateFlow<String?>(null)
    val errorName = _errorName.asStateFlow()

    private val _errorEmail = MutableStateFlow<String?>(null)
    val errorEmail = _errorEmail.asStateFlow()

    private val _errorPassword = MutableStateFlow<String?>(null)
    val errorPassword = _errorPassword.asStateFlow()

    private val _errorConfirmPassword = MutableStateFlow<String?>(null)
    val errorConfirmPassword = _errorConfirmPassword.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _success = MutableStateFlow(false)
    val success = _success.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    // --- FUNCIONES DE CAMBIO (REACCIÓN AL MOMENTO) ---

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
        // Re-validamos confirmación por si ya había escrito algo
        validateConfirmPassword(_confirmPassword.value)
    }

    fun onConfirmPasswordChange(newConfirmPassword: String) {
        _confirmPassword.value = newConfirmPassword
        validateConfirmPassword(newConfirmPassword)
    }

    private fun validateName(value: String) {
        // Solo letras (incluyendo acentos y ñ) y espacios sencillos
        val nameRegex = Regex("^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$")

        _errorName.value = when {
            value.isBlank() -> "Este campo es obligatorio."
            // detectan espacios fantasmas al inicio o final
            value.startsWith(" ") || value.endsWith(" ") -> "No debe tener espacios al inicio ni al final."
            // busca si el usuario puso dos espacios juntos
            value.contains("  ") -> "No se permite más de un espacio entre nombres."
            // comparamos todo el nombre contra el regex
            !value.matches(nameRegex) -> "No se permiten números, caracteres especiales ni emojis."
            // blindaje de longitud
            value.length !in 2..45 -> "El nombre debe tener entre 2 y 45 caracteres."
            else -> null
        }
    }

    private fun validateEmail(value: String) {
        // 1. Dividimos el texto en dos partes usando el '@' como referencia
        val parts = value.split("@")

        // Si hay una parte antes del '@', la guardamos en 'username', si no, queda vacío
        val username = if (parts.size >= 1) parts[0] else ""

        // Si hay una parte después del '@', le pegamos el '@' y lo guardamos como 'domain'
        val domain = if (parts.size >= 2) "@" + parts[1] else ""

        // Regex para el usuario: Letras, números, puntos, guiones y guiones bajos
        val usernameRegex = Regex("^[a-zA-Z0-9._-]+$")
        val isValidDomain = domain == "@gmail.com" || domain == "@utez.edu.mx"

        _errorEmail.value = when {
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

        _errorPassword.value = when {
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
        _errorConfirmPassword.value = when {
            value != _password.value -> "Las contraseñas no coinciden."
            else -> null
        }
    }

    fun registrar() {
        // Ejecutamos todas las validaciones una última vez
        validateName(_name.value)
        validateEmail(_email.value)
        validatePassword(_password.value)
        validateConfirmPassword(_confirmPassword.value)

        // Si hay algún error activo, no procedemos
        if (_errorName.value != null || _errorEmail.value != null ||
            _errorPassword.value != null || _errorConfirmPassword.value != null) {
            return
        }

        viewModelScope.launch {
            _isLoading.value = true
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
                _errorMessage.value = "Error de conexión"
            } finally {
                _isLoading.value = false
            }
        }
    }
}