package proyecto.personal.proyectointegradorii.ui.screens.login

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalTextButton
import proyecto.personal.proyectointegradorii.ui.components.cards.header.CardHeaderCLogo
import proyecto.personal.proyectointegradorii.ui.components.cards.login.LoginCard
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.inputs.PasswordInput
import proyecto.personal.proyectointegradorii.ui.components.texts.ErrorText
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.viewmodels.login.LoginViewModel

@Composable
fun ScreenLogin(
    navController: NavController
) {
    val context = LocalContext.current

    val viewModel: LoginViewModel = viewModel(
        factory = androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory(
            context.applicationContext as android.app.Application
        )
    )

    val email by viewModel.email.collectAsState()
    val emailError by viewModel.emailError.collectAsState()
    val password by viewModel.password.collectAsState()
    val passwordError by viewModel.passwordError.collectAsState()
    val isLoggedIn by viewModel.loginSuccess.collectAsState()

    LaunchedEffect(isLoggedIn) {
        if (isLoggedIn) {
            navController.navigate("Main") {
                popUpTo("Login") { inclusive = true }
            }
        }
    }

    val errorMessage by viewModel.generalErrorMessage.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(color = BackgroundColor)
            .padding(start = 20.dp)
            .padding(end = 20.dp)
    ) {
        CardHeaderCLogo(
            tittle = "Iniciar Sesión",
            modifier = Modifier
        )
        Spacer(modifier = Modifier.height(50.dp))
        LoginCard(
           content = {
               Column(
                   horizontalAlignment = Alignment.CenterHorizontally,
                   modifier = Modifier.fillMaxWidth().padding(15.dp),
                   verticalArrangement = Arrangement.Center
               ) {
                   GlobalText(
                       "Correo Electronico",
                       24,
                       TextColorDark,
                       Modifier.padding(top = 20.dp)
                   )
                   Spacer(modifier = Modifier.height(10.dp))
                   GlobalTextInput(
                       value = email,
                       onValueChange = { viewModel.onEmailChange(it) },
                       placeholder = "tu@gmail.com",
                       isError = emailError != null,
                       modifier = Modifier,
                       height = 65,
                       width = 275,
                   )
                   ErrorText(error = emailError, size = 14, Modifier)
                   Spacer(modifier = Modifier.height(25.dp))
                   GlobalText(
                       "Contraseña",
                       24,
                       TextColorDark,
                       Modifier
                   )
                   Spacer(modifier = Modifier.height(10.dp))
                   PasswordInput(
                       value = password,
                       onValueChange = { viewModel.onPasswordChange(it) },
                       placeholder = "• • • • • • • •",
                       isError = passwordError != null,
                       height = 65,
                       width = 275,
                       modifier = Modifier
                   )
                   ErrorText(error = passwordError, size = 14, Modifier)
                   GlobalTextButton(
                       "¿Olvidate tu contraseña?",
                       MainColor.copy(alpha = 0.8f),
                       {
                           navController.navigate("Recover")
                       },
                       Modifier,
                       true,
                       20.sp
                   )
                   Spacer(modifier = Modifier.height(30.dp))
                   GlobalButton(
                       if (isLoggedIn) "Cargando..." else "Iniciar Sesión",
                       25,
                       65,
                       275,
                       MainColor,
                       MainColor,
                       Color.White,
                       {
                           viewModel.login()
                           /*navController.navigate("Main") {
                               popUpTo("Login") { inclusive = true }
                           }*/
                       },
                       Modifier,
                       enabled = !isLoggedIn
                   )
                   ErrorText(error = errorMessage, size = 16, Modifier)
                   Spacer(Modifier.padding(10.dp))
               }
           },
            modifier = Modifier
        )
        Spacer(Modifier.height(50.dp))
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp)
        ) {
            GlobalText(
                "¿No tienes una cuenta?",
                20,
                color = Color.Gray,
                Modifier
            )
            GlobalTextButton(
                "Registrate Aquí",
                MainColor,
                {
                    navController.navigate("Register")
                },
                Modifier,
                true,
                20.sp
            )
        }
    }
}