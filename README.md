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

### 🔥 Sincronización Firebase

La versión web y el KDS usan Firebase Authentication y Cloud Firestore para sincronizar pedidos, mesas y solicitudes en tiempo real. La app Expo aún no está conectada a Firebase: los pedidos que se envían desde Expo no aparecen en el KDS.

#### Preparar el proyecto Firebase

1. En Firebase Console, habilita **Authentication > Sign-in method > Correo electrónico/contraseña**.
2. En **Authentication > Settings > Authorized domains**, agrega el dominio publicado de la aplicación (por ejemplo, `rio-chico-menu.vercel.app`). `localhost` se usa para desarrollo local.
3. Publica las reglas de este repositorio: abre `firestore.rules`, copia todo su contenido y pégalo en **Firestore Database > Rules** en Firebase Console. Pulsa **Publicar**.
4. En **Authentication > Users**, agrega la primera cuenta de administrador con correo y contraseña.
5. Copia su UID y, en **Firestore Database > Data**, crea una colección `staff` y un documento cuyo ID sea exactamente ese UID. Agrega estos campos:

   | Campo | Tipo | Valor |
   |---|---|---|
   | `name` | string | Nombre del administrador |
   | `email` | string | El correo de la cuenta |
   | `role` | string | `admin` |
   | `active` | boolean | `true` |

   El primer perfil se crea manualmente porque solo un administrador existente puede crear perfiles de personal desde la aplicación. Para el resto del personal, crea cada cuenta en Authentication y después su perfil en `staff`, usando el rol `mozo` o `cajero`.
6. Abre la aplicación y entra desde el acceso de personal con el correo y contraseña. Las cuentas y perfiles se administran en Firebase Console; la sección **Personal** de la aplicación solo muestra los perfiles sincronizados.

La configuración del SDK web está en `firebase-config.js`; son identificadores públicos de la aplicación web. El acceso a los datos debe protegerse con las reglas de `firestore.rules`. No publiques claves de cuenta de servicio ni contraseñas.

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
├── firebase-config.js          # Configuración pública del SDK web de Firebase
├── firebase.json               # Ubicación de las reglas Firestore
├── firestore.rules             # Reglas de acceso a pedidos, mesas y personal
├── manifest.json               # Manifiesto PWA para instalación en pantalla de inicio iOS/Android
├── local-server.js             # Servidor local Node.js de alta velocidad (puerto 3000)
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
