package proyecto.personal.proyectointegradorii.ui.screens.internal.account

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.PermIdentity
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Divider
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import proyecto.personal.proyectointegradorii.ui.components.buttons.ButtonAccount
import proyecto.personal.proyectointegradorii.ui.components.cards.account.CardAccountOptions
import proyecto.personal.proyectointegradorii.ui.components.cards.account.CardHeaderAccount
import proyecto.personal.proyectointegradorii.ui.components.bars.navigationbar.MainBottomBar
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor

@Composable
fun SAccount(
    navController: NavController,
    rootNavController: NavController
) {
    Scaffold(
        bottomBar = {
            MainBottomBar(navController)
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .background(
                    BackgroundColor
                )
                .padding(paddingValues)
                .fillMaxSize()
        ) {
            CardHeaderAccount(
                "Juan Peréz",
                "juan.perez@email.com",
            )
            CardAccountOptions(
                modifier = Modifier
                    .padding(start = 20.dp, end = 20.dp),
                content = {
                    Column(
                        verticalArrangement = Arrangement.SpaceEvenly,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        ButtonAccount(
                            icon = Icons.Default.PermIdentity,
                            text = "Datos Personales",
                            onClick = { }
                        )
                        Divider()
                        ButtonAccount(
                            icon = Icons.Default.History,
                            text = "Historial de Pedidos",
                            onClick = { }
                        )
                        Divider()
                        ButtonAccount(
                            icon = Icons.Default.Settings,
                            text = "Ajustes",
                            onClick = { }
                        )
                        Divider()
                        ButtonAccount(
                            icon = Icons.Default.Logout,
                            text = "Cerrar Sesión",
                            onClick = {
                                rootNavController.navigate("Login") {
                                    popUpTo(0)
                                }
                            }
                        )
                    }
                }
            )
        }
    }
}

/*@Preview
@Composable
fun PSA(){
    SAccount(navController = NavController(LocalContext.current))
}*/