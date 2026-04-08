package proyecto.personal.proyectointegradorii.ui.screens.internal.scan

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor

@Composable
fun SScan(){
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
    }
}