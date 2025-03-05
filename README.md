# 📌 SmartySub [Link](https://smartysub.vercel.app/)

## 📝 Descripción
SmartySub es una aplicación diseñada para ayudar a los usuarios a gestionar sus suscripciones de manera eficiente. Con el aumento de los servicios por suscripción, es común perder el control de los pagos recurrentes, lo que lleva a gastos innecesarios. SmartySub proporciona una solución simple y organizada para visualizar, administrar y optimizar los gastos en suscripciones.

## 🎯 Objetivo
El propósito principal de SmartySub es brindar una herramienta intuitiva y accesible que permita a los usuarios:
- Controlar sus suscripciones de manera centralizada.
- Recibir alertas por email antes de que una suscripción se renueve automáticamente.
- Analizar los gastos en suscripciones y tomar decisiones informadas.
- Identificar suscripciones innecesarias y optimizar su presupuesto.

## 👥 Público Objetivo
SmartySub está diseñado para:
- Personas jóvenes y adultos que manejan múltiples suscripciones.
- Usuarios que buscan una herramienta fácil de usar y con buen diseño UX/UI.
- Creadores de contenido, freelancers y emprendedores que necesitan un control financiero detallado.

## 🔥 Características Clave
✅ Agrega y visualiza todas tus suscripciones en un solo lugar.  
✅ Recibe recordatorios antes de la renovación automática.  
✅ Analiza tus gastos.  
✅ Opciones de personalización para cada suscripción.  
✅ Plan gratuito y opciones premium con beneficios adicionales.  

Para probar el premium agrego un usuario con el premium activado:
    🫂  mail: premium@premium.com
    ✳️  pwd:   premium

Para probar la app, sirve con un simple registro

## 🛠️ Stack Tecnológico
- **Frontend:** React, TailwindCSS, ShadCN
- **Backend:** Node.js, Express, MongoDB
- **Infraestructura:** Vercel
- **Autenticación:** JWT
- **Librerias Extra:** Nodemailer, Lucide, React Icons, Node-Cron

## 🚀 Roadmap del Proyecto
📌 **Fase 1:** MVP con funcionalidades básicas de gestión de suscripciones.  
📌 **Fase 2:** Implementación de notificaciones y estadísticas avanzadas.  
📌 **Fase 3:** Integración con pasarelas de pago y lanzamiento en plataformas oficiales.

## 🏁 Conclusión
SmartySub nace de la necesidad de mejorar la organización financiera en un mundo saturado de suscripciones. Con una interfaz moderna y funcionalidades clave, busca convertirse en la herramienta de referencia para quienes desean tener el control total de sus gastos recurrentes.


# 📌 API Documentation - SmartySub

## 🌍 Base URL
Todas las rutas de la API están prefijadas con:
```sh
/api/v1/
```

---

## 🧑‍💻 User Routes (`/api/v1/users`)

### 🔹 Obtener lista de monedas disponibles
```http
GET /api/v1/users/currencies
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Retorna la lista de monedas admitidas en la plataforma.

### 🔹 Obtener perfil del usuario
```http
GET /api/v1/users/
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Retorna la información del usuario autenticado.

### 🔹 Registro de usuario
```http
POST /api/v1/users/register
```
📌 **Descripción:** Crea una nueva cuenta de usuario.

📝 **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

### 🔹 Inicio de sesión
```http
POST /api/v1/users/login
```
📌 **Descripción:** Inicia sesión y retorna un token JWT.

📝 **Body (JSON):**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

### 🔹 Establecer moneda del usuario
```http
PUT /api/v1/users/setCurrency
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Permite a un usuario establecer su moneda preferida.

📝 **Body (JSON):**
```json
{
  "currency": "USD"
}
```

---

## 🔔 Subscription Routes (`/api/v1/subscriptions`)

### 🔹 Crear una nueva suscripción
```http
POST /api/v1/subscriptions/
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Crea una nueva suscripción asociada al usuario.

📝 **Body (JSON):**
```json
{
  "name": "Netflix",
  "cost": 15.99,
  "startDate": "2024-03-01",
  "renewalFrequency": "monthly",
  "category": "Entertainment",
  "notes": "Plan premium",
  "reminderSettings": {
    "isActive": true,
    "daysBefore": 3
  }
}
```

### 🔹 Obtener todas las suscripciones del usuario
```http
GET /api/v1/subscriptions/
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Retorna todas las suscripciones activas del usuario autenticado.

### 🔹 Obtener estadísticas de suscripciones
```http
GET /api/v1/subscriptions/stats
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Devuelve estadísticas generales sobre las suscripciones del usuario.

### 🔹 Obtener una suscripción por ID
```http
GET /api/v1/subscriptions/:subscriptionId
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Obtiene los detalles de una suscripción específica.

### 🔹 Actualizar una suscripción
```http
PUT /api/v1/subscriptions/:subscriptionId
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Modifica una suscripción existente.

📝 **Body (JSON):**
```json
{
  "name": "Spotify Premium",
  "cost": 9.99,
  "renewalFrequency": "monthly",
  "category": "Music",
  "notes": "Plan individual"
}
```

### 🔹 Configurar recordatorios de suscripción
```http
PUT /api/v1/subscriptions/:subscriptionId/reminders
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Permite modificar la configuración de recordatorios de una suscripción.

📝 **Body (JSON):**
```json
{
  "reminderSettings": {
    "isActive": true,
    "daysBefore": 5
  }
}
```

### 🔹 Eliminar una suscripción
```http
DELETE /api/v1/subscriptions/:subscriptionId
```
🔒 **Auth requerida:** Sí (JWT)

📌 **Descripción:** Elimina una suscripción específica.

---

## 🆕 Default Subscriptions (`/api/v1/defaultSubs`)

### 🔹 Obtener suscripciones predeterminadas
```http
GET /api/v1/defaultSubs/
```
📌 **Descripción:** Obtiene una lista de suscripciones predeterminadas que pueden agregarse fácilmente a la cuenta del usuario.

### 🔹 Agregar una nueva suscripción predeterminada
```http
POST /api/v1/defaultSubs/
```
📌 **Descripción:** Agrega una nueva suscripción predeterminada al sistema.

📝 **Body (JSON):**
```json
{
  "name": "Amazon Prime",
  "cost": 12.99,
  "category": "Entertainment"
}
```

---

## 🔑 **Autenticación y Seguridad**
- Todas las rutas protegidas requieren un **token JWT** en el encabezado de la solicitud.
- Formato del token en las solicitudes:

```http
Authorization: Bearer <tu_token_aquí>
```

---

## 📌 **Notas Finales**
- Esta API está diseñada para **gestionar suscripciones de usuarios** de manera eficiente.
- El sistema permite **suscripciones personalizadas y predeterminadas**.
- Se recomienda **usar tokens JWT** para asegurar las solicitudes.


**En services.csv tenemos la default subs que se agregaron mediante el fs que se encuentra en utils** 🚀
