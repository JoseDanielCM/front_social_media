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

![Base de datos](/public/DataBase.png)

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

INSERT INTO public.users (bio,birthdate,email,first_name,last_name,"password",phone,profile_picture,registered_at,"role",username) VALUES
	 ('No bio available...','2002-02-02','jodacarmon@gmail.com','Jose Daniel','Carvajal','$2a$10$jsHOKWupC0sodyXBwewwAeuRehCysV1IHvHTvWYkW.zwWTVIfqxrG','No phone number avaliable','https://i.pinimg.com/736x/ca/24/48/ca2448be61e1d106a8706ed3e5f30dcb.jpg','2025-02-14 14:22:02.549531','USER','danycar'),
	 ('No bio available...','1800-02-20','johan@gmail.com','Johan Sebastian','Ruiz Angarita','$2a$10$LgB3eYjNAq6oKYauH1WJg.fBy6AOqfGPv4FRRxbCmilly8/kHXP1y','No phone number avaliable','https://cdna.artstation.com/p/assets/images/images/015/423/152/medium/dominik-koscinski-closeupfront.jpg?1548270414','2025-02-14 17:25:30.153284','USER','johan'),
	 ('No bio available...','2000-02-24','laura@gmail.com','laura','laura','$2a$10$xP2I60yGLEJPfRr5qGgADe.xed7/FKeJ/5Ly/g3XQSmfas1l6rSUa','No phone number avaliable','https://i.pinimg.com/736x/74/2c/70/742c70a8e0708cdb228748ca4921e301.jpg','2025-02-14 14:43:56.816528','USER','laura'),
	 ('In the howl house','2000-02-24','lilith@gmail.com','Lilith','Mairi','$2a$10$ojZuyVRysowqaLegVzMTzOSwZfeFCdQfDgDdo.Izgfm5YsPlWiHZq','No phone number avaliable','https://i.pinimg.com/736x/4f/9f/3b/4f9f3b2be7b1dbbc4d6ee270be65cd86.jpg','2025-02-18 16:25:40.965359','USER','Lilith'),
	 ('Gamer... 💚','2000-02-24','juan@gmail.com','Juan Jose','Torres Becerra','$2a$10$Tgn7EIYOJsgmxuoWuxNUoempmaiP4E7iayDd1w7OtLXe6FF4vId0O','3153416598','https://i.pinimg.com/236x/d0/81/1a/d0811ae6d7f05db9a219c252d277c193.jpg','2025-02-14 14:22:31.435032','USER','juan');

   INSERT INTO public.tags (name) VALUES
	 ('disney'),
	 ('series'),
	 ('animation'),
	 ('spiderman'),
	 ('multiverse'),
	 ('movies'),
	 ('dreamworks'),
	 ('movie'),
	 ('cinema'),
	 ('filmLovers');
INSERT INTO public.tags (name) VALUES
	 ('hobbies'),
	 ('VideoGames'),
	 ('gamer'),
	 ('platformer'),
	 ('RPG'),
	 ('turn-based-battle-system'),
	 ('Difficulty'),
	 ('ARPG');

   INSERT INTO public.posts ("content",created_at,img_url,title,updated_at,user_id) VALUES
	 ('an American animated fantasy television series ','2025-02-18 16:33:08.036527','https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/978AB840710181C646FBAB5CFA8FEBDA198FB889409984264B5072CA5C810E78/scale?width=1200&aspectRatio=1.78&format=webp','Welcome to the owl house',NULL,4),
	 ('a dimension-hopping story in which different versions of Spider-Man from different universes are forced to team up to battle a common threat.','2025-02-18 16:39:00.389109','https://images.cdn1.buscalibre.com/fit-in/360x360/64/29/642967099924cfc31a41277ac8270995.jpg','Spiderman into the spiderverse',NULL,4),
	 ('The film follows Roz (Nyong''o), a service robot shipwrecked on an uninhabited island who must adapt to its surroundings,','2025-02-18 16:42:20.994613','https://deadline.com/wp-content/uploads/2024/11/Roz-and-Brightbill-Painting.jpg','Wild robot',NULL,4),
	 ('How often do you guys watch movies?','2025-02-18 16:44:17.658833','','Cinephiles Assemble!',NULL,4),
	 ('An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs.','2025-02-18 16:57:06.135555','https://store-images.s-microsoft.com/image/apps.24270.13847644057609868.a4a91f76-8d1c-4e19-aa78-f4d27d2818fb.d96146d7-d00a-4db9-ad68-197b2f962a17?q=90&w=480&h=270','Hollow Knight',NULL,5),
	 ('Is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal.','2025-02-18 17:04:21.902408','https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2023/08/opinion-baldurs-gate-3-pc-3101716.jpg?tf=3840x','Baldurs Gate 3',NULL,5),
	 ('Dark Souls is a dark fantasy action role-playing game series developed by FromSoftware and published by Bandai Namco Entertainment.','2025-02-18 17:06:32.110528','https://img.redbull.com/images/c_fill,g_auto,w_1200,h_630/f_auto,q_auto/redbullcom/2014/04/22/1331646783043_2/dark-souls','Dark Souls',NULL,5);

INSERT INTO public."comments" ("content",created_at,updated_at,user_id,post_id) VALUES
	 ('@johan @danycar @laura','2025-02-18 16:34:16.128838',NULL,5,1),
	 ('I usually watch one per week @juan and you','2025-02-18 16:45:57.651898',NULL,4,4),
	 ('If the movie were about ur life, every single day bitch','2025-02-18 16:51:42.485782',NULL,5,4);


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
- [Abrir documentación en PDF](/public/ApiDocumentation.pdf)


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
🔗 [Enlace a video](https://drive.google.com/drive/folders/1cWJ4MmkDo_sUpR_IyPlAG3hdH6vboo5F?usp=sharing)

¡Gracias por tu interés en **Astralis**! 🚀

