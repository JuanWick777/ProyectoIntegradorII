package proyecto.personal.proyectointegradorii.ui.screens.internal

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import proyecto.personal.proyectointegradorii.ui.components.bars.navigationbar.MainBottomBar
import proyecto.personal.proyectointegradorii.ui.screens.internal.cart.SCart
import proyecto.personal.proyectointegradorii.ui.screens.internal.home.SHome
import proyecto.personal.proyectointegradorii.ui.screens.internal.offers.SOffers
import proyecto.personal.proyectointegradorii.ui.screens.internal.points.SPoints
import proyecto.personal.proyectointegradorii.ui.screens.internal.scan.SScan

@Composable
fun SMain(rootNavController: NavHostController) {

    val navController = rememberNavController()
    var showCategories by remember { mutableStateOf(false) }

    Scaffold(
        bottomBar = {
            MainBottomBar(navController)
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { SHome(navController, rootNavController) }
            composable("cart") { SCart() }
            composable("scan") { SScan() }
            composable("offers") { SOffers() }
            composable("points") { SPoints() }
        }
    }
}