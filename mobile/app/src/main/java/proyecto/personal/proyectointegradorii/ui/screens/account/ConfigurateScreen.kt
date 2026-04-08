package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
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
import androidx.compose.material3.Surface
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
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.BorderInputColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor
import proyecto.personal.proyectointegradorii.ui.theme.DarkBackground
import proyecto.personal.proyectointegradorii.ui.theme.DarkCardColor
import proyecto.personal.proyectointegradorii.ui.theme.DarkHeaderColor
import proyecto.personal.proyectointegradorii.ui.theme.DarkTextGray
import proyecto.personal.proyectointegradorii.ui.theme.DarkTextWhite

@Composable
fun SConfigurate(navController: NavController){
    var notificationsEnabled by remember { mutableStateOf(true) }
    var darkModeEnabled by remember { mutableStateOf(false) }

    /// Variables dinámicas
    val currentBackground = if (darkModeEnabled) DarkBackground else BackgroundColor
    val currentCardColor = if (darkModeEnabled) DarkCardColor else BackgroundCardColor
    val currentHeaderColor = if (darkModeEnabled) DarkHeaderColor else MainColor
    val currentTitleColor = if (darkModeEnabled) DarkTextWhite else TextColorDark
    val currentSubtitleColor = if (darkModeEnabled) DarkTextGray else TextColorGray
    val dividerColor = if (darkModeEnabled) DarkTextGray.copy(alpha = 0.1f) else BorderInputColor.copy(alpha = 0.3f)

    // BOX PRINCIPAL: Solo lleva el color de fondo base
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(currentBackground)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {

            // 1. HEADER (Ahora soporta el gradiente)
            HeaderCBack(
                tittle = "Ajustes",
                sizetittle = 36,
                navController = navController,
                backgroundColor = currentHeaderColor,
                modifier = Modifier
            )

            // 2. TARJETAS
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp)
            ) {
                Spacer(modifier = Modifier.height(25.dp))

                // TARJETA 1: Preferencias
                Surface(
                    color = currentCardColor,
                    shadowElevation = if (darkModeEnabled) 0.dp else 8.dp,
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(vertical = 8.dp)) {
                        ButtonSetting(
                            icon = Icons.Outlined.Notifications,
                            title = "Notificaciones",
                            subtitle = "Recibe alertas de pedidos",
                            titleColor = currentTitleColor,
                            subtitleColor = currentSubtitleColor
                        ) {
                            Switch(
                                checked = notificationsEnabled,
                                onCheckedChange = { notificationsEnabled = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = MainColor,
                                    uncheckedThumbColor = if (darkModeEnabled) Color.Gray else Color.White,
                                    uncheckedTrackColor = if (darkModeEnabled) DarkBackground else BorderInputColor
                                )
                            )
                        }

                        Divider(modifier = Modifier.padding(horizontal = 18.dp), color = dividerColor, thickness = 1.dp)

                        ButtonSetting(
                            icon = Icons.Outlined.DarkMode,
                            title = "Modo Oscuro",
                            subtitle = "Apariencia oscura",
                            titleColor = currentTitleColor,
                            subtitleColor = currentSubtitleColor
                        ) {
                            Switch(
                                checked = darkModeEnabled,
                                onCheckedChange = { darkModeEnabled = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = MainColor,
                                    uncheckedThumbColor = if (darkModeEnabled) Color.Gray else Color.White,
                                    uncheckedTrackColor = if (darkModeEnabled) DarkBackground else BorderInputColor
                                )
                            )
                        }

                        Divider(modifier = Modifier.padding(horizontal = 18.dp), color = dividerColor, thickness = 1.dp)

                        ButtonSetting(
                            icon = Icons.Outlined.Language,
                            title = "Idioma",
                            subtitle = "Español",
                            titleColor = currentTitleColor,
                            subtitleColor = currentSubtitleColor
                        )
                    }
                }

                Spacer(modifier = Modifier.height(25.dp))

                // TARJETA 2: Zona de Peligro
                Surface(
                    color = currentCardColor,
                    shadowElevation = if (darkModeEnabled) 0.dp else 8.dp,
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = 1.dp,
                            color = if (darkModeEnabled) AlertColor.copy(alpha = 0.2f) else AlertColor.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(24.dp)
                        )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.Start
                    ) {
                        GlobalText(
                            texto = "Zona de Peligro",
                            tamanio = 16,
                            color = currentTitleColor,
                            peso = FontWeight.Bold,
                            modifier = Modifier
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        GlobalText(
                            texto = "Esta acción es irreversible",
                            tamanio = 14,
                            color = currentSubtitleColor
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
                            onClick = { /* Lógica eliminar */ }
                        )
                    }
                }
            }
        }
    }
}


@Preview
@Composable
fun PsC(){
    SConfigurate(NavController(LocalContext.current))
}