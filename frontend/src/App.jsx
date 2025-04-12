import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar.jsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Habits from "./pages/Habits.jsx";
import {AuthWrapper} from "./auth/AuthWrapper.jsx";

function App(){
    return (
    <div className="App">
        <BrowserRouter>
            <AuthWrapper/>
        </BrowserRouter>
    </div>
    )
}

export default App;
