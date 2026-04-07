package proyecto.personal.proyectointegradorii.ui.screens.internal.offers

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.messages.EmptyOffersMessage
import proyecto.personal.proyectointegradorii.ui.components.cards.CuponCompletoCard
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorO
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorR

@Composable
fun SOffers()  {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor),
        // Le damos padding abajo para que la BottomBar no tape el último elemento
        contentPadding = PaddingValues(bottom = 100.dp)
    ) {
        // El Header
        item {
            InternalHeader(
                tittle = "Promociones",
                sizetittle = 28 // Ajusta el tamaño según tu componente Tittle
            )
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }

        // Primera tarjeta
        item {
            Box(modifier = Modifier.padding(horizontal = 20.dp)) {
                CuponCompletoCard(
                    porcentaje = "50%",
                    titulo = "2x1 en Hamburguesas",
                    descripcion = "Compra una hamburguesa y llévate otra gratis",
                    fechaValidez = "28 Feb 2026",
                    coloresGradientes = listOf(OfferColorO, OfferColorR) // Pasamos los colores nuevos
                )
            }
        }

        item { Spacer(modifier = Modifier.height(16.dp)) }

        // Segunda tarjeta
        item {
            Box(modifier = Modifier.padding(horizontal = 20.dp)) {
                CuponCompletoCard(
                    porcentaje = "20%",
                    titulo = "20% OFF en Postres",
                    descripcion = "Descuento especial en todos los postres",
                    fechaValidez = "15 Feb 2026"
                )
            }
        }

        item { Spacer(modifier = Modifier.height(32.dp)) }

        // Mensaje de "No hay más"
        item {
            EmptyOffersMessage(modifier = Modifier)
        }
    }
}