package proyecto.personal.proyectointegradorii.ui.components.alerts.successful

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor
import proyecto.personal.proyectointegradorii.ui.theme.SuccessfulColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite

@Composable
fun SuccessOrderDialog(
    onDismiss: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        // Esto evita que el usuario lo cierre tocando afuera, forzándolo a presionar "Aceptar"
        properties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false)
    ) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = BackgroundCardColor,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // --- ÍCONO DE ÉXITO ---
                Box(
                    modifier = Modifier
                        .size(90.dp)
                        .border(width = 4.dp, color = SuccessfulColor, shape = CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Éxito",
                        tint = SuccessfulColor,
                        modifier = Modifier.size(55.dp)
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                GlobalText(
                    texto = "¡Pedido Exitoso!",
                    tamanio = 22,
                    color = TextColorDark,
                    peso = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(12.dp))

                GlobalText(
                    texto = "Tu pedido ha sido recibido. Por favor espera a que un mesero confirme tu orden. ¡Gracias por tu preferencia!",
                    tamanio = 15,
                    color = TextColorGray,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(26.dp))

                GlobalButton(
                    text = "Aceptar",
                    textsize = 16,
                    alt = 55,
                    ancho = 350,
                    bordercolorbutton = SuccessfulColor,
                    colorbutton = SuccessfulColor,
                    colortext = TextColorWhite,
                    modifier = Modifier.fillMaxWidth(),
                    onClick = onDismiss
                )
            }
        }
    }
}