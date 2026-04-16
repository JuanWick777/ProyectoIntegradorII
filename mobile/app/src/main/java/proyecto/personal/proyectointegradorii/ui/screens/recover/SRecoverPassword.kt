package proyecto.personal.proyectointegradorii.ui.screens.recover

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MailOutline
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.images.CircularIcon
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.inputs.PasswordInput
import proyecto.personal.proyectointegradorii.ui.components.texts.ErrorText
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.CommentContentColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.recover.RecoverViewModel

@Composable
fun SRecoverPassword(
    navController: NavController,
    viewModel: RecoverViewModel = viewModel()
) {
    val email by viewModel.email.collectAsState()
    val code by viewModel.code.collectAsState()
    val nPassword by viewModel.nPassword.collectAsState()
    val cPassword by viewModel.cPassword.collectAsState()
    val isCodeSent by viewModel.codeSent.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val resetSuccess by viewModel.resetSuccess.collectAsState()
    val emailError by viewModel.emailError.collectAsState()
    val codeError by viewModel.codeError.collectAsState()
    val npasswordError by viewModel.npasswordError.collectAsState()
    val cpasswordError by viewModel.cpasswordError.collectAsState()
    val generalMessage by viewModel.generalMessage.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(start = 10.dp, end = 10.dp)
    ) {
        HeaderCBack(
            if (isCodeSent) "Nueva Contrasena" else "Recuperar Contrasena",
            if (isCodeSent) 30 else 27,
            MainColor,
            Modifier,
            navController
        )
        Spacer(modifier = Modifier.padding(vertical = 35.dp))

        if (!isCodeSent) {
            GlobalCard(
                modifier = Modifier,
                content = {
                    Column(modifier = Modifier.padding(horizontal = 15.dp)) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center,
                            modifier = Modifier.padding(vertical = 20.dp)
                        ) {
                            CircularIcon(
                                Icons.Default.MailOutline,
                                MainColor,
                                CommentContentColor,
                                "Icono de correo"
                            )
                            Spacer(Modifier.padding(vertical = 15.dp))
                            GlobalText(
                                "Ingresa tu correo electronico y te enviaremos un codigo para restablecer tu contrasena",
                                14,
                                TextColorGray,
                                Modifier
                            )
                            Spacer(Modifier.padding(vertical = 20.dp))
                            GlobalText("Correo Electronico", 18, TextColorDark, Modifier)
                            Spacer(Modifier.padding(vertical = 5.dp))
                            GlobalTextInput(
                                email,
                                { viewModel.onEmailChange(it) },
                                "tu@email.com",
                                Modifier,
                                60,
                                350,
                                isError = emailError != null
                            )
                            ErrorText(emailError, 14, Modifier)
                            ErrorText(generalMessage, 14, Modifier)
                            Spacer(Modifier.padding(vertical = 15.dp))
                            GlobalButton(
                                if (isLoading) "Enviando..." else "Enviar Codigo",
                                18,
                                65,
                                350,
                                MainColor,
                                MainColor,
                                TextColorWhite,
                                { viewModel.sendRecoveryCode() },
                                Modifier,
                                enabled = !isLoading
                            )
                            Spacer(Modifier.padding(vertical = 10.dp))
                            GlobalButton(
                                "Volver al inicio de sesion",
                                18,
                                65,
                                350,
                                Color.White,
                                Color.White,
                                TextColorDark,
                                { navController.popBackStack() }
                            )
                        }
                        Spacer(Modifier.padding(vertical = 18.dp))
                    }
                }
            )
        } else {
            GlobalCard(
                content = {
                    Column(
                        modifier = Modifier.padding(vertical = 30.dp, horizontal = 20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(70.dp)
                                .background(
                                    color = MainColor.copy(alpha = 0.15f),
                                    shape = CircleShape
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularIcon(
                                Icons.Outlined.Lock,
                                MainColor,
                                CommentContentColor,
                                "Icono de candado"
                            )
                        }
                        Spacer(modifier = Modifier.height(15.dp))
                        GlobalText(
                            "Ingresa el codigo que enviamos a tu correo electronico y crea una nueva contrasena",
                            15,
                            TextColorGray,
                            Modifier.padding(horizontal = 10.dp),
                            TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(25.dp))
                        Column(horizontalAlignment = Alignment.Start) {
                            GlobalText("Codigo de Verificacion", 18, TextColorDark, Modifier.padding(bottom = 8.dp))
                            GlobalTextInput(
                                value = code,
                                onValueChange = { viewModel.onCodeChange(it) },
                                placeholder = "000000",
                                isError = codeError != null,
                                height = 60,
                                width = 350
                            )
                            ErrorText(codeError, 15, Modifier)
                            Spacer(modifier = Modifier.height(20.dp))
                            GlobalText("Nueva Contrasena", 18, TextColorDark, Modifier.padding(bottom = 8.dp))
                            PasswordInput(
                                value = nPassword,
                                onValueChange = { viewModel.onNPasswordChange(it) },
                                placeholder = "********",
                                isError = npasswordError != null,
                                height = 60,
                                width = 350
                            )
                            ErrorText(npasswordError, 14, Modifier)
                            Spacer(modifier = Modifier.height(20.dp))
                            GlobalText("Confirmar Contrasena", 18, TextColorDark, Modifier.padding(bottom = 8.dp))
                            PasswordInput(
                                value = cPassword,
                                onValueChange = { viewModel.onCPasswordChange(it) },
                                placeholder = "********",
                                isError = cpasswordError != null,
                                height = 60,
                                width = 350
                            )
                            ErrorText(cpasswordError, 14, Modifier)
                            ErrorText(generalMessage, 14, Modifier)
                        }
                        Spacer(modifier = Modifier.height(35.dp))
                        GlobalButton(
                            text = if (isLoading) "Cargando..." else "Restablecer Contrasena",
                            textsize = 18,
                            alt = 60,
                            ancho = 350,
                            bordercolorbutton = MainColor,
                            colorbutton = MainColor,
                            colortext = TextColorWhite,
                            onClick = { viewModel.resetPassword() },
                            modifier = Modifier,
                            enabled = !isLoading
                        )
                    }
                }
            )
        }
    }

    if (resetSuccess) {
        AlertDialog(
            onDismissRequest = {},
            title = { Text("Contrasena actualizada") },
            text = {
                Text(
                    generalMessage
                        ?: "Tu contrasena se actualizo correctamente. Ahora puedes iniciar sesion."
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.consumeResetSuccess()
                        navController.navigate("Login") {
                            popUpTo("Recover") { inclusive = true }
                        }
                    }
                ) {
                    Text("Aceptar")
                }
            }
        )
    }
}
