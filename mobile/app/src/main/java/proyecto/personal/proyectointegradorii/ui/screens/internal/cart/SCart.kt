package proyecto.personal.proyectointegradorii.ui.screens.internal.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.alerts.successful.SuccessOrderDialog
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel

@Composable
fun SCart(cartViewModel: CartViewModel,
          navController: NavController,) {

    val items by cartViewModel.cartItems.collectAsState()
    var showSuccessDialog by remember { mutableStateOf(false) }

    val orden by cartViewModel.ordenActual.collectAsState()

    val total = cartViewModel.getTotal()
    val puntosGanados = (total / 200).toInt()

    LaunchedEffect(Unit) {
        cartViewModel.cargarUsuario()
    }

    val puntos by cartViewModel.puntosUsuario.collectAsState()

    val usarPuntos by cartViewModel.usarPuntos.collectAsState()

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

            GlobalText(
                "Total: $${cartViewModel.getTotal()}",
                18,
                TextColorDark,
                Modifier
            )

            Spacer(modifier = Modifier.height(10.dp))

            GlobalText(
                "Tienes $puntos puntos disponibles",
                14,
                TextColorDark,
                Modifier
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Usar puntos")

                Switch(
                    checked = usarPuntos,
                    onCheckedChange = {
                        if (puntos > 0) {
                            cartViewModel.togglePuntos()
                        }
                    }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            GlobalButton(
                "Confirmar Pedido",
                16,
                50,
                350,
                MainColor,
                MainColor,
                TextColorWhite,
                {
                    cartViewModel.confirmarPedido(
                        clienteId = 1,
                        mesaId = 1
                    )
                    showSuccessDialog = true
                },
                Modifier
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text("Ganarás $puntosGanados punto(s) con esta compra")

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

    if (showSuccessDialog) {
        SuccessOrderDialog(
            onDismiss = {
                showSuccessDialog = false
                navController.popBackStack()
            }
        )
    }
}