# Astralis - FrontEnd

## 1️⃣ Descripción del Proyecto

### 📢 Contexto
En la era digital, las redes sociales han revolucionado la forma en que las personas se comunican e interactúan. **Astralis** es una plataforma que permite a los usuarios compartir pensamientos, interactuar con otros y mantenerse conectados de una manera dinámica e intuitiva.

Este proyecto consiste en desarrollar una red social donde los usuarios puedan:
- Crear publicaciones con texto e imágenes (a través de enlaces).
- Comentar en publicaciones de otros.
- Reaccionar a publicaciones.
- Seguir a otros usuarios.
- Recibir notificaciones sobre interacciones relevantes.

El backend está desarrollado con **Spring Boot**, utilizando **PostgreSQL** como base de datos, **JWT** para autenticación y **React** para frontend .

---

## 2️⃣ Requerimientos del Proyecto

### 📌 Requerimientos Funcionales

#### 1️⃣ Gestión de Usuarios
- Registro de usuario con:
  - Nombre completo.
  - Nombre de usuario único.
  - Número de celular.
  - Correo electrónico único.
  - Fecha de nacimiento (se validan mínimos 14 años de edad).
  - Contraseña segura (8-12 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo especial).
- Autenticación segura con JWT.
- Cifrado de contraseñas con BCrypt.
- Edición de perfil (nombre, biografía, foto de perfil mediante URL, número de celular).

--- 

![Imagen de Gestión de Usuarios](/public/LoginReadme.png)
---
**Contraseñas guardadas en la base de datos**

![Imagen de Gestión de Usuarios](/public/PasswordsDB.png)

**Edicion de perfil**
![Imagen de Gestión de Usuarios](/public/EditProfile.png)



#### 2️⃣ Publicaciones
- Creación de publicaciones con:
  - Texto obligatorio (5-500 caracteres).
  - Imagen opcional (URL).
  - Tags personalizables (#Ejemplo).

![Imagen de Gestión de Usuarios](/public/CreatePost.png)


- Edición y eliminación de publicaciones por el autor.

![Imagen de Gestión de Usuarios](/public/EditPost.png)


- Ordenamiento de publicaciones:
  - Cronológico.
  - Por relevancia (según interacciones).

![Ejemplo de imagen](/public/HomePosts.png)

#### 3️⃣ Interacciones
- Comentarios en publicaciones (máximo 200 caracteres).
- Etiquetado de usuarios (@usuario).
- Reacciones a publicaciones (“Me gusta” con opción de quitarlo).
- Resumen de interacciones en cada publicación:
  - Total de reacciones.
  - Total de comentarios.

![Imagen de Interacciones](/public/Mentions.png)

**Informacion de posts**
![Imagen de Interacciones](/public/InformationPost.png)

#### 4️⃣ Seguimiento de Usuarios
- Seguir/dejar de seguir a otros usuarios.
- Sección de inicio con publicaciones de usuarios seguidos.
- Listado de seguidores y seguidos.

![Imagen de Seguimiento de Usuarios](/public/FollowUnfollow.png)
![Imagen de Seguimiento de Usuarios](/public/Follows.png)

#### 5️⃣ Notificaciones
- Se notificará cuando:
  - Se reciba un comentario en una publicación.
  - Se reciba un “Me gusta”.
  - Se sea etiquetado en una publicación.
  - Se obtenga un nuevo seguidor.

![Imagen de Notificaciones](/public/Notification.png)

---

## 3️⃣ Tecnologías Utilizadas

### 📌 Backend
- **Spring Boot con Java 17**
- **Spring Data JPA con Hibernate**
- **PostgreSQL**
- **Spring Security con JWT**
- **Swagger** (para documentar la API)
- **Arquitectura modular** (DTOs, Services, Entities, Controllers)

### 📌 Seguridad y Validaciones
- Validación de edad (solo mayores de 14 años pueden registrarse).
- Verificación de URLs en imágenes para evitar contenido malicioso.

---

## 4️⃣ Instalación y Configuración

### 📌 Requisitos Previos
- Tener **Java 17** instalado.
- Tener **Maven** instalado.
- Tener una base de datos **PostgreSQL** configurada.

### 📌 Pasos de Instalación
1. Clonar el repositorio del backend:
🔗 [Enlace al repositorio del backend](https://github.com/JoseDanielCM/socialapp)
2. Crear la base de datos en postgreSQL `astralis`.
3. Configurar el usuario y la contraseña de la base de datos en el archivo `application.properties`

Abre el archivo `application.properties` y ajusta los siguientes parámetros según tus necesidades:

- **Usuario (user)**: `postgres`
- **Contraseña (password)**: `campus2023`

Por defecto, los valores son los siguientes:
```properties
spring.datasource.username=postgres
spring.datasource.password=campus2023
```

3. Ejecutar el spring boot:
4. Ejecutar el siguiente codigo sql:

```sql
-- Inserts
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- TRIGGERS


CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (created_at, is_read, notification_type, reference_id, user_id)
  VALUES (NOW(), false, 'FOLLOW', NEW.id, NEW.followed_user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_follow_notification
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION create_follow_notification();

CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
DECLARE 
  post_author_id INT;
BEGIN
  SELECT user_id INTO post_author_id 
  FROM posts 
  WHERE id = NEW.post_id;


  IF post_author_id IS NOT NULL AND post_author_id != NEW.user_id THEN
    INSERT INTO notifications (created_at, is_read, notification_type, reference_id, user_id)
    VALUES (NOW(), false, 'LIKE', NEW.id, post_author_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_like_notification
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION create_like_notification();

CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE 
  post_author_id INT;
BEGIN
  SELECT user_id INTO post_author_id 
  FROM posts 
  WHERE id = NEW.post_id;


  IF post_author_id IS NOT NULL AND post_author_id != NEW.user_id THEN
    INSERT INTO notifications (created_at, is_read, notification_type, reference_id, user_id)
    VALUES (NOW(), false, 'COMMENT', NEW.id, post_author_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_comment_notification
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION create_comment_notification();
```
5. Clonar el repositorio del frontend:
    El código del frontend desarrollado con **React** se encuentra en el siguiente repositorio:
🔗 [Enlace al repositorio del frontend](https://github.com/JoseDanielCM/front_social_media)

6. En el proyecto frontend, ejecutar el siguiente comando:
```sh
npm install
```

7. Ejecutar el frontend:
Para iniciar el frontend, utiliza el siguiente comando:
```sh
npm run dev
```

8. Iniciar sesión:
Puedes iniciar sesión con alguno de los usuarios predefinidos en la base de datos. Ejemplo:

    Username: lilith

    Password: Sun$et18

Alternativamente, puedes crear tu propio usuario utilizando la opción de registro.

---

## 5️⃣ Documentación de la API
Para visualizar la documentación de la API en PDF:  
- [Abrir documentación en PDF](documentacion.pdf)


---

## 6️⃣ Entrega del Proyecto
Este repositorio incluirá:
- Código fuente completo.
- Documentación de la API con Swagger.
- Diagrama de base de datos (Modelo Entidad-Relación).
![Imagen de Notificaciones](/public/Notification.png)
- Video demostrativo de la aplicación.
🔗 [Enlace al video explicativo de la aplicacion](https://github.com/JoseDanielCM/front_social_media)
---

## 7️⃣ Video Demostrativo
El video muestra:
- Registro e inicio de sesión.
- Creación, edición y eliminación de publicaciones.
- Interacciones (comentarios, likes y etiquetado).
- Modo oscuro y claro con persistencia.
- Notificaciones y sistema de seguimiento.
---

¡Gracias por tu interés en **Astralis**! 🚀

