package proyecto.personal.proyectointegradorii.ui.screens.internal.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel

@Composable
fun SCart(cartViewModel: CartViewModel) {

    val items by cartViewModel.cartItems.collectAsState()

    val orden by cartViewModel.ordenActual.collectAsState()

    Column(modifier = Modifier
        .fillMaxSize()
        .background(BackgroundColor)) {

        InternalHeader(
            "Mi Carrito",
            30,
            Modifier,
        )

        Spacer(modifier = Modifier.height(10.dp))

        Column(
            modifier = Modifier.padding(
                horizontal = 20.dp,
                vertical = 15.dp
            )
        ) {
            LazyColumn {
                items(items) { item ->
                    Column {
                        Text(item.platillo.nombre)
                        Text("Cantidad: ${item.cantidad}")
                        Text("Subtotal: $${item.subtotal()}")
                        Text("Nota: ${item.nota}")
                        Spacer(modifier = Modifier.height(10.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text("Total: $${cartViewModel.getTotal()}")

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = {
                    cartViewModel.confirmarPedido(
                        clienteId = 1,
                        mesaId = 1
                    )
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Confirmar pedido")
            }

            orden?.let {

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = when (it.estado.lowercase()) {
                        "pendiente_confirmacion" -> "Confirmando..."
                        "confirmada" -> "Orden recibida"
                        "en_preparacion" -> "En preparación"
                        "lista" -> "Lista para servir"
                        "entregada" -> "Entregada"
                        else -> it.estado
                    }
                )
            }
        }

        println("Items en carrito: ${items.size}")
    }
}