package proyecto.personal.proyectointegradorii.viewmodels.cart

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import proyecto.personal.proyectointegradorii.data.model.cart.CartItem
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import proyecto.personal.proyectointegradorii.data.remote.api.ApiService
import proyecto.personal.proyectointegradorii.data.remote.dto.detalleorden.DetalleOrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenRequest
import proyecto.personal.proyectointegradorii.data.remote.network.RetrofitClient
import proyecto.personal.proyectointegradorii.data.repositories.OrdenRepository
import retrofit2.Retrofit

class CartViewModel : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems = _cartItems.asStateFlow()

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
            clienteId = clienteId,
            mesaId = mesaId,
            detalles = detalles
        )

        viewModelScope.launch {
            try {
                val repo = OrdenRepository(RetrofitClient.api)
                val success = repo.crearOrden(request)

                if (success) {
                    _cartItems.value = emptyList()
                    println("Pedido enviado correctamente")
                } else {
                    println("Error al enviar pedido")
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}