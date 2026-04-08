package proyecto.personal.proyectointegradorii.viewmodels.cart

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import proyecto.personal.proyectointegradorii.data.model.cart.CartItem
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.api.ApiService
import proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden.DetalleOrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient
import proyecto.personal.proyectointegradorii.data.repositories.OrdenRepository
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository
import retrofit2.Retrofit

class CartViewModel : ViewModel() {
    private val repository = OrdenRepository(RetrofitClient.api)

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems = _cartItems.asStateFlow()

    private val _ordenActual = MutableStateFlow<OrdenResponseDTO?>(null)
    val ordenActual = _ordenActual.asStateFlow()

    private var pollingJob: Job? = null

    private val _usarPuntos = MutableStateFlow(false)
    val usarPuntos = _usarPuntos.asStateFlow()

    fun togglePuntos() {
        _usarPuntos.value = !_usarPuntos.value
    }

    private val _puntosUsuario = MutableStateFlow(0)
    val puntosUsuario = _puntosUsuario.asStateFlow()

    fun cargarUsuario() {
        viewModelScope.launch {
            val repo = UserRepository()
            val user = repo.getCurrentUser()

            if (user != null) {
                _puntosUsuario.value = user.puntosLealtad
            }
        }
    }

    fun addToCart(
        platillo: PlatilloDto,
        cantidad: Int,
        nota: String
    ) {
        val currentList = _cartItems.value.toMutableList()

        val index = currentList.indexOfFirst {
            it.platillo.id == platillo.id && it.nota == nota
        }

        if (index != -1) {
            val item = currentList[index]
            currentList[index] = item.copy(
                cantidad = item.cantidad + cantidad
            )
        } else {
            currentList.add(
                CartItem(
                    platillo = platillo,
                    cantidad = cantidad,
                    nota = nota
                )
            )
        }

        _cartItems.value = currentList
    }

    fun getTotal(): Double {
        return _cartItems.value.sumOf { it.subtotal() }
    }

    fun confirmarPedido(clienteId: Long, mesaId: Long) {

        val detalles = _cartItems.value.map {
            DetalleOrdenRequest(
                platilloId = it.platillo.id,
                cantidad = it.cantidad,
                nota = it.nota
            )
        }

        val request = OrdenRequest(
            mesaId = mesaId,
            detalles = detalles,
            usarPuntos = _usarPuntos.value
        )

        viewModelScope.launch {
            try {
                val orden = repository.crearOrden(request)

                _ordenActual.value = orden

                _cartItems.value = emptyList()

                startPolling()

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun startPolling() {
        val ordenId = _ordenActual.value?.id ?: return

        pollingJob?.cancel()

        pollingJob = viewModelScope.launch {
            while (true) {
                try {
                    val orden = repository.obtenerOrden(ordenId)
                    _ordenActual.value = orden

                    val estado = orden.estado.lowercase()

                    if (estado in listOf("entregada", "cancelada", "cerrada")) {
                        break
                    }

                } catch (e: Exception) {
                    e.printStackTrace()
                }

                delay(5000)
            }
        }
    }
}