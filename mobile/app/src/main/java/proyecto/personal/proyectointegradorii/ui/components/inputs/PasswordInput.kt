package proyecto.personal.proyectointegradorii.ui.components.inputs

import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
import proyecto.personal.proyectointegradorii.ui.theme.BorderInputColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun PasswordInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    height: Int,
    width: Int,
    modifier: Modifier = Modifier,
    isError: Boolean = false
)   {
    var passwordVisible by remember { mutableStateOf(true) }

    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(text = placeholder) },
        modifier = modifier
            .height(height.dp)
            .width(width.dp),
        singleLine = true,
        isError = isError,
        shape = RoundedCornerShape(12.dp),
        visualTransformation = if (passwordVisible)
            PasswordVisualTransformation()
        else VisualTransformation.None,

        trailingIcon = {
            val icon = if (passwordVisible)
                Icons.Default.VisibilityOff
            else
                Icons.Default.Visibility

            IconButton(
                onClick = { passwordVisible = !passwordVisible }
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = if (passwordVisible)
                    "Mostrar Contraseña"
                    else
                    "Ocultar Contraseña"
                )
            }
        },
        keyboardOptions = KeyboardOptions(
            keyboardType =  KeyboardType.Password,
            imeAction = ImeAction.Done
        ),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = MainColor,
            unfocusedBorderColor = BorderInputColor,
            errorBorderColor = AlertColor,
            focusedTextColor = TextColorDark,
            unfocusedTextColor = TextColorGray
        )
    )
}