package proyecto.personal.proyectointegradorii.ui.screens.recover

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.ForwardToInbox
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.header.CardHeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.cards.recover.RecoverCard
import proyecto.personal.proyectointegradorii.ui.components.images.CircularIcon
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.CommentContentColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite

@Composable
fun SRecoverPassword(
    navController: NavController
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(
                start = 20.dp,
                end = 20.dp
            )
    ) {
        CardHeaderCBack(
            "Recuperar Contraseña",
            27,
            Modifier,
            navController
        )
        Spacer(modifier = Modifier.padding(vertical = 35.dp))
        RecoverCard(
            modifier = Modifier,
            content = {
                Column(
                    modifier = Modifier.padding(horizontal = 15.dp),
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(vertical = 20.dp)
                    ) {
                        CircularIcon(
                            Icons.Default.Email,
                            MainColor,
                            CommentContentColor,
                            "Icono de un correo"
                        )
                        Spacer(Modifier.padding(vertical = 15.dp))
                        GlobalText(
                            "Ingresa tu correo electronico y te enviaremos un código para reestablecer tu contraseña",
                            14,
                            TextColorGray,
                            Modifier
                        )
                        Spacer(Modifier.padding(vertical = 20.dp))
                        GlobalText(
                            "Correo Electrónico",
                            18,
                            TextColorDark,
                            Modifier
                        )
                        Spacer(Modifier.padding(vertical = 5.dp))
                        GlobalTextInput(
                            "",
                            {},
                            "tu@email.com",
                            Modifier,
                            60,
                            350
                        )
                        Spacer(Modifier.padding(vertical = 15.dp))
                        GlobalButton(
                            "Enviar Código",
                            18,
                            65,
                            350,
                            MainColor,
                            MainColor,
                            TextColorWhite,
                            {},
                            Modifier
                        )
                        Spacer(Modifier.padding(vertical = 10.dp))
                        GlobalButton(
                            "Volver al inicio de sesión",
                            18,
                            65,
                            350,
                            Color.White,
                            Color.White,
                            TextColorDark,
                            {
                                navController.popBackStack()
                            }
                        )
                    }
                    Spacer(Modifier.padding(vertical = 18.dp))
                }
            }
        )
    }
}

@Preview
@Composable
fun PSRP(
) {
    SRecoverPassword(navController = NavController(LocalContext.current))
}