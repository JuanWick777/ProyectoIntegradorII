package proyecto.personal.proyectointegradorii.ui.components.modals

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BorderInputColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite

@Composable
fun PlatilloModal(
    platillo: PlatilloDto,
    onDismiss: () -> Unit,
    onAddToCart: (PlatilloDto, Int, String) -> Unit
) {

    var cantidad by remember { mutableStateOf(1) }
    var nota by remember { mutableStateOf("") }
    var especificacionesExpanded by remember { mutableStateOf(false) } // Estado para expandir la nota

    val total = (platillo.precio * cantidad)

    // Usamos Dialog en lugar de AlertDialog para tener control total del diseño
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = TextColorWhite,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                // --- HEADER ---
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    GlobalText(
                        texto = "Personalizar Platillo",
                        tamanio = 18,
                        color = TextColorDark, // Reemplaza por tu color oscuro
                        peso = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(24.dp)) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Cerrar",
                            tint = TextColorGray // Reemplaza por tu gris
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = BorderInputColor.copy(alpha = 0.3f), thickness = 1.dp)
                Spacer(modifier = Modifier.height(16.dp))

                // --- INFO DEL PLATILLO ---
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Imagen del platillo (Placeholder, cámbialo por tu AsyncImage o componente de imagen)
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.LightGray)
                    ) {
                        // Aquí iría tu imagen: Image(painter = ..., contentDescription = ...)
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        GlobalText(
                            texto = platillo.nombre,
                            tamanio = 16,
                            color = TextColorDark,
                            peso = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        GlobalText(
                            texto = platillo.descripcion ?: "",
                            tamanio = 14,
                            color = TextColorGray,
                            // Opcional: limitar a 2 o 3 líneas para que no rompa el diseño si es muy larga
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        GlobalText(
                            texto = "$${platillo.precio}",
                            tamanio = 16,
                            color = MainColor, // Tu color naranja
                            peso = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))
                Divider(color = BorderInputColor.copy(alpha = 0.3f), thickness = 1.dp)
                Spacer(modifier = Modifier.height(16.dp))

                // --- SECCIÓN CANTIDAD ---
                GlobalText(
                    texto = "Cantidad",
                    tamanio = 14,
                    color = TextColorDark,
                    peso = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Botón Menos (-)
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(BorderInputColor.copy(alpha = 0.2f)) // Gris muy clarito
                            .clickable { if (cantidad > 1) cantidad-- },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Remove, contentDescription = "Menos", tint = MainColor)
                    }

                    Spacer(modifier = Modifier.width(20.dp))

                    GlobalText(
                        texto = cantidad.toString(),
                        tamanio = 18,
                        color = TextColorDark,
                        peso = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.width(20.dp))

                    // Botón Más (+)
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(MainColor) // Naranja sólido
                            .clickable { cantidad++ },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = "Más", tint = Color.White)
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))
                Divider(color = BorderInputColor.copy(alpha = 0.3f), thickness = 1.dp)
                Spacer(modifier = Modifier.height(16.dp))

                // --- ESPECIFICACIONES (Desplegable) ---
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { especificacionesExpanded = !especificacionesExpanded }
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    GlobalText(
                        texto = "¿Deseas agregar especificaciones?",
                        tamanio = 14,
                        color = TextColorDark,
                        peso = FontWeight.SemiBold
                    )
                    Icon(
                        imageVector = if (especificacionesExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = "Expandir",
                        tint = MainColor
                    )
                }

                AnimatedVisibility(visible = especificacionesExpanded) {
                    Column {
                        Spacer(modifier = Modifier.height(12.dp))
                        OutlinedTextField(
                            value = nota,
                            onValueChange = { nota = it },
                            placeholder = { Text("Ej. Sin cebolla, extra aderezo...", color = TextColorGray, fontSize = 14.sp) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = MainColor,
                                unfocusedBorderColor = BorderInputColor
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = BorderInputColor.copy(alpha = 0.3f), thickness = 1.dp)
                Spacer(modifier = Modifier.height(16.dp))

                // Total y Botón
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    GlobalText(
                        texto = "Total:",
                        tamanio = 16,
                        color = TextColorGray
                    )
                    GlobalText(
                        texto = "$${total}",
                        tamanio = 20,
                        color = MainColor,
                        peso = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                GlobalButton(
                    text = "Agregar al Carrito",
                    textsize = 16,
                    alt = 55,
                    ancho = 350, // Ponemos un ancho base, pero el fillMaxWidth manda
                    bordercolorbutton = MainColor,
                    colorbutton = MainColor,
                    colortext = TextColorWhite,
                    modifier = Modifier.fillMaxWidth(),
                    onClick = {
                        onAddToCart(platillo, cantidad, nota)
                        onDismiss()
                    }
                )
            }
        }
    }
}