import { Routes, Route } from 'react-router-dom';
import Login from '../Components/Login';
import Register from '../Components/Register';
// Optionally import Home if you want to include it
// import Home from './Home'; 

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />  {/* Home route or Login */}
			<Route path="/login" element={<Login />} />  {/* Login route */}
			<Route path="/register" element={<Register />} />  {/* Register route */}
		</Routes>
	);
}
