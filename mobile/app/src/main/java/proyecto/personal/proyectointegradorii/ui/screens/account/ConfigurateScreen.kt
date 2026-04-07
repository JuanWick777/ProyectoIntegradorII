package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Divider
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.ButtonSetting
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.BorderInputColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import androidx.compose.ui.graphics.Color

@Composable
fun SConfigurate(navController: NavController){
    var notificationsEnabled by remember { mutableStateOf(true) }
    var darkModeEnabled by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        // 1. HEADER
        HeaderCBack(
            tittle = "Ajustes",
            sizetittle = 25,
            navController = navController
        )

        // 2. CONTENIDO PRINCIPAL
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(25.dp))

            // TARJETA 1: Preferencias de la app
            GlobalCard(
                content = {
                    Column(modifier = Modifier.padding(vertical = 8.dp)) {

                        // Opción: Notificaciones
                        ButtonSetting(
                            icon = Icons.Outlined.Notifications,
                            title = "Notificaciones",
                            subtitle = "Recibe alertas de pedidos"
                        ) {
                            Switch(
                                checked = notificationsEnabled,
                                onCheckedChange = { notificationsEnabled = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = MainColor,
                                    uncheckedThumbColor = Color.White,
                                    uncheckedTrackColor = BorderInputColor
                                )
                            )
                        }

                        Divider(
                            modifier = Modifier.padding(horizontal = 18.dp),
                            color = BorderInputColor.copy(alpha = 0.3f),
                            thickness = 1.dp
                        )

                        // Opción: Modo Oscuro
                        ButtonSetting(
                            icon = Icons.Outlined.DarkMode,
                            title = "Modo Oscuro",
                            subtitle = "Apariencia oscura"
                        ) {
                            Switch(
                                checked = darkModeEnabled,
                                onCheckedChange = { darkModeEnabled = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = MainColor,
                                    uncheckedThumbColor = Color.White,
                                    uncheckedTrackColor = BorderInputColor
                                )
                            )
                        }

                        Divider(
                            modifier = Modifier.padding(horizontal = 18.dp),
                            color = BorderInputColor.copy(alpha = 0.3f),
                            thickness = 1.dp
                        )

                        // Opción: Idioma
                        ButtonSetting(
                            icon = Icons.Outlined.Language,
                            title = "Idioma",
                            subtitle = "Español"
                        )
                    }
                }
            )

            Spacer(modifier = Modifier.height(25.dp))

            // TARJETA 2: Zona de Peligro
            GlobalCard(
                // Le inyectamos el borde rojo claro al modificador base
                modifier = Modifier.border(
                    width = 1.dp,
                    color = AlertColor.copy(alpha = 0.3f),
                    shape = RoundedCornerShape(24.dp)
                ),
                content = {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.Start
                    ) {
                        GlobalText(
                            texto = "Zona de Peligro",
                            tamanio = 16,
                            color = TextColorDark,
                            peso = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        GlobalText(
                            texto = "Esta acción es irreversible",
                            tamanio = 14,
                            color = TextColorGray
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        GlobalButton(
                            text = "Eliminar Cuenta",
                            textsize = 16,
                            alt = 55,
                            ancho = 350,
                            bordercolorbutton = AlertColor,
                            colorbutton = AlertColor,
                            colortext = Color.White,
                            modifier = Modifier.fillMaxWidth(),
                            onClick = {
                                // Lógica para eliminar cuenta
                            }
                        )
                    }
                }
            )
        }
    }
}