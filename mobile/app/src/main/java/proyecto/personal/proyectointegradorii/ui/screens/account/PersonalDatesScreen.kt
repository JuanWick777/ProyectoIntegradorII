package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite

@Composable
fun PersonalDatesScreen(navController: NavController) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        HeaderCBack(
            "Datos Personales",
            30,
            BackgroundColor,
            Modifier,
            navController
        )
        Column(
            modifier = Modifier
                .padding(
                    vertical = 25.dp,
                    horizontal = 20.dp
                )
        ) {
            GlobalCard(
                modifier = Modifier.padding(vertical = 10.dp),
                content = {
                    Column(
                        modifier = Modifier
                            .align(alignment = Alignment.Start)
                            .padding(
                                horizontal = 20.dp,
                                vertical = 15.dp
                            )
                            .padding(top = 12.dp, bottom = 12.dp)
                    ) {
                        GlobalText(
                            "Nombre Completo",
                            18,
                            TextColorDark,
                            Modifier.padding(horizontal = 5.dp, vertical = 5.dp),
                            TextAlign.Left
                        )
                        GlobalTextInput(
                            name,
                            { name = it },
                            "Juan Pérez",
                            Modifier.padding(bottom = 12.dp),
                            60,
                            350
                        )
                        GlobalText(
                            "Correo Electrónico",
                            18,
                            TextColorDark,
                            Modifier.padding(horizontal = 5.dp, vertical = 5.dp),
                            TextAlign.Left
                        )
                        GlobalTextInput(
                            email,
                            { email = it },
                            "juan.perez@email.com",
                            Modifier.padding(bottom = 6.dp),
                            60,
                            350
                        )
                    }
                }
            )
            Spacer(Modifier.height(25.dp))
            GlobalButton(
                "Cambiar Contraseña",
                18,
                65,
                350,
                MainColor,
                BackgroundColor,
                MainColor,
                {
                    navController.navigate("changepassword")
                }
            )
            Spacer(Modifier.height(20.dp))
            GlobalButton(
                "Guardar Cambios",
                18,
                65,
                350,
                MainColor,
                MainColor,
                TextColorWhite,
                {
                    //Navegación más la comprobación del viewModel
                    navController.popBackStack()
                }
            )
        }
    }
}

@Preview
@Composable
fun PPDS(){
    PersonalDatesScreen(navController = NavController(LocalContext.current))
}