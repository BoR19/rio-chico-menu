# 🍷 Restaurante Río Chico — Catálogo Digital & App Móvil (Tarija, Bolivia)

Aplicación móvil y catálogo digital interactivo de alta fidelidad con diseño y experiencia de usuario estilo **iOS / Apple Human Interface Guidelines**, concebido especialmente para la tradición culinaria a la leña de **Restaurante Río Chico** en Tarija.

---

## 📱 Características Principales

1. **Pantalla de Bienvenida (Splash / Hero Screen iOS):**
   - Fondo con suave efecto **Ken Burns** de carnes asándose a las brasas a la cruz.
   - Logo oficial (`rio_chico_orange_glow (1)_2.png`) con resplandor anaranjado (`drop-shadow`) y fallback SVG de seguridad con `onerror`.
   - Distintivo glassmorphism de cortesía: *"🥗 ¡Ensaladas frescas gratuitas de cortesía!"*.
   - Botón principal de estilo iOS con degradado `from-red-600 to-amber-600` (*"Ver Menú Digital"*).
   - Animaciones fluidas de entrada y salida suave hacia el menú.

2. **Interfaz Principal del Menú:**
   - **Header Glassmorphic:** Miniatura del logo, badge en vivo con pulso *"Abierto Hoy - Tarija"*, y acceso rápido para retornar a la portada.
   - **Banner de Ensaladas de Cortesía:** Destaca *"¡INVITA LA CASA!"* para ensaladas libres con platos fuertes.
   - **Navegación Horizontal Deslizable:** Categorías con scroll suave, iconos y conteo dinámico.
   - **Buscador en tiempo real:** Filtra al instante platos por nombre, ingredientes o descripción.
   - **Bento Grid de Platos:** Tarjetas elegantes con lazy loading (`loading="lazy"`), indicación de precio en Bolivianos (`Bs`), badge de cortesía y control táctil (+/-) con feedback háptico.

3. **Carrito Flotante & Pedidos por WhatsApp con Ticket Único:**
   - Barra flotante en la parte inferior (`fixed bottom-4`) que aparece automáticamente al seleccionar platos.
   - **Modal de Detalle / Modificación:** Permite ingresar notas específicas por plato (ej. *"Término medio"*, *"Sin vinagre"*), seleccionar entre **Mesa en Salón** (con número de mesa) o **Para Llevar / Delivery Tarija**, y notas para cocina.
   - **Sistema de Tickets Únicos (`#RC-XXXX`):** Genera un código aleatorio de 4 dígitos para trazabilidad de cada comanda.
   - **Mensaje de WhatsApp Estructurado:** Formateado con emojis, desglose de precios, nota del cliente, total en Bolivianos (Bs) e instrucciones claras para modificar o cancelar el pedido citando el código de ticket dentro de los primeros 10 minutos.

4. **Mesero Sommelier IA (Simulado / Modal):**
   - Sugerencias automáticas de maridaje con vinos tarijeños (Terruño, Kohlberg, Aranjuez, Vino Patero artesanal), especialidades a la cruz (Lechón, Costillar) y combos familiares con botón directo para añadir la sugerencia al carrito.

5. **Rendimiento & Arquitectura:**
   - **Estrategia de Caché Local:** Carga instantánea desde `localStorage` bajo la clave `rio_chico_menu_v5`.
   - **Sincronización:** Conexión vía PapaParse con la hoja de Google Sheets en vivo (`https://docs.google.com/spreadsheets/d/1Kbk5U4fPVOYhcrNEOE9tBPQxR-hWZ1VcBoq-iwHQzX4/export?format=csv&gid=0`).
   - **Respaldo Local (Fallback Data):** Menú completo offline con los 48 platos y bebidas tradicionales de Tarija en caso de fallo de red.

### ⚠️ Limitación de sincronización de pedidos

La versión web mantiene mesas y comandas en memoria del navegador; la app Expo mantiene estados separados en cada pantalla. No hay un backend compartido, por lo que los pedidos enviados desde Expo abren WhatsApp pero no aparecen automáticamente en el KDS web ni se sincronizan entre dispositivos. Para operar la cocina en varios dispositivos hace falta conectar ambas versiones a un servicio de pedidos compartido.

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción A: Versión Web / PWA Móvil Instantánea (Recomendada)
Para abrir la aplicación web inmediatamente en tu navegador o probarla en tu teléfono móvil vía Wi-Fi:

```bash
cd "C:\Users\H3CTOR\.gemini\antigravity\scratch\rio-chico-menu"
npm start
```
Luego abre tu navegador en:
👉 **`http://localhost:3000`** (o con doble clic en `index.html`)

### Opción B: Proyecto Nativo React Native con Expo
Para compilar la aplicación nativa en iOS o Android:

```bash
cd "C:\Users\H3CTOR\.gemini\antigravity\scratch\rio-chico-menu\expo-app"
npm install
npx expo start
```
Escanea el código QR desde la app **Expo Go** en tu iPhone o dispositivo Android.

---

## 📂 Estructura del Proyecto

```
rio-chico-menu/
├── index.html                  # PWA / Aplicación Web Móvil Completa (Tailwind v4, Lucide, PapaParse)
├── manifest.json               # Manifiesto PWA para instalación en pantalla de inicio iOS/Android
├── server.js                   # Servidor local Node.js de alta velocidad (puerto 3000)
├── package.json                # Configuración de scripts del proyecto
├── assets/                     # Logos oficiales (3D, Cutout, Orange Glow, Wood Carbon)
│   ├── rio_chico_orange_glow (1)_2.png
│   ├── rio_chico_orange_glow.png
│   └── ...
└── expo-app/                   # Proyecto nativo React Native / Expo
    ├── App.js                  # Root Component con gestión de pantallas y StatusBar
    ├── app.json                # Configuración de bundle iOS/Android y Splash
    ├── package.json            # Dependencias React Native, Expo, Haptics, LinearGradient
    └── src/
        ├── screens/            # WelcomeScreen.js, MenuScreen.js
        ├── components/         # DishCard.js, CartFloatingBar.js, OrderSheetModal.js, AiAssistantModal.js
        ├── services/           # menuService.js (PapaParse, AsyncStorage, WhatsApp builder)
        └── constants/          # fallbackData.js (48 platos oficiales de Tarija)
```
