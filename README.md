# ProyectoIntegradorII

## Configuracion del backend

El backend ya no guarda credenciales reales dentro del repo. Para correrlo, cada persona debe definir estas variables de entorno:

```env
DB_URL=jdbc:oracle:thin:@chiao123_low?TNS_ADMIN=src/main/resources/wallet
DB_USERNAME=TU_USUARIO
DB_PASSWORD=TU_PASSWORD
JWT_SECRET=TU_CLAVE_JWT_SEGURA
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=TU_CORREO
MAIL_PASSWORD=TU_CONTRASENA_DE_APLICACION
```

Hay un ejemplo listo en [back/.env.example](C:/Users/mgama/IdeaProjects/ProyectoIntegradorII/back/.env.example).

## Opcion recomendada en IntelliJ

1. Abrir `Run > Edit Configurations`.
2. Seleccionar la configuracion del backend.
3. En `Environment variables`, agregar `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME` y `MAIL_PASSWORD`.
4. Guardar y ejecutar el backend normalmente.

## Archivos locales ignorados

Estos archivos se pueden usar localmente y no se suben al repo:

- `back/.env`
- `back/.env.local`
- `back/application-local.properties`
- `back/src/main/resources/application-local.properties`

## Nota para el equipo

- No subir credenciales reales a git.
- Si cambia la base o el wallet, solo se actualizan las variables locales de cada persona.
- `JWT_SECRET` debe tener al menos 32 caracteres.
- Para Gmail, `MAIL_PASSWORD` debe ser una contrasena de aplicacion, no tu contrasena normal.
