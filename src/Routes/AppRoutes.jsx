import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";

import Login from '../Components/Login';
import Register from '../Components/Register';
import Navbar from '../Layouts/NavBar';

import Home from '../Pages/Main/Home';
import Notification from '../Pages/Notification';
import CreatePost from '../Pages/Main/CreatePost';
import Profile from '../Pages/Main/Profile';
import Search from "../Pages/Main/Search";
import EditProfile from '../Pages/Profile/EditProfile';
import Follows from '../Pages/Follow/Follows';
import Followers from '../Pages/Follow/Followers';
import ViewProfile from '../Pages/Profile/ViewProfile';

import { useTheme } from '../Util/ThemeContext';

import NotificationComponent from '../Components/NotificationComponent'; // Asegúrate de que la ruta sea correcta

export default function AppRoutes() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  const { theme } = useTheme();

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          {/* NotificationComponent se muestra en todas las rutas protegidas */}
          <Route
            path="/*"
            element={
              <>
                <NotificationComponent /> {/* Este es el lugar donde aparece */}
                <Routes>
                  <Route path="/" element={<Home theme={theme} />} />
                  <Route path="/home" element={<Home theme={theme} />} />
                  <Route path="/notification" element={<Notification  theme={theme} />} />
                  <Route path="/post" element={<CreatePost theme={theme} />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/search" element={<Search theme={theme} />} />
                  <Route path="/edit-profile" element={<EditProfile theme={theme} />} />
                  <Route path="/followers" element={<Followers theme={theme} />} />
                  <Route path="/follows" element={<Follows theme={theme} />} />
                  <Route path="/view-profile/:user_id" element={<ViewProfile theme={theme} />} />
                </Routes>
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
