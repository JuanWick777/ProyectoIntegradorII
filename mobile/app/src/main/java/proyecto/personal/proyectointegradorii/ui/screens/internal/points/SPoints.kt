package proyecto.personal.proyectointegradorii.ui.screens.internal.points

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AdsClick
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderPuntos
import proyecto.personal.proyectointegradorii.ui.components.messages.AdMessage
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.ColorAd
import proyecto.personal.proyectointegradorii.ui.theme.CommentContainerColor
import proyecto.personal.proyectointegradorii.ui.theme.CommentContentColor
import proyecto.personal.proyectointegradorii.ui.theme.ContainerColor
import proyecto.personal.proyectointegradorii.ui.theme.ContentColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.SuccessfulColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun SPoints(){
    LazyColumn(
        modifier = Modifier.fillMaxSize()
            .background(BackgroundColor)
    ) {
        item {
            HeaderPuntos()
        }
        item {
            Column(
                modifier = Modifier
                    .padding(
                        horizontal = 20.dp,
                        vertical = 20.dp
                    )
            ) {

                GlobalText(
                    "¿Cómo obtener puntos?",
                    18,
                    TextColorDark,
                    Modifier,
                    peso = FontWeight.SemiBold
                )
                Spacer(Modifier.padding(vertical = 6.dp))
                // ==========================================
                // TARJETA 1: Borde naranja e ícono naranja
                // ==========================================
                AdMessage(
                    borderColor = MainColor,
                    backgroundColor = Color.Transparent
                ) {
                    Row(verticalAlignment = Alignment.Top) {
                        // Caja del icono
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .background(MainColor, RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.ShoppingBag, contentDescription = null, tint = Color.White)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            GlobalText(
                                texto = "Realiza una compra mayor a $200",
                                peso = FontWeight.Bold,
                                tamanio = 16,
                                color = TextColorDark
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            // Sub-tarjeta interna
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.White)
                                    .border(1.dp, Color(0xFFFDE0D3), RoundedCornerShape(12.dp)) // Borde super clarito
                                    .padding(12.dp)
                            ) {
                                Column {
                                    GlobalText(
                                        "Por cada compra que supere los $200 pesos:",
                                        color = TextColorGray,
                                        tamanio = 14,
                                        peso = FontWeight.Medium
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            Icons.Default.Star,
                                            contentDescription = null,
                                            tint = MainColor,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        GlobalText(
                                            "+1 Punto",
                                            color = MainColor,
                                            peso = FontWeight.Bold,
                                            tamanio = 16
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                Spacer(Modifier.padding(vertical = 10.dp))
                GlobalText(
                    "Beneficios de tus puntos",
                    18,
                    TextColorDark,
                    Modifier,
                    peso = FontWeight.SemiBold
                )
                Spacer(Modifier.padding(vertical = 6.dp))
                // ==========================================
                // TARJETA 2: Fondo blanco, ícono verde
                // ==========================================
                AdMessage(
                    backgroundColor = Color.White
                ) {
                    Row(verticalAlignment = Alignment.Top) {
                        // Caja del icono
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .background(SuccessfulColor, RoundedCornerShape(12.dp)), // Verde
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.AdsClick,
                                contentDescription = null,
                                tint = Color.White
                            )
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            GlobalText(
                                texto = "Cada punto vale $1 peso",
                                peso = FontWeight.Bold,
                                tamanio = 16,
                                color = TextColorDark,
                                modifier = Modifier
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            GlobalText(
                                texto = "Utiliza tus puntos como descuento en tu siguiente compra",
                                color = TextColorGray,
                                peso = FontWeight.Normal,
                                tamanio = 14
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            // Sub-tarjeta interna verde
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(ContentColor, RoundedCornerShape(12.dp))
                                    .border(1.dp, ContainerColor, RoundedCornerShape(12.dp))
                                    .padding(12.dp)
                            ) {
                                GlobalText(
                                    texto = "✓ 1 Punto = $1 MXN de descuento",
                                    color = SuccessfulColor.copy(alpha = 0.8f),
                                    peso = FontWeight.Bold,
                                    tamanio = 14
                                )
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.padding(vertical = 12.dp))
                // ==========================================
                // TARJETA 3: Fondo naranja clarito (Ejemplo)
                // ==========================================
                AdMessage(
                    backgroundColor = CommentContentColor,
                    borderColor = CommentContainerColor
                ) {
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(
                            Icons.Outlined.Info,
                            contentDescription = null,
                            tint = MainColor.copy(alpha = 0.8f)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            GlobalText(
                                texto = "Ejemplo práctico",
                                color = MainColor.copy(alpha = 0.8f),
                                peso = FontWeight.Bold,
                                tamanio = 16
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            // Uso de AnnotatedString para pintar partes del texto en negritas
                            Text(
                                text = buildAnnotatedString {
                                    append("Si realizas una compra de $250, obtienes ")
                                    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                                        append("1 punto. ")
                                    }
                                    append("Ese punto puedes usarlo en tu próxima orden como ")
                                    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                                        append("$1 de descuento.")
                                    }
                                },
                                color = MainColor.copy(alpha = 0.8f),
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

@Preview
@Composable
fun Psp(){
    SPoints()
}