package proyecto.personal.proyectointegradorii.ui.screens.internal.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.foundation.shape.RoundedCornerShape
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
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.SuccessfulColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
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
                        .padding(horizontal = 20.dp, vertical = 15.dp)
                ) {
                    GlobalCard(
                        backgroundColor = Color.White,
                        modifier = Modifier.weight(1f), // Permite que la tarjeta ocupe el alto disponible
                        content = {
                            // Columna interna para controlar el padding dentro de la Card
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(20.dp)
                            ) {
                                // --- 1. ENCABEZADO: ID Y ESTADO ---
                                Column(
                                    modifier = Modifier.fillMaxWidth(),
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
                                        color = MainColor, // Destacamos el estado
                                        peso = FontWeight.SemiBold
                                    )
                                }

                                Spacer(modifier = Modifier.height(16.dp))
                                HorizontalDivider(color = Color(0xFFEEEEEE), thickness = 1.dp)
                                Spacer(modifier = Modifier.height(16.dp))

                                // --- 2. LISTA DE PLATILLOS ---
                                LazyColumn(
                                    modifier = Modifier.weight(1f) // Toma el espacio restante en medio
                                ) {
                                    items(pedidoActual.detalles) { item ->
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(bottom = 12.dp),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column(modifier = Modifier.weight(1f)) {
                                                GlobalText(
                                                    texto = item.nombre ?: "Platillo",
                                                    tamanio = 16,
                                                    color = TextColorDark,
                                                    peso = FontWeight.Bold
                                                )
                                                if (!item.nota.isNullOrBlank()) {
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
                                }

                                Spacer(modifier = Modifier.height(16.dp))
                                HorizontalDivider(color = Color(0xFFEEEEEE), thickness = 1.dp)
                                Spacer(modifier = Modifier.height(16.dp))

                                // --- 3. RESUMEN DE COBROS ---
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    GlobalText("Subtotal", 14, Color.Gray)
                                    GlobalText("$${"%.2f".format(pedidoActual.subtotal)}", 14, Color.Gray)
                                }

                                if (pedidoActual.montoDescuento > 0) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        val descText = if (!pedidoActual.codigoPromoAplicado.isNullOrBlank()) {
                                            "Promo: ${pedidoActual.codigoPromoAplicado}"
                                        } else {
                                            "Promo automática"
                                        }
                                        GlobalText(descText, 14, SuccessfulColor)
                                        GlobalText("-$${"%.2f".format(pedidoActual.montoDescuento)}", 14, SuccessfulColor)
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    GlobalText("Total", 18, TextColorDark, peso = FontWeight.Bold)
                                    GlobalText("$${"%.2f".format(pedidoActual.total)}", 18, MainColor, peso = FontWeight.Bold)
                                }

                                Spacer(modifier = Modifier.height(24.dp))

                                // --- 4. BOTONES ---
                                Column(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    GlobalButton(
                                        text = "Hacer otro pedido",
                                        textsize = 16,
                                        alt = 50,
                                        ancho = 300, // Ajustado ligeramente para que respire bien dentro del padding de la tarjeta
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

                                    // Botón secundario (Estilo Outline/Transparente)
                                    GlobalButton(
                                        text = "Volver a pedidos",
                                        textsize = 16,
                                        alt = 50,
                                        ancho = 300,
                                        bordercolorbutton = MainColor,
                                        colorbutton = Color.Transparent,
                                        colortext = MainColor,
                                        onClick = {
                                            cartViewModel.limpiarOrdenActual()
                                        }
                                    )
                                }
                            }
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
                            backgroundColor = BackgroundCardColor,
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
                                        color = TextColorGray,
                                        textAlign = TextAlign.Center
                                    )

                                    Spacer(modifier = Modifier.height(28.dp))

                                    // Botón de navegación
                                    GlobalButton(
                                        text = "Ir al menú",
                                        textsize = 16,
                                        alt = 65,
                                        ancho = 250,
                                        bordercolorbutton = MainColor,
                                        colorbutton = MainColor,
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
                                        val promoTexto =
                                            if (!pedido.codigoPromoAplicado.isNullOrBlank()) {
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
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp, vertical = 15.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // 1. LISTA DE PLATILLOS EN EL CARRITO
                    LazyColumn(
                        modifier = Modifier.weight(1f, fill = false),
                        contentPadding = PaddingValues(bottom = 16.dp)
                    ) {
                        items(items) { item ->
                            GlobalCard(
                                backgroundColor = BackgroundCardColor,
                                modifier = Modifier.padding(bottom = 12.dp),
                                content = {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            GlobalText(
                                                texto = item.platillo.nombre,
                                                tamanio = 16,
                                                color = TextColorDark,
                                                peso = FontWeight.Bold
                                            )
                                            GlobalText(
                                                texto = "$${item.subtotal()}",
                                                tamanio = 16,
                                                color = MainColor,
                                                peso = FontWeight.Bold
                                            )
                                        }

                                        Spacer(modifier = Modifier.height(4.dp))

                                        GlobalText(
                                            texto = "Cantidad: ${item.cantidad}",
                                            tamanio = 14,
                                            color = Color.Gray
                                        )

                                        if (item.nota.isNotBlank()) {
                                            Spacer(modifier = Modifier.height(2.dp))
                                            GlobalText(
                                                texto = "Nota: ${item.nota}",
                                                tamanio = 14,
                                                color = Color.Gray
                                            )
                                        }
                                    }
                                }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // 2. TARJETA DE RESUMEN (Costos, Puntos y Mesa)
                    GlobalCard(
                        backgroundColor = BackgroundCardColor,
                        content = {

                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp)
                            ) {
                                // Subtotal
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    GlobalText("Subtotal", 16, TextColorGray)
                                    GlobalText("$${"%.2f".format(subtotalMostrar)}", 16, TextColorDark)
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                // Switch de Puntos
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        GlobalText(
                                            "Usar puntos",
                                            16,
                                            TextColorDark,
                                            peso = FontWeight.SemiBold
                                        )
                                        GlobalText("Tienes $puntos disponibles", 12, Color.Gray)
                                    }
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

                                // Descuentos (Promociones y Puntos)
                                if (descuentoPromoMostrar > 0) {
                                    Spacer(modifier = Modifier.height(10.dp))
                                    val tituloPromo =
                                        if (!preview?.tituloPromoAplicada.isNullOrBlank()) {
                                            preview?.tituloPromoAplicada ?: ""
                                        } else {
                                            "Automática"
                                        }
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        GlobalText("Promo ($tituloPromo)", 14, SuccessfulColor)
                                        GlobalText(
                                            "-$${"%.2f".format(descuentoPromoMostrar)}",
                                            14,
                                            SuccessfulColor
                                        )
                                    }
                                }

                                if (descuentoPuntosMostrar > 0) {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        GlobalText("Descuento por puntos", 14, SuccessfulColor)
                                        GlobalText(
                                            "-$${"%.2f".format(descuentoPuntosMostrar)}",
                                            14,
                                            SuccessfulColor
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))
                                HorizontalDivider(color = Color(0xFFEEEEEE), thickness = 1.dp)
                                Spacer(modifier = Modifier.height(12.dp))

                                // Total y Mesa
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    GlobalText(
                                        "Total estimado",
                                        18,
                                        TextColorDark,
                                        peso = FontWeight.Bold
                                    )
                                    GlobalText(
                                        "$${"%.2f".format(totalMostrar)}",
                                        20,
                                        MainColor,
                                        peso = FontWeight.Bold
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                GlobalText(
                                    texto = "Ganarás $puntosGanadosMostrar punto(s) con esta compra",
                                    tamanio = 12,
                                    color = TextColorGray,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth()
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Indicador de Mesa
                                val textoMesa =
                                    if (mesaId != null) "Mesa seleccionada: $mesaId" else "No hay mesa seleccionada"
                                val colorMesa = if (mesaId != null) TextColorDark else AlertColor

                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(
                                            color = BackgroundCardColor,
                                            shape = RoundedCornerShape(8.dp)
                                        )
                                        .padding(8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    GlobalText(textoMesa, 14, colorMesa, peso = FontWeight.SemiBold)
                                }
                            }
                        }
                    )


                    Spacer(modifier = Modifier.height(20.dp))

                    // 3. SECCIÓN DE BOTONES Y ERRORES
                    if (!pedidoError.isNullOrBlank()) {
                        GlobalText(
                            texto = pedidoError!!,
                            tamanio = 14,
                            color = AlertColor,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                    }

                    // Botón Principal: Confirmar
                    GlobalButton(
                        text = if (isSubmittingOrder) "Enviando pedido..." else "Confirmar Pedido",
                        textsize = 16,
                        alt = 50,
                        ancho = 350,
                        bordercolorbutton = MainColor,
                        colorbutton = MainColor,
                        colortext = TextColorWhite,
                        onClick = {
                            if (mesaId != null && !isSubmittingOrder) {
                                cartViewModel.confirmarPedido(mesaId!!)
                            }
                        },
                        enabled = items.isNotEmpty() && mesaId != null && !isSubmittingOrder
                    )

                    // Botón Secundario: Cancelar
                    if (items.isNotEmpty() && orden == null) {
                        Spacer(modifier = Modifier.height(12.dp))
                        GlobalButton(
                            text = "Cancelar pedido",
                            textsize = 16,
                            alt = 50,
                            ancho = 350,
                            bordercolorbutton = AlertColor, // Borde rojo
                            colorbutton = Color.Transparent, // Fondo transparente
                            colortext = AlertColor,          // Letras rojas
                            onClick = {
                                if (!isSubmittingOrder) {
                                    cartViewModel.cancelarPedidoAntesDeConfirmar()
                                }
                            },
                            enabled = !isSubmittingOrder
                        )
                    }
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
