package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.cards.HistoryCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.viewmodels.account.HistoryViewModel
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun HistoryScreen(
    navController: NavController
) {
    val viewModel: HistoryViewModel = viewModel()

    val ordenes by viewModel.ordenes.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.cargarHistorial()
    }

    fun formatearFecha(fecha: String?): String {
        if (fecha.isNullOrBlank()) return "Sin fecha"

        return try {
            val parsed = LocalDateTime.parse(fecha)
            parsed.format(
                DateTimeFormatter.ofPattern("dd MMM yyyy • HH:mm", Locale("es", "MX"))
            )
        } catch (e: Exception) {
            fecha
        }
    }

    fun traducirEstado(estado: String): String {
        return when (estado.uppercase()) {
            "PENDIENTE_CONFIRMACION" -> "Pendiente"
            "CONFIRMADA" -> "Confirmada"
            "EN_PREPARACION" -> "En preparación"
            "LISTA" -> "Lista"
            "ENTREGADA" -> "Completado"
            "CANCELADA" -> "Cancelado"
            else -> estado
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        item {
            HeaderCBack(
                "Historial de Pedidos",
                30,
                BackgroundColor,
                Modifier,
                navController
            )
        }

        item { Spacer(Modifier.height(24.dp)) }

        when {
            isLoading -> {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(top = 40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
            }

            errorMessage != null -> {
                item {
                    Text(
                        text = errorMessage!!,
                        color = TextColorDark
                    )
                }
            }

            ordenes.isEmpty() -> {
                item {
                    Text(
                        text = "Aún no tienes pedidos registrados",
                        color = TextColorDark
                    )
                }
            }

            else -> {
                items(ordenes) { orden ->
                    val itemsResumen = orden.detalles.map { detalle ->
                        "${detalle.nombre} x${detalle.cantidad}"
                    }

                    val totalTexto = buildString {
                        append("$${"%.2f".format(orden.total)}")
                        if (orden.montoDescuento > 0) {
                            append("  (-$${"%.2f".format(orden.montoDescuento)})")
                        }
                    }

                    HistoryCard(
                        orderNumber = orden.id.toString(),
                        status = traducirEstado(orden.estado),
                        date = formatearFecha(orden.fechaCreacion),
                        items = itemsResumen,
                        total = totalTexto,
                        modifier = Modifier
                    )
                }

                item { Spacer(modifier = Modifier.height(20.dp)) }
            }
        }
    }
}