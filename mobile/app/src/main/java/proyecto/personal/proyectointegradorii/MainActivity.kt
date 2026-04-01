package proyecto.personal.proyectointegradorii

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import proyecto.personal.proyectointegradorii.ui.navigation.Navigation
import proyecto.personal.proyectointegradorii.ui.theme.ProyectoIntegradorIITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ProyectoIntegradorIITheme {
                Navigation()
            }
        }
    }
}