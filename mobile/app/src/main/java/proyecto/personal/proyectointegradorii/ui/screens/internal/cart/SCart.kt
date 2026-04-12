package proyecto.personal.proyectointegradorii.ui.screens.internal.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.alerts.successful.SuccessOrderDialog
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel

@Composable
fun SCart(
    cartViewModel: CartViewModel,
    navController: NavController,
) {
    val items by cartViewModel.cartItems.collectAsState()
    val orden by cartViewModel.ordenActual.collectAsState()
    val puntos by cartViewModel.puntosUsuario.collectAsState()
    val usarPuntos by cartViewModel.usarPuntos.collectAsState()
    val mesaId by cartViewModel.mesaSeleccionada.collectAsState()

    var showSuccessDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        cartViewModel.cargarUsuario()

        if (cartViewModel.mesaSeleccionada.value == null) {
            cartViewModel.setMesaSeleccionada(1)
        }
    }


    val subtotal = cartViewModel.getTotal()
    val descuentoEstimado = if (usarPuntos) minOf(puntos.toDouble(), subtotal) else 0.0
    val totalEstimado = subtotal - descuentoEstimado
    val puntosGanados = (subtotal / 200).toInt()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        InternalHeader(
            "Mi Carrito",
            30,
            Modifier,
        )

        Spacer(modifier = Modifier.height(10.dp))

        when {
            orden != null -> {
                Column(
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 15.dp)
                ) {
                    GlobalText(
                        "Pedido #${orden!!.id}",
                        22,
                        TextColorDark,
                        Modifier
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = when (orden!!.estado.lowercase()) {
                            "pendiente_confirmacion" -> "Confirmando..."
                            "confirmada" -> "Orden recibida"
                            "en_preparacion" -> "En preparación"
                            "lista" -> "Lista para servir"
                            "entregada" -> "Entregada"
                            "cancelada" -> "Cancelada"
                            "cerrada" -> "Cerrada"
                            else -> orden!!.estado
                        }
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    LazyColumn {
                        items(orden!!.detalles) { item ->
                            Column(modifier = Modifier.padding(bottom = 10.dp)) {
                                Text(item.nombre ?: "Platillo")
                                Text("Cantidad: ${item.cantidad}")
                                Text("Nota: ${item.nota ?: "-"}")
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Total: $${orden!!.total}")

                    GlobalButton(
                        "Hacer otro pedido",
                        16,
                        50,
                        350,
                        MainColor,
                        MainColor,
                        TextColorWhite,
                        {
                            cartViewModel.limpiarOrdenActual()
                        },
                        Modifier
                    )

                }
            }

            items.isEmpty() -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    verticalArrangement = Arrangement.Center
                ) {
                    GlobalText(
                        "No se ha realizado ningún pedido",
                        22,
                        TextColorDark,
                        Modifier
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text("Agrega productos desde el menú para comenzar.")
                }
            }

            else -> {
                Column(
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 15.dp)
                ) {
                    LazyColumn(
                        modifier = Modifier.weight(1f, fill = false)
                    ) {
                        items(items) { item ->
                            Column(modifier = Modifier.padding(bottom = 10.dp)) {
                                Text(item.platillo.nombre)
                                Text("Cantidad: ${item.cantidad}")
                                Text("Subtotal: $${item.subtotal()}")
                                Text("Nota: ${item.nota}")
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    GlobalText(
                        "Subtotal: $${"%.2f".format(subtotal)}",
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

                    Spacer(modifier = Modifier.height(10.dp))

                    if (usarPuntos) {
                        Text("Descuento estimado: $${"%.2f".format(descuentoEstimado)}")
                        Spacer(modifier = Modifier.height(6.dp))
                    }

                    GlobalText(
                        "Total estimado: $${"%.2f".format(totalEstimado)}",
                        18,
                        TextColorDark,
                        Modifier
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text("Ganarás $puntosGanados punto(s) con esta compra")

                    Spacer(modifier = Modifier.height(20.dp))

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (mesaId != null) {
                            "Mesa seleccionada: $mesaId"
                        } else {
                            "No hay mesa seleccionada"
                        }
                    )

                    GlobalButton(
                        "Confirmar Pedido",
                        16,
                        50,
                        350,
                        MainColor,
                        MainColor,
                        TextColorWhite,
                        {
                            if (mesaId != null) {
                                cartViewModel.confirmarPedido(mesaId!!)
                                showSuccessDialog = true
                            }
                        },
                        Modifier,
                        enabled = items.isNotEmpty() && mesaId != null
                    )
                }
            }
        }
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
