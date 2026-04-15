package proyecto.personal.proyectointegradorii.ui.screens.internal.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.alerts.successful.SuccessOrderDialog
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
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
    val ordenes by cartViewModel.ordenes.collectAsState()
    val preview by cartViewModel.previewOrden.collectAsState()
    val pedidoConfirmado by cartViewModel.pedidoConfirmado.collectAsState()
    val pedidoError by cartViewModel.pedidoError.collectAsState()
    val isSubmittingOrder by cartViewModel.isSubmittingOrder.collectAsState()

    var showSuccessDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        cartViewModel.cargarUsuario()
        cartViewModel.cargarMisOrdenes()

        if (cartViewModel.mesaSeleccionada.value != null) {
            cartViewModel.cargarPreviewOrden()
        }
    }

    LaunchedEffect(pedidoConfirmado) {
        if (pedidoConfirmado) {
            showSuccessDialog = true
            cartViewModel.resetPedidoConfirmado()
        }
    }

    val subtotal = cartViewModel.getTotal()
    val descuentoEstimado = if (usarPuntos) minOf(puntos.toDouble(), subtotal) else 0.0
    val totalEstimado = subtotal - descuentoEstimado
    val puntosGanados = (subtotal / 100).toInt()

    val subtotalMostrar = preview?.subtotal ?: subtotal
    val descuentoPromoMostrar = preview?.descuentoPromo ?: 0.0
    val descuentoPuntosMostrar = preview?.descuentoPuntos ?: if (usarPuntos) descuentoEstimado else 0.0
    val totalMostrar = preview?.total ?: totalEstimado
    val puntosGanadosMostrar = preview?.puntosGanados ?: puntosGanados

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
                val pedidoActual = orden!!

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp, vertical = 15.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // 1. TARJETA DE ESTADO DEL PEDIDO
                    GlobalCard(
                        backgroundColor = Color.White,
                        content = {
                            Column(
                                modifier = Modifier.padding(16.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                GlobalText(
                                    texto = "Pedido #${pedidoActual.id}",
                                    tamanio = 22,
                                    color = TextColorDark,
                                    peso = FontWeight.Bold
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                val estadoStr = when (pedidoActual.estado.lowercase()) {
                                    "pendiente_confirmacion" -> "Confirmando..."
                                    "confirmada" -> "Orden recibida"
                                    "en_preparacion" -> "En preparación"
                                    "lista" -> "Lista para servir"
                                    "entregada" -> "Entregada"
                                    "cancelada" -> "Cancelada"
                                    "cerrada" -> "Cerrada"
                                    else -> pedidoActual.estado
                                }

                                GlobalText(
                                    texto = estadoStr,
                                    tamanio = 18,
                                    color = MainColor, // Usamos el color principal para resaltar el estado
                                    peso = FontWeight.SemiBold
                                )
                            }
                        }
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Usamos weight(1f) para que la lista tome el espacio medio y empuje los botones abajo
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(bottom = 16.dp)
                    ) {
                        // 2. LISTA DE PLATILLOS (Cada item en una tarjeta limpia)
                        items(pedidoActual.detalles) { item ->
                            GlobalCard(
                                backgroundColor = Color.White,
                                modifier = Modifier.padding(bottom = 10.dp),
                                content = {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            GlobalText(
                                                texto = item.nombre ?: "Platillo",
                                                tamanio = 16,
                                                color = TextColorDark,
                                                peso = FontWeight.Bold
                                            )
                                            if (!item.nota.isNullOrBlank()) {
                                                Spacer(modifier = Modifier.height(4.dp))
                                                GlobalText(
                                                    texto = "Nota: ${item.nota}",
                                                    tamanio = 14,
                                                    color = Color.Gray
                                                )
                                            }
                                        }
                                        GlobalText(
                                            texto = "x${item.cantidad}",
                                            tamanio = 16,
                                            color = MainColor,
                                            peso = FontWeight.Bold
                                        )
                                    }
                                }
                            )
                        }

                        // 3. TARJETA DE RESUMEN DE PAGO (Al final de la lista)
                        item {
                            Spacer(modifier = Modifier.height(6.dp))
                            GlobalCard(
                                backgroundColor = Color.White,
                                content = {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            GlobalText("Subtotal", 16, Color.Gray)
                                            GlobalText("$${"%.2f".format(pedidoActual.subtotal)}", 16, Color.Gray)
                                        }

                                        if (pedidoActual.montoDescuento > 0) {
                                            Spacer(modifier = Modifier.height(8.dp))
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween
                                            ) {
                                                GlobalText("Descuento", 16, Color(0xFF4CAF50)) // Verde para descuento
                                                GlobalText("-$${"%.2f".format(pedidoActual.montoDescuento)}", 16, Color(0xFF4CAF50))
                                            }

                                            val promoText = if (!pedidoActual.codigoPromoAplicado.isNullOrBlank()) {
                                                "Código: ${pedidoActual.codigoPromoAplicado}"
                                            } else {
                                                "Promoción automática"
                                            }
                                            GlobalText(promoText, 12, Color.Gray)
                                        }

                                        Spacer(modifier = Modifier.height(12.dp))
                                        HorizontalDivider(color = Color(0xFFEEEEEE), thickness = 1.dp)
                                        Spacer(modifier = Modifier.height(12.dp))

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            GlobalText("Total", 18, TextColorDark, peso = FontWeight.Bold)
                                            GlobalText("$${"%.2f".format(pedidoActual.total)}", 18, MainColor, peso = FontWeight.Bold)
                                        }
                                    }
                                }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // 4. BOTONES DE ACCIÓN
                    GlobalButton(
                        text = "Hacer otro pedido",
                        textsize = 16,
                        alt = 50,
                        ancho = 350,
                        bordercolorbutton = MainColor,
                        colorbutton = MainColor,
                        colortext = TextColorWhite,
                        onClick = {
                            cartViewModel.limpiarOrdenActual()
                            navController.navigate("home") {
                                launchSingleTop = true
                            }
                        }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Botón secundario
                    GlobalButton(
                        text = "Volver a pedidos",
                        textsize = 16,
                        alt = 50,
                        ancho = 350,
                        bordercolorbutton = MainColor,
                        colorbutton = Color.Transparent, // Fondo transparente
                        colortext = MainColor,           // Texto color principal
                        onClick = {
                            cartViewModel.limpiarOrdenActual()
                        }
                    )
                }
            }


            items.isEmpty() -> {
                if (ordenes.isEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally // Centramos la card en la pantalla
                    ) {
                        GlobalCard(
                            backgroundColor = Color.White, // Forzamos el fondo blanco de la tarjeta
                            modifier = Modifier.fillMaxWidth(),
                            content = {
                                // Agregamos una columna interna con padding para darle "aire" al contenido
                                Column(
                                    modifier = Modifier.padding(32.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {

                                    // Título principal
                                    GlobalText(
                                        texto = "Tu carrito está vacío",
                                        tamanio = 20,
                                        color = TextColorDark,
                                        textAlign = TextAlign.Center,
                                        peso = FontWeight.SemiBold
                                    )

                                    Spacer(modifier = Modifier.height(12.dp))

                                    // Subtítulo
                                    GlobalText(
                                        texto = "Agrega platillos desde el menú",
                                        tamanio = 16,
                                        color = TextColorDark,
                                        textAlign = TextAlign.Center
                                    )

                                    Spacer(modifier = Modifier.height(28.dp))

                                    // Botón de navegación
                                    GlobalButton(
                                        text = "Ir al menú",
                                        textsize = 16,
                                        alt = 65,
                                        ancho = 250,
                                        bordercolorbutton = MainColor, // Reemplaza con el color primario de tu app
                                        colorbutton = MainColor,       // Reemplaza con el color primario de tu app
                                        colortext = TextColorWhite,
                                        onClick = {
                                            navController.navigate("home") {
                                                launchSingleTop = true
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                } else {
                    Column(
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 15.dp)
                    ) {
                        GlobalText(
                            "Pedidos realizados",
                            22,
                            TextColorDark,
                            Modifier
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        LazyColumn {
                            items(ordenes) { pedido ->
                                Column(
                                    modifier = Modifier.padding(bottom = 14.dp)
                                ) {
                                    Text("Pedido #${pedido.id}")
                                    Text("Estado: ${pedido.estado}")
                                    Text("Mesa: ${pedido.mesaNumero ?: "-"}")
                                    Text("Total: $${pedido.total}")

                                    if (pedido.montoDescuento > 0) {
                                        Text("Descuento: -$${"%.2f".format(pedido.montoDescuento)}")
                                    }

                                    if (pedido.montoDescuento > 0) {
                                        val promoTexto = if (!pedido.codigoPromoAplicado.isNullOrBlank()) {
                                            "Código: ${pedido.codigoPromoAplicado}"
                                        } else {
                                            "Promoción automática"
                                        }
                                        Text(promoTexto)
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    GlobalButton(
                                        "Ver seguimiento",
                                        14,
                                        45,
                                        250,
                                        MainColor,
                                        MainColor,
                                        TextColorWhite,
                                        {
                                            cartViewModel.setOrdenActual(pedido)
                                        },
                                        Modifier
                                    )
                                }
                            }
                        }
                    }
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
                        "Subtotal: $${"%.2f".format(subtotalMostrar)}",
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
                                if (puntos > 0 && !isSubmittingOrder) {
                                    cartViewModel.togglePuntos()
                                }
                            },
                            enabled = !isSubmittingOrder
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    if (descuentoPromoMostrar > 0) {
                        Text(
                            text = if (!preview?.tituloPromoAplicada.isNullOrBlank()) {
                                "Promoción aplicada: ${preview?.tituloPromoAplicada}"
                            } else {
                                "Promoción automática aplicada"
                            }
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Descuento por promoción: -$${"%.2f".format(descuentoPromoMostrar)}")
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    if (descuentoPuntosMostrar > 0) {
                        Text("Descuento por puntos: -$${"%.2f".format(descuentoPuntosMostrar)}")
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    GlobalText(
                        "Total estimado: $${"%.2f".format(totalMostrar)}",
                        18,
                        TextColorDark,
                        Modifier
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text("Ganarás $puntosGanadosMostrar punto(s) con esta compra")

                    Spacer(modifier = Modifier.height(20.dp))

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (mesaId != null) {
                            "Mesa seleccionada: $mesaId"
                        } else {
                            "No hay mesa seleccionada"
                        }
                    )

                    if (items.isNotEmpty() && orden == null) {
                        GlobalButton(
                            "Cancelar pedido",
                            16,
                            50,
                            350,
                            AlertColor,
                            AlertColor,
                            Color.White,
                            {
                                if (!isSubmittingOrder) {
                                    cartViewModel.cancelarPedidoAntesDeConfirmar()
                                }
                            },
                            Modifier,
                            enabled = !isSubmittingOrder
                        )

                    Spacer(modifier = Modifier.height(12.dp))
                }

                    if (!pedidoError.isNullOrBlank()) {
                        Text(
                            text = pedidoError!!,
                            color = AlertColor
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    GlobalButton(
                        if (isSubmittingOrder) "Enviando pedido..." else "Confirmar Pedido",
                        16,
                        50,
                        350,
                        MainColor,
                        MainColor,
                        TextColorWhite,
                        {
                            if (mesaId != null && !isSubmittingOrder) {
                                cartViewModel.confirmarPedido(mesaId!!)
                            }
                        },
                        Modifier,
                        enabled = items.isNotEmpty() && mesaId != null && !isSubmittingOrder
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
