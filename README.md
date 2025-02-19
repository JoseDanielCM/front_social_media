# Astralis - FrontEnd

## 1️⃣ Description of the project

### 📢 Context
In the digital age, social networks have revolutionized the way people communicate and interact. **Astralis** is a platform that allows users to share thoughts, interact with others, and stay connected in a dynamic and intuitive way.

This project involves developing a social network where users can:
- Create posts with text and images (via links).
- Comment on other users' posts.
- React to posts.
- Follow other users.
- Receive notifications about relevant interactions.

The backend is developed with **Spring Boot**, using **PostgreSQL** as the database, **JWT** for authentication, and **React** for the frontend.

---

![Base de datos](/public/DataBase.png)

## 2️⃣ Project Requirements

### 📌 Functional Requirements

#### 1️⃣ User Management
- User registration with:
  - Full name.
  - Unique username.
  - Phone number.
  - Unique email.
  - Date of birth (minimum age of 14 years is validated).
  - Secure password (8-12 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character).
- Secure authentication with JWT.
- Password encryption with BCrypt.
- Profile editing (name, bio, profile picture via URL, phone number).

--- 

![Imagen de Gestión de Usuarios](/public/LoginReadme.png)
---
**Passwords stored in the database**

![Imagen de Gestión de Usuarios](/public/PasswordsDB.png)

**Profile Editing**
![Imagen de Gestión de Usuarios](/public/EditProfile.png)


#### 2️⃣ Posts
- Creating posts with:
  - Required text (5-500 characters).
  - Optional image (URL).
  - Customizable tags (#Example).

![Imagen de Gestión de Usuarios](/public/CreatePost.png)


- Editing and deleting posts by the author.

![Imagen de Gestión de Usuarios](/public/EditPost.png)


- Sorting posts:
  - Chronologically.
  - By relevance (based on interactions).

![Ejemplo de imagen](/public/HomePosts.png)

#### 3️⃣ Interactions
- Comments on posts (maximum 200 characters).
- User tagging (@user).
- Reactions to posts ("Like" with the option to remove it).
- Summary of interactions on each post:
  - Total reactions.
  - Total comments.

![Imagen de Interacciones](/public/Mentions.png)

**Post Information**

![Imagen de Interacciones](/public/InformationPost.png)

#### 4️⃣ User Following
- Follow/unfollow other users.
- Home section with posts from followed users.
- List of followers and following.

![Imagen de Seguimiento de Usuarios](/public/FollowUnfollow.png)
![Imagen de Seguimiento de Usuarios](/public/Follows.png)

#### 5️⃣ Notifications
- Notifications will be sent when:
  - A comment is received on a post.
  - A "Like" is received.
  - A user is tagged in a post.
  - A new follower is gained.

![Imagen de Notificaciones](/public/Notification.png)

---

## 3️⃣ Technologies Used

### 📌 Backend
- **Spring Boot with Java 17**
- **Spring Data JPA with Hibernate**
- **PostgreSQL**
- **Spring Security with JWT**
- **Swagger** (for API documentation)
- **Modular Architecture** (DTOs, Services, Entities, Controllers)

### 📌 Security and Validations
- Age validation (only users over 14 years old can register).
- URL verification in images to prevent malicious content.

---

## 4️⃣ Installation and Setup

### 📌 Prerequisites
- Have **Java 17** installed.
- Have **Maven** installed.
- Have a **PostgreSQL** database configured.

### 📌 Installation Steps
1. Clone the backend repository:
🔗 [Backend Repository Link](https://github.com/JoseDanielCM/socialapp)
2. Create the database in PostgreSQL named `astralis`.
3. Configure the database user and password in the `application.properties` file.

Open the `application.properties` file and adjust the following parameters as needed:

- **User (username)**: `postgres`
- **Password (password)**: `campus2023`

By default, the values are:
```properties
spring.datasource.username=postgres
spring.datasource.password=campus2023
```

4. Run the Spring Boot application.
5. Execute the following SQL script to set up notifications and insert test data.

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
6. Clone the frontend repository:
    The frontend code developed with **React** is available in the following repository:
🔗 [Frontend Repository Link](https://github.com/JoseDanielCM/front_social_media)

7. In the frontend project, run the following command:
```sh
npm install
```

8. Run the frontend:
To start the frontend, use the following command:
```sh
npm run dev
```

9. Log in:
You can log in with one of the predefined users in the database. Example:

    Username: Lilith

    Password: Sun$et18

Alternatively, you can create your own user using the registration option.
---


## 5️⃣ API Documentation
To view the API documentation in PDF:
- [Open API Documentation PDF](/public/ApiDocumentation.pdf)

---

## 6️⃣ Project Submission
This repository includes:
- Complete source code.
- API documentation with Swagger.
- Database diagram (Entity-Relationship Model).
![Notifications Image](/public/Notification.png)
- Demonstration video of the application.
🔗 [Application Demo Video](https://github.com/JoseDanielCM/front_social_media)
---

## 7️⃣ Demonstration Video
The video showcases:
- User registration and login.
- Creating, editing, and deleting posts.
- Interactions (comments, likes, and tagging).
- Light and dark mode with persistence.
- Notifications and follow system.
---
🔗 [Enlace a video](https://drive.google.com/drive/folders/1cWJ4MmkDo_sUpR_IyPlAG3hdH6vboo5F?usp=sharing)

Thank you for your interest in **Astralis**! 🚀

