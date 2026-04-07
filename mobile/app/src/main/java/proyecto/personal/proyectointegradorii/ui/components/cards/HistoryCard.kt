package proyecto.personal.proyectointegradorii.ui.components.cards

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BorderInputColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.SuccessfulColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite

@Composable
fun HistoryCard(
    orderNumber: String,
    status: String, // Ej: "Completado"
    date: String,   // Ej: "10 Feb 2026 • 14:30"
    items: List<String>, // Ej: listOf("Hamburguesa Gourmet x2", "Pasta Alfredo")
    total: String,  // Ej: "$427"
    modifier: Modifier = Modifier
)   {
    GlobalCard(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        content = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalAlignment = Alignment.Start
            ) {
                // 1. HEADER: Título y Badge de Estado
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    GlobalText(
                        texto = "Pedido #$orderNumber",
                        tamanio = 18,
                        color = TextColorDark,
                        peso = FontWeight.Bold
                    )
                    // Badge de "Completado"
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(50))
                            .background(SuccessfulColor)
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        GlobalText(
                            texto = status,
                            tamanio = 12,
                            color = TextColorWhite,
                            peso = FontWeight.SemiBold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // 2. FECHA Y HORA
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Schedule,
                        contentDescription = "Fecha del pedido",
                        tint = TextColorGray,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    GlobalText(
                        texto = date,
                        tamanio = 14,
                        color = TextColorGray
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // 3. CAJA GRIS CON LA LISTA DE ARTÍCULOS
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(BorderInputColor.copy(alpha = 0.2f)) // Gris muy clarito de tu paleta
                        .padding(12.dp)
                ) {
                    Column {
                        items.forEach { item ->
                            GlobalText(
                                texto = "• $item",
                                tamanio = 15,
                                color = TextColorGray,
                                modifier = Modifier.padding(vertical = 2.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // 4. DIVISOR
                Divider(
                    color = BorderInputColor.copy(alpha = 0.4f),
                    thickness = 1.dp
                )

                Spacer(modifier = Modifier.height(16.dp))

                // 5. TOTAL
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    GlobalText(
                        texto = "Total",
                        tamanio = 16,
                        color = TextColorGray
                    )
                    GlobalText(
                        texto = total,
                        tamanio = 20,
                        color = MainColor,
                        peso = FontWeight.Bold
                    )
                }
            }
        }
    )
}