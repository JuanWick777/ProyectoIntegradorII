package proyecto.personal.proyectointegradorii.ui.components.headers

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.components.texts.Tittle
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun HeaderPuntos(
    puntos: Int = 485,
    equivalencia: Int = 485
) {
    // Contenedor principal
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp))
            .background(MainColor)
            .padding(top = 48.dp, bottom = 32.dp, start = 24.dp, end = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Título
        Tittle(
            titulo = "Sistema de Puntos",
            size = 36,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        GlobalCard (
            modifier = Modifier,
            content = {
                // Añadimos un Column interno solo para darle padding por dentro a la tarjeta
                Column(
                    modifier = Modifier.padding(vertical = 32.dp, horizontal = 5.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Fila para agrupar la estrella y el número
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(bottom = 12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Star,
                            contentDescription = "Ícono de estrella",
                            tint = MainColor,
                            modifier = Modifier
                                .size(56.dp)
                                .padding(end = 10.dp)
                        )
                        GlobalText(
                            texto = puntos.toString(),
                            tamanio = 56, // Letra muy grande para el número
                            color = MainColor,
                            peso = FontWeight.Bold
                        )
                    }
                    // Subtítulo
                    GlobalText(
                        texto = "Puntos disponibles = $$equivalencia de descuento",
                        tamanio = 18,
                        color = TextColorGray,
                        textAlign = TextAlign.Center
                    )
                }
            }
        )
    }
}