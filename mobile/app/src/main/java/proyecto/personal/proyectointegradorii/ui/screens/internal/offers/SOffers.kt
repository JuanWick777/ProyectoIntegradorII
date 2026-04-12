package proyecto.personal.proyectointegradorii.ui.screens.internal.offers

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import proyecto.personal.proyectointegradorii.ui.components.cards.CuponCompletoCard
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.components.messages.EmptyOffersMessage
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorM
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorO
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorP
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorR
import proyecto.personal.proyectointegradorii.viewmodels.offers.OffersViewModel
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.ui.Alignment


@Composable
fun SOffers() {
    val viewModel: OffersViewModel = viewModel()
    val promociones by viewModel.promociones.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.cargarPromociones()
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor),
        contentPadding = PaddingValues(bottom = 100.dp)
    ) {
        item {
            InternalHeader(
                tittle = "Promociones",
                sizetittle = 28
            )
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }

        if (isLoading) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 40.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        } else if (promociones.isEmpty()) {
            item {
                EmptyOffersMessage(modifier = Modifier)
            }
        } else {
            items(promociones) { promo ->
                Box(modifier = Modifier.padding(horizontal = 20.dp)) {
                    CuponCompletoCard(
                        porcentaje = if (promo.tipoDescuento.equals("PORCENTAJE", ignoreCase = true)) {
                            "${promo.valorDescuento.toInt()}%"
                        } else {
                            "$${promo.valorDescuento.toInt()}"
                        },
                        titulo = promo.titulo,
                        descripcion = buildString {
                            append(promo.descripcion ?: "Promoción disponible por tiempo limitado")
                            if (!promo.codigoPromo.isNullOrBlank()) {
                                append("\nCódigo: ${promo.codigoPromo}")
                            }
                        },
                        fechaValidez = promo.fechaFin ?: "Tiempo limitado",
                        coloresGradientes = if (promo.tipoDescuento.equals("PORCENTAJE", ignoreCase = true)) {
                            listOf(OfferColorO, OfferColorR)
                        } else {
                            listOf(OfferColorP, OfferColorM)
                        }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }

            item {
                EmptyOffersMessage(modifier = Modifier)
            }
        }
    }
}
