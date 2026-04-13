package proyecto.personal.proyectointegradorii.ui.screens.internal.account

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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.data.local.AppStateCleaner
import proyecto.personal.proyectointegradorii.data.remote.dto.usuario.LoginResponse
import proyecto.personal.proyectointegradorii.data.repositories.UserRepository
import proyecto.personal.proyectointegradorii.ui.components.buttons.ButtonAccount
import proyecto.personal.proyectointegradorii.ui.components.headers.CardHeaderAccount
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel
import androidx.compose.runtime.DisposableEffect
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun SAccount(
    navController: NavController,
    rootNavController: NavController,
    cartViewModel: CartViewModel
) {
    val context = LocalContext.current

    var usuario by remember { mutableStateOf<LoginResponse?>(null) }

    val lifecycleOwner = LocalLifecycleOwner.current

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                CoroutineScope(Dispatchers.Main).launch {
                    usuario = UserRepository().getCurrentUser()
                }
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    Column(
        modifier = Modifier
            .background(BackgroundColor)
            .fillMaxSize()
    ) {
        CardHeaderAccount(
            nameUser = usuario?.nombre ?: "Usuario",
            emailUser = usuario?.correo ?: "Sin correo",
            fotoPerfil = usuario?.fotoPerfil
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
                            cartViewModel.clearPersistedState()
                            AppStateCleaner.clearAll(context)

                            rootNavController.navigate("Login") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        },
                        isDesctructive = true
                    )

                }
            }
        )
    }
}