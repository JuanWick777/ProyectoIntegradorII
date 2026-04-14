package proyecto.personal.proyectointegradorii.viewmodels.cart

import android.content.Context
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import proyecto.personal.proyectointegradorii.data.model.cart.CartItem
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.local.CartStateStorage
import proyecto.personal.proyectointegradorii.data.remote.api.ApiService
import proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden.DetalleOrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenPreviewDTO
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient
import proyecto.personal.proyectointegradorii.data.repositories.OrdenRepository
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository
import retrofit2.Retrofit

class CartViewModel : ViewModel() {
    private val repository = OrdenRepository(RetrofitClient.api)

    private var appContext: Context? = null
    private var initialized = false

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems = _cartItems.asStateFlow()

    private val _ordenActual = MutableStateFlow<OrdenResponseDTO?>(null)
    val ordenActual = _ordenActual.asStateFlow()

    private val _ordenes = MutableStateFlow<List<OrdenResponseDTO>>(emptyList())
    val ordenes = _ordenes.asStateFlow()

    private val _previewOrden = MutableStateFlow<OrdenPreviewDTO?>(null)
    val previewOrden = _previewOrden.asStateFlow()

    private var lastOrdersLoadAt: Long? = null

    fun initialize(context: Context) {
        if (initialized) return

        appContext = context.applicationContext
        restoreState()
        initialized = true
    }

    private fun restoreState() {
        val context = appContext ?: return

        _cartItems.value = CartStateStorage.getCartItems(context)
        _ordenActual.value = CartStateStorage.getOrdenActual(context)
        _ordenes.value = CartStateStorage.getOrdenes(context)
        _mesaSeleccionada.value = CartStateStorage.getMesaSeleccionada(context)

        if (_ordenActual.value != null) {
            startPolling()
        }
    }

    private fun persistState() {
        val context = appContext ?: return

        CartStateStorage.saveCartItems(context, _cartItems.value)
        CartStateStorage.saveOrdenActual(context, _ordenActual.value)
        CartStateStorage.saveOrdenes(context, _ordenes.value)
        CartStateStorage.saveMesaSeleccionada(context, _mesaSeleccionada.value)
    }

    fun clearPersistedState() {
        val context = appContext ?: return

        _cartItems.value = emptyList()
        _ordenActual.value = null
        _ordenes.value = emptyList()
        _mesaSeleccionada.value = null
        _usarPuntos.value = false

        pollingJob?.cancel()
        CartStateStorage.clear(context)
    }

    fun cancelarPedidoAntesDeConfirmar() {
        _cartItems.value = emptyList()
        _usarPuntos.value = false
        _previewOrden.value = null
        persistState()
    }

    fun cargarPreviewOrden() {
        val mesaId = _mesaSeleccionada.value ?: return

        val detalles = _cartItems.value.map {
            DetalleOrdenRequest(
                platilloId = it.platillo.id,
                cantidad = it.cantidad,
                nota = it.nota
            )
        }

        if (detalles.isEmpty()) {
            _previewOrden.value = null
            return
        }

        val request = OrdenRequest(
            mesaId = mesaId,
            detalles = detalles,
            usarPuntos = _usarPuntos.value
        )

        previewJob?.cancel()
        previewJob = viewModelScope.launch {
            try {
                _previewOrden.value = RetrofitClient.api.previewOrden(request)
            } catch (e: Exception) {
                _previewOrden.value = null
            }
        }
    }

    fun cargarMisOrdenes(force: Boolean = false) {
        val now = System.currentTimeMillis()
        val recentlyLoaded = lastOrdersLoadAt != null && (now - lastOrdersLoadAt!!) < 10_000

        if (!force && recentlyLoaded) return

        viewModelScope.launch {
            try {
                val data = RetrofitClient.api.obtenerMisOrdenes()
                _ordenes.value = data
                lastOrdersLoadAt = System.currentTimeMillis()
                persistState()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun limpiarOrdenActual() {
        pollingJob?.cancel()
        pollingJob = null
        _ordenActual.value = null
        persistState()
    }

    fun setOrdenActual(orden: OrdenResponseDTO) {
        _ordenActual.value = orden
        persistState()
        startPolling()
    }

    private var pollingJob: Job? = null

    private var previewJob: Job? = null

    private val _usarPuntos = MutableStateFlow(false)
    val usarPuntos = _usarPuntos.asStateFlow()

    private val _pedidoConfirmado = MutableStateFlow(false)
    val pedidoConfirmado = _pedidoConfirmado.asStateFlow()

    fun togglePuntos() {
        _usarPuntos.value = !_usarPuntos.value
        cargarPreviewOrden()
    }

    private val _puntosUsuario = MutableStateFlow(0)
    val puntosUsuario = _puntosUsuario.asStateFlow()

    fun cargarUsuario() {
        viewModelScope.launch {
            try {
                val repo = UserRepository()
                val user = repo.getCurrentUser()

                if (user != null) {
                    _puntosUsuario.value = user.puntosLealtad
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private val _mesaSeleccionada = MutableStateFlow<Long?>(null)
    val mesaSeleccionada = _mesaSeleccionada.asStateFlow()

    fun setMesaSeleccionada(mesaId: Long) {
        _mesaSeleccionada.value = mesaId
        persistState()
        cargarPreviewOrden()
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
        persistState()
        cargarPreviewOrden()
    }

    fun getTotal(): Double {
        return _cartItems.value.sumOf { it.subtotal() }
    }

    fun confirmarPedido(mesaId: Long) {
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
                _usarPuntos.value = false
                _previewOrden.value = null
                persistState()
                cargarMisOrdenes(force = true)
                cargarUsuario()
                startPolling()
                _pedidoConfirmado.value = true
            } catch (e: Exception) {
                _pedidoConfirmado.value = false
                e.printStackTrace()
            }
        }
    }

    fun resetPedidoConfirmado() {
        _pedidoConfirmado.value = false
    }

    fun startPolling() {
        val ordenId = _ordenActual.value?.id ?: return

        pollingJob?.cancel()

        pollingJob = viewModelScope.launch {
            while (true) {
                try {
                    val orden = repository.obtenerOrden(ordenId)
                    _ordenActual.value = orden
                    persistState()

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