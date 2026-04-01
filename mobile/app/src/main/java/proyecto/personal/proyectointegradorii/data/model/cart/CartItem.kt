package proyecto.personal.proyectointegradorii.data.model.cart

import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto

data class CartItem(
    val platillo: PlatilloDto,
    val cantidad: Int = 1,
    val nota: String = ""
) {
    fun subtotal(): Double {
        return cantidad * platillo.precio
    }
}