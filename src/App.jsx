import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes"; 
import "./index.css"; // Importa Tailwind aquí
import {useState} from 'react'

function App() {


  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
