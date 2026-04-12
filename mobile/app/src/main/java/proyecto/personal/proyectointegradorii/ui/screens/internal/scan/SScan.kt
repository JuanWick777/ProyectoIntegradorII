package proyecto.personal.proyectointegradorii.ui.screens.internal.scan

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel

@Composable
fun SScan(
    cartViewModel: CartViewModel,
    navController: NavController
){
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        InternalHeader(
            "Escanear QR",
            28,
            Modifier
        )

        GlobalButton(
            "Asignar mesa 1",
            16,
            50,
            250,
            MainColor,
            MainColor,
            TextColorWhite,
            {
                cartViewModel.setMesaSeleccionada(1)
                navController.navigate("cart")
            },
            Modifier
        )

    }
}