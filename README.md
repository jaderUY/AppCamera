# AppCamera

Aplicación móvil de cámara y galería creada con Ionic, Angular y Capacitor. Permite tomar fotografías, guardarlas en la galería del dispositivo y verlas en una galería dentro de la aplicación.

## Funcionalidades

- Captura fotografías con la cámara del dispositivo.
- Guarda las capturas en la galería del dispositivo.
- Muestra las fotografías tomadas durante la sesión actual, con fecha y hora.
- Indica errores de captura en la interfaz.

> La galería de la aplicación se mantiene en memoria: al cerrar o recargar la app, la lista mostrada se reinicia. Las fotografías guardadas en la galería del dispositivo permanecen allí.

## Tecnologías

- Angular 22
- Ionic 9
- Capacitor 8
- Capacitor Camera

## Requisitos

- Node.js y npm
- Para ejecutar en Android: Android Studio y el SDK de Android

## Instalación

Clona el repositorio y ejecuta desde la carpeta del proyecto:

```bash
npm install
```

## Ejecución en el navegador

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

La captura y el guardado de fotografías dependen de las capacidades de cámara de la plataforma; para probar el flujo nativo, ejecuta la aplicación en un dispositivo o emulador compatible.

## Ejecución en Android

Sincroniza los recursos web y los plugins con el proyecto nativo:

```bash
npx cap sync android
```

Abre el proyecto en Android Studio:

```bash
npx cap open android
```

También puedes compilar la aplicación web antes de sincronizar:

```bash
npm run build
npx cap sync android
```

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Angular. |
| `npm run build` | Compila la aplicación web. |
| `npm test` | Ejecuta las pruebas configuradas. |
| `npm run lint` | Ejecuta el análisis estático configurado. |
