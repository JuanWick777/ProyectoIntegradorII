package proyecto.personal.proyectointegradorii.ui.components.bars.navigationbar

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.compose.currentBackStackEntryAsState
import proyecto.personal.proyectointegradorii.ui.navigation.internalroutes.BottomNavItems
import proyecto.personal.proyectointegradorii.ui.theme.MainColor

@Composable
fun MainBottomBar(
    navController: NavController
) {
    val items = listOf(
        BottomNavItems.Home,
        BottomNavItems.Scan,
        BottomNavItems.Cart,
        BottomNavItems.Offers,
        BottomNavItems.Points
    )

    val currentRoute = navController
        .currentBackStackEntryAsState().value?.destination

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
    ) {
        NavigationBar(
            modifier = Modifier
                .fillMaxWidth()
                .clip(
                    RoundedCornerShape(
                        topStart = 30.dp,
                        topEnd = 30.dp
                    )
                ),
            containerColor = Color.White,
            tonalElevation = 8.dp,
        ) {
            items.forEach { item ->
                val isSelected =
                    currentRoute?.hierarchy?.any { it.route == item.route } == true

                NavigationBarItem(
                    selected = isSelected,
                    onClick = {
                        navController.navigate(item.route) {
                            popUpTo(navController.graph.startDestinationId)
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = item.icon,
                            item.label,
                        )
                    },
                    label = {
                        Text(
                            item.label,
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = Color.Transparent,
                        selectedIconColor = MainColor,
                        selectedTextColor = MainColor,
                        unselectedIconColor = Color.Gray,
                        unselectedTextColor = Color.Gray
                    )
                )
            }
        }
    }
}