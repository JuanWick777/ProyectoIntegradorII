package proyecto.personal.proyectointegradorii.ui.components.bars

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.bars.searchbar.AppSearchBar

@Composable
fun HomeTopBar(
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    onToggleCategories: () -> Unit,
    onProfileClick: () -> Unit,
    menuEnabled: Boolean
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            IconButton(
                onClick = {
                    if (menuEnabled) onToggleCategories()
                },
                modifier = Modifier
                    .size(50.dp)
                    .background(Color.White, RoundedCornerShape(16.dp))
            ) {
                Icon(Icons.Default.Tune, contentDescription = "Filtrar categorías")
            }

            Spacer(modifier = Modifier.width(12.dp))

            AppSearchBar(
                query = searchQuery,
                onQueryChange = {
                    if (menuEnabled) onSearchChange(it)
                },
                modifier = Modifier.weight(1f),
                enabled = menuEnabled
            )

            Spacer(modifier = Modifier.width(12.dp))

            IconButton(onClick = onProfileClick) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = "Perfil"
                )
            }
        }
    }
}
