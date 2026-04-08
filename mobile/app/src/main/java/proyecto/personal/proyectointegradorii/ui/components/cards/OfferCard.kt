package proyecto.personal.proyectointegradorii.ui.components.cards

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.LocalOffer
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorM
import proyecto.personal.proyectointegradorii.ui.theme.OfferColorP
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun CuponCompletoCard(
    porcentaje: String = "20%",
    titulo: String = "20% OFF en Postres",
    descripcion: String = "Descuento especial en todos los postres",
    fechaValidez: String = "20 Abr 2026",
    coloresGradientes: List<Color> = listOf(OfferColorP, OfferColorM)
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    // Aplicamos el gradiente de izquierda a derecha
                    .background(
                        brush = Brush.horizontalGradient(
                            colors = coloresGradientes
                        )
                    )
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween // Separa los elementos a los extremos
            ) {
                // Lado Izquierdo:
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.LocalOffer, // El ícono que parece una etiqueta
                        contentDescription = "Etiqueta",
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    GlobalText(
                        texto = porcentaje,
                        tamanio = 26,
                        color = Color.White
                    )
                }
                // Lado Derecho:
                Text(
                    text = "%",
                    fontSize = 36.sp,
                    color = Color.White.copy(alpha = 0.4f), // Aplicamos transparencia
                    fontWeight = FontWeight.Bold
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                GlobalText(
                    texto = titulo,
                    tamanio = 20,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(8.dp))
                GlobalText(
                    texto = descripcion,
                    tamanio = 14,
                    color = TextColorGray
                )
                Spacer(modifier = Modifier.height(16.dp))
                // Fila para la vigencia
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Schedule,
                        contentDescription = "Válido hasta",
                        tint = MainColor,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    GlobalText(
                        texto = "Válido hasta: $fechaValidez",
                        tamanio = 14,
                        color = MainColor
                    )
                }
            }
        }
    }
}