package proyecto.personal.proyectointegradorii.ui.components.inputs

import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor
import proyecto.personal.proyectointegradorii.ui.theme.BorderInputColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun GlobalTextInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    height: Int,
    width: Int,
    readOnly: Boolean = false,
    isError: Boolean = false,
)  {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = {
            Text(text=placeholder)
        },
        readOnly = readOnly,
        isError = isError,
        modifier = modifier
            .height(height.dp)
            .width(width.dp),
        shape = RoundedCornerShape(12.dp),
        singleLine = true,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = MainColor,
            unfocusedBorderColor = BorderInputColor,
            errorBorderColor = AlertColor,
            focusedTextColor = TextColorDark,
            unfocusedTextColor = TextColorGray
        )
    )
}