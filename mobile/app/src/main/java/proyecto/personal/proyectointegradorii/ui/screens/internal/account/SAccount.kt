package proyecto.personal.proyectointegradorii.ui.screens.internal.account

import android.R.attr.thickness
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.PermIdentity
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Divider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.ButtonAccount
import proyecto.personal.proyectointegradorii.ui.components.headers.CardHeaderAccount
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor

@Composable
fun SAccount(
    navController: NavController,
    rootNavController: NavController
) {
    Column(
        modifier = Modifier
            .background(BackgroundColor)
            .fillMaxSize()
    ) {
        CardHeaderAccount(
            "Juan Peréz",
            "juan.perez@email.com",
        )
        GlobalCard(
            modifier = Modifier
                .padding(horizontal = 20.dp)
                .offset(y = (-55).dp),
            content = {
                Column(
                    verticalArrangement = Arrangement.SpaceEvenly,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    ButtonAccount(
                        icon = Icons.Default.PermIdentity,
                        text = "Datos Personales",
                        onClick = {
                            rootNavController.navigate("personaldates")
                        }
                    )
                    Divider(color = Color.LightGray, thickness = 1.dp)
                    ButtonAccount(
                        icon = Icons.Default.History,
                        text = "Historial de Pedidos",
                        onClick = {
                            rootNavController.navigate("history")
                        }
                    )
                    Divider(color = Color.LightGray, thickness = 1.dp)
                    ButtonAccount(
                        icon = Icons.Default.Settings,
                        text = "Ajustes",
                        onClick = {
                            rootNavController.navigate("Configurate")
                        }
                    )
                    Divider(color = Color.LightGray, thickness = 1.dp)
                    ButtonAccount(
                        icon = Icons.Default.Logout,
                        text = "Cerrar Sesión",
                        onClick = {
                            rootNavController.navigate("Login") {
                                popUpTo(0)
                            }
                        },
                        isDesctructive = true
                    )
                }
            }
        )
    }
}