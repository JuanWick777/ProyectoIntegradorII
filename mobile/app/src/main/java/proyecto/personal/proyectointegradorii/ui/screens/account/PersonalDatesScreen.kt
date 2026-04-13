package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.account.PersonalDatesViewModel
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import coil.compose.AsyncImage
import java.io.File
import java.io.FileOutputStream
import proyecto.personal.proyectointegradorii.utils.ImageUrlResolver

@Composable
fun PersonalDatesScreen(navController: NavController) {
    val viewModel: PersonalDatesViewModel = viewModel()

    val name by viewModel.name.collectAsState()
    val email by viewModel.email.collectAsState()
    val currentPassword by viewModel.currentPassword.collectAsState()
    val fotoPerfil by viewModel.fotoPerfil.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val saveSuccess by viewModel.saveSuccess.collectAsState()

    val context = LocalContext.current

    fun copiarUriATemporal(uri: Uri): File? {
        return try {
            val input = context.contentResolver.openInputStream(uri) ?: return null
            val file = File.createTempFile("perfil_", ".jpg", context.cacheDir)
            val output = FileOutputStream(file)
            input.copyTo(output)
            input.close()
            output.close()
            file
        } catch (e: Exception) {
            null
        }
    }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri ->
        if (uri != null) {
            val file = copiarUriATemporal(uri)
            if (file != null) {
                viewModel.uploadPhoto(file)
            }
        }
    }

    LaunchedEffect(Unit) {
        viewModel.loadUser()
    }

    LaunchedEffect(saveSuccess) {
        if (saveSuccess) {
            viewModel.resetSaveSuccess()
            navController.popBackStack()
        }
    }

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
                .padding(vertical = 25.dp, horizontal = 20.dp)
        ) {
            GlobalCard(
                modifier = Modifier.padding(vertical = 10.dp),
                content = {
                    Column(
                        modifier = Modifier
                            .align(alignment = Alignment.Start)
                            .padding(horizontal = 20.dp, vertical = 15.dp)
                            .padding(top = 12.dp, bottom = 12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.CenterHorizontally)
                                .size(110.dp)
                                .clip(CircleShape)
                                .border(2.dp, MainColor, CircleShape)
                                .clickable {
                                    launcher.launch(
                                        PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                    )
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            if (!fotoPerfil.isNullOrBlank()) {
                                AsyncImage(
                                    model = ImageUrlResolver.resolve(fotoPerfil),
                                    contentDescription = "Foto de perfil",
                                    modifier = Modifier
                                        .matchParentSize()
                                        .clip(CircleShape)
                                )
                            } else {
                                Icon(
                                    imageVector = Icons.Default.PhotoCamera,
                                    contentDescription = "Seleccionar foto",
                                    tint = MainColor,
                                    modifier = Modifier.size(40.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        GlobalText(
                            "Nombre Completo",
                            18,
                            TextColorDark,
                            Modifier.padding(horizontal = 5.dp, vertical = 5.dp),
                            TextAlign.Left
                        )
                        GlobalTextInput(
                            value = name,
                            onValueChange = viewModel::onNameChange,
                            placeholder = "Juan Pérez",
                            modifier = Modifier.padding(bottom = 12.dp),
                            height = 60,
                            width = 350
                        )

                        GlobalText(
                            "Correo Electrónico",
                            18,
                            TextColorDark,
                            Modifier.padding(horizontal = 5.dp, vertical = 5.dp),
                            TextAlign.Left
                        )
                        GlobalTextInput(
                            value = email,
                            onValueChange = viewModel::onEmailChange,
                            placeholder = "juan.perez@email.com",
                            modifier = Modifier.padding(bottom = 6.dp),
                            height = 60,
                            width = 350
                        )

                        GlobalText(
                            "Contraseña Actual",
                            18,
                            TextColorDark,
                            Modifier.padding(horizontal = 5.dp, vertical = 5.dp),
                            TextAlign.Left
                        )
                        GlobalTextInput(
                            value = currentPassword,
                            onValueChange = viewModel::onCurrentPasswordChange,
                            placeholder = "Solo si cambias el correo",
                            modifier = Modifier.padding(bottom = 6.dp),
                            height = 60,
                            width = 350
                        )

                        if (errorMessage != null) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = errorMessage!!,
                                color = AlertColor
                            )
                        }
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
                if (isLoading) "Guardando..." else "Guardar Cambios",
                18,
                65,
                350,
                MainColor,
                MainColor,
                TextColorWhite,
                {
                    if (!isLoading) {
                        viewModel.saveProfile()
                    }
                }
            )

            if (isLoading) {
                Spacer(modifier = Modifier.height(16.dp))
                CircularProgressIndicator()
            }
        }
    }
}

@Preview
@Composable
fun PPDS() {
    PersonalDatesScreen(navController = NavController(LocalContext.current))
}
