package proyecto.personal.proyectointegradorii.viewmodels.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.data.repositories.PlatilloRepository
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository


class HomeViewModel : ViewModel() {

    private val repository = PlatilloRepository()

    private val _platillos = MutableStateFlow<List<PlatilloDto>>(emptyList())
    val platillos = _platillos.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow<String?>(null)
    val selectedCategory = _selectedCategory.asStateFlow()

    val platillosFiltrados = combine(
        _platillos,
        _searchQuery,
        _selectedCategory
    ) { platillos, query, category ->
        platillos.filter { platillo ->
            val coincideBusqueda =
                query.isBlank() ||
                        platillo.nombre.contains(query, ignoreCase = true) ||
                        (platillo.descripcion?.contains(query, ignoreCase = true) == true)

            val coincideCategoria =
                category.isNullOrBlank() ||
                        platillo.categoriaNombre.equals(category, ignoreCase = true)

            coincideBusqueda && coincideCategoria && platillo.estaDisponible()
        }
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )

    val categorias = _platillos
        .map { lista ->
            lista.filter { it.estaDisponible() }
                .mapNotNull { it.categoriaNombre }
                .distinct()
                .sorted()
        }
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }

    fun onCategorySelected(category: String?) {
        _selectedCategory.value = category
    }

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    init {
        cargarPlatillos()
    }

    // PRUEBA PATROCINADA POR GEPETO
    private val userRepository = UserRepository()

    fun testAuth() {
        viewModelScope.launch {
            try {
                val user = userRepository.getCurrentUser()

                if (user != null) {
                    println("🔥 TOKEN FUNCIONA: ${user.correo}")
                } else {
                    println("💀 TOKEN NO FUNCIONA")
                }

            } catch (e: Exception) {
                println("💥 ERROR: ${e.message}")
            }
        }
    }

    private fun cargarPlatillos() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _platillos.value = repository.obtenerPlatillos()
            } catch (e: Exception) {
                e.printStackTrace()
            }
            _isLoading.value = false
        }
    }
}
