package proyecto.personal.proyectointegradorii.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import proyecto.personal.proyectointegradorii.ui.screens.internal.SMain
import proyecto.personal.proyectointegradorii.ui.screens.internal.account.SAccount
import proyecto.personal.proyectointegradorii.ui.screens.login.ScreenLogin
import proyecto.personal.proyectointegradorii.ui.screens.recover.SRecoverPassword
import proyecto.personal.proyectointegradorii.ui.screens.register.ScreenRegister

@Composable
fun Navigation(){
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "Login"
    ){
        composable("Login"){
            ScreenLogin(navController)
        }
        composable("Register"){
            ScreenRegister(navController)
        }
        composable("Recover"){
            SRecoverPassword(navController)
        }

        composable("Account"){
            SAccount(navController, navController)
        }

        composable("Main"){
            SMain(navController)
        }
    }

}