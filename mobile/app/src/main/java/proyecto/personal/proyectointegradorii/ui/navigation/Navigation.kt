package proyecto.personal.proyectointegradorii.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import proyecto.personal.proyectointegradorii.ui.screens.account.ChangePasswordScreen
import proyecto.personal.proyectointegradorii.ui.screens.account.HistoryScreen
import proyecto.personal.proyectointegradorii.ui.screens.account.PersonalDatesScreen
import proyecto.personal.proyectointegradorii.ui.screens.internal.SMain
import proyecto.personal.proyectointegradorii.ui.screens.account.SConfigurate
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
        composable("Main"){
            SMain(navController)
        }
        composable("Configurate"){
            SConfigurate(navController)
        }
        composable("personaldates"){
            PersonalDatesScreen(navController)
        }
        composable("history"){
            HistoryScreen(navController)
        }
        composable("changepassword"){
            ChangePasswordScreen(navController)
        }
    }

}