package proyecto.personal.proyectointegradorii.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.cards.HistoryCard
import proyecto.personal.proyectointegradorii.ui.components.headers.HeaderCBack
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor

@Composable
fun HistoryScreen(
    navController: NavController
)   {
    val na: List<String> = listOf("perico", "pollo")
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
    ) {
        HeaderCBack(
            "Historial de Pedidos",
            30,
            Modifier,
            navController
        )
        Spacer(Modifier.height(24.dp))
        LazyColumn(
            modifier = Modifier.padding(
                horizontal = 20.dp,
                vertical = 15.dp
            )
                .background(BackgroundColor)
        ) {
            item {
                HistoryCard(
                    "120",
                    "Completado",
            "2020",
                    na,
                    "330",
                    Modifier
                )
            }
        }
    }
}