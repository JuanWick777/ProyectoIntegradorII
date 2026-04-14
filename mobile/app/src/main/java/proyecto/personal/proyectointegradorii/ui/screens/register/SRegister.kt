package proyecto.personal.proyectointegradorii.ui.screens.register

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.inputs.PasswordInput
import proyecto.personal.proyectointegradorii.ui.components.texts.ErrorText
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.viewmodels.register.RegisterViewModel

@Composable
fun ScreenRegister(
    navController: NavController
) {

    val context = LocalContext.current

    val viewModel: RegisterViewModel = viewModel(
        factory = androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory(
            context.applicationContext as android.app.Application
        )
    )

    val success by viewModel.success.collectAsState()

    LaunchedEffect(success) {
        if (success) {
            navController.navigate("Login") {
                popUpTo("Register") { inclusive = true }
            }
        }
    }

    val name by viewModel.name.collectAsState()
    val errorName by viewModel.errorName.collectAsState()
    val email by viewModel.email.collectAsState()
    val errorEmail by viewModel.errorEmail.collectAsState()
    val password by viewModel.password.collectAsState()
    val errorPassword by viewModel.errorPassword.collectAsState()
    val confirmPassword by viewModel.confirmPassword.collectAsState()
    val errorConfirmPassword by viewModel.errorConfirmPassword.collectAsState()
    val isRegister by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successRegister by viewModel.success.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(
                start = 20.dp,
                end = 20.dp
            )
    ) {
        HeaderCBack(
            "Crear Cuenta",
            35,
            MainColor,
            Modifier,
            navController
        )
        Spacer(modifier = Modifier.height(40.dp))
        GlobalCard(
            modifier = Modifier,
            content = {
                Column(
                    modifier = Modifier.padding(vertical = 18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Column (
                        modifier = Modifier
                            .padding(top = 10.dp)
                            .padding(start = 15.dp, end = 15.dp)
                    ) {
                        GlobalText(
                            "Nombre Completo",
                            20,
                            TextColorDark,
                            Modifier.padding(bottom = 10.dp)
                        )
                        GlobalTextInput(
                            name,
                            { viewModel.onNameChange(it) },
                            "Juan Peréz",
                            Modifier,
                            60,
                            350
                        )
                        ErrorText(errorName, 14, Modifier)
                        Spacer(Modifier.padding(vertical = 12.dp))
                        GlobalText(
                            "Correo Electrónico",
                            20,
                            TextColorDark,
                            Modifier.padding(bottom = 10.dp)
                        )
                        GlobalTextInput(
                            email,
                            { viewModel.onEmailChange(it) },
                            "tu@email.com",
                            Modifier,
                            60,
                            350
                        )
                        ErrorText(errorEmail, 14, Modifier)
                        Spacer(Modifier.padding(vertical = 12.dp))
                        GlobalText(
                            "Contraseña",
                            20,
                            TextColorDark,
                            Modifier.padding(bottom = 10.dp)
                        )
                        PasswordInput(
                            password,
                            { viewModel.onPasswordChange(it)},
                            "•••••••",
                            60,
                            350,
                            Modifier
                        )
                        ErrorText(errorPassword, 14, Modifier)
                        Spacer(Modifier.padding(vertical = 12.dp))
                        GlobalText(
                            "Confirmar Contraseña",
                            20,
                            TextColorDark,
                            Modifier.padding(bottom = 10.dp)
                        )
                        PasswordInput(
                            confirmPassword,
                            { viewModel.onConfirmPasswordChange(it) },
                            "•••••••",
                            60,
                            350,
                            Modifier
                        )
                        ErrorText(errorConfirmPassword, 14, Modifier)
                    }
                    Spacer(Modifier.padding(vertical = 20.dp))
                    Column (
                        modifier = Modifier.padding(vertical = 15.dp)
                    ) {
                        Row(
                            Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            GlobalButton(
                                "Cancelar",
                                20,
                                55,
                                130,
                                MainColor,
                                BackgroundCardColor,
                                MainColor,
                                {
                                    navController.popBackStack()
                                },
                                Modifier
                            )
                            GlobalButton(
                                if(isRegister) "..." else "Registrar",
                                20,
                                55,
                                130,
                                MainColor,
                                MainColor,
                                Color.White,
                                {
                                    viewModel.registrar()
                                    if (successRegister) {
                                        navController.navigate("Login") {
                                            popUpTo("Register") { inclusive = true }
                                        }
                                    }
                                },
                                Modifier
                            )
                        }
                        ErrorText(errorMessage, 16, Modifier)
                    }
                }
            }
        )
    }
}