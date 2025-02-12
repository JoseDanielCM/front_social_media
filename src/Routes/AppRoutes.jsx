import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";

import Login from '../Components/Login';
import Register from '../Components/Register';
import Navbar from '../Layouts/NavBar';

import Home from '../Pages/Home';
import Notification from '../Pages/Notification';
import Post from '../Pages/Post';
import Profile from '../Pages/Profile';

export default function AppRoutes() {
	const location = useLocation();
	const hideNavbarRoutes = ["/", "/login", "/register"];
	const showNavbar = ! hideNavbarRoutes.includes(location.pathname);

	return (
		<>
			{showNavbar && <Navbar />}
			<Routes>
				<Route path="/" element={<Login />} />  
				<Route path="/login" element={<Login />} />  
				<Route path="/register" element={<Register />} />  

				{/* Rutas protegidas */}
				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<Home />} />  
					<Route path="/notification" element={<Notification />} />  
					<Route path="/post" element={<Post />} />  
					<Route path="/profile" element={<Profile />} />  
				</Route>
			</Routes>
		</>
	);
}
