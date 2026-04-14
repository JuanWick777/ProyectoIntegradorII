package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.components.inputs.GlobalTextInput
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.CommentContentColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark

@Composable
fun ChangePasswordScreen(
    navController: NavController
)   {
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        // 1. HEADER
        HeaderCBack(
            tittle = "Cambiar Contraseña",
            sizetittle = 28,
            navController = navController,
            backgroundColor = MainColor
        )

        // Contenedor principal para darle padding a los elementos de adentro
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(25.dp))

            // 2. CAJA DE INFORMACIÓN (Reglas de contraseña)
            Surface(
                color = CommentContentColor,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Lock,
                        contentDescription = "Reglas de contraseña",
                        tint = MainColor
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    GlobalText(
                        texto = "Tu contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula, número y símbolo.",
                        tamanio = 14,
                        color = MainColor,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(25.dp))

            // 3. TARJETA GLOBAL CON LOS INPUTS
            GlobalCard(
                content = {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.Start
                    ) {
                        // Input Contraseña Actual
                        GlobalText(
                            texto = "Contraseña Actual",
                            tamanio = 16,
                            color = TextColorDark,
                            peso = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        GlobalTextInput(
                            value = currentPassword,
                            onValueChange = { currentPassword = it },
                            placeholder = "........",
                            height = 55,
                            width = 350, // Se ajustará gracias al Modifier del componente
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Input Nueva Contraseña
                        GlobalText(
                            texto = "Nueva Contraseña",
                            tamanio = 16,
                            color = TextColorDark,
                            peso = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        GlobalTextInput(
                            value = newPassword,
                            onValueChange = { newPassword = it },
                            placeholder = "........",
                            height = 55,
                            width = 350,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Input Confirmar Contraseña
                        GlobalText(
                            texto = "Confirmar Nueva Contraseña",
                            tamanio = 16,
                            color = TextColorDark,
                            peso = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        GlobalTextInput(
                            value = confirmPassword,
                            onValueChange = { confirmPassword = it },
                            placeholder = "........",
                            height = 55,
                            width = 350,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            )

            Spacer(modifier = Modifier.height(30.dp))

            // 4. BOTONES CANCELAR Y ACTUALIZAR
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween, // Separa los botones a los extremos
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Botón Cancelar (Blanco con borde naranja)
                GlobalButton(
                    text = "Cancelar",
                    textsize = 16,
                    alt = 55,
                    ancho = 160,
                    bordercolorbutton = MainColor,
                    colorbutton = BackgroundColor, // Color del fondo
                    colortext = MainColor, // Texto naranja
                    modifier = Modifier
                        .border(1.dp, MainColor, RoundedCornerShape(15.dp)), // Le pasamos el borde naranja
                    onClick = {
                        navController.popBackStack()
                    }
                )

                // Botón Actualizar (Totalmente Naranja)
                GlobalButton(
                    text = "Actualizar",
                    textsize = 16,
                    alt = 55,
                    ancho = 160,
                    bordercolorbutton = Color.White,
                    colorbutton = MainColor,
                    colortext = Color.White,
                    onClick = {
                        // Aquí irá la lógica para actualizar la contraseña
                        navController.navigate("personaldates")
                    }
                )
            }
        }
    }
}

@Preview
@Composable
fun PCPS(){
    ChangePasswordScreen(navController = NavController(context = LocalContext.current))
}