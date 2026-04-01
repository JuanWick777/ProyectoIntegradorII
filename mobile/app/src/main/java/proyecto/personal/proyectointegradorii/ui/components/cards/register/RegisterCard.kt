package proyecto.personal.proyectointegradorii.ui.components.cards.register

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor

@Composable
fun RegisterCard(
    content: @Composable ColumnScope.() -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = BackgroundCardColor,
        shadowElevation = 8.dp,
        shape = RoundedCornerShape(24.dp),
        modifier = modifier
            .fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(),
            content = content,
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        )
    }
}