import {AuthData} from "../auth/AuthWrapper.jsx";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import nav from "./structure/navigation.jsx";
import { Dumbbell } from "lucide-react";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Workout from "../pages/Workout.jsx";
import UserProfile from "../pages/UserProfile.jsx";
import Habits from "../pages/Habits.jsx";
import Register from "../pages/Register.jsx";
import AiDoctorPage from "../pages/AiDoctorPage.jsx";

function RenderMenu(){
    const {user, logout} = AuthData();
    const location = useLocation();
    
    // Helper function to determine if a path is active
    const isActiveRoute = (path) => {
        return location.pathname === path;
    };
    
    return (
        <div className="nav-container">
            <div className="nav-inner">
                <div className="brand-container">
                    <Dumbbell className="brand-icon" />
                    <Link to="/" className="nav-brand">
                        Trekon
                    </Link>
                </div>
                
                <div className="nav-menu">
                    {user.isAuthenticated ? (
                        <>
                            {/* Display menu items for authenticated users except AI Doctor and Profile */}
                            {nav.map((r, i) => {
                                if (r.isPrivate && r.isMenu && r.path !== "/ai" && r.path !== "/profile") {
                                    return (
                                        <div key={i} className="nav-item">
                                            <Link 
                                                to={r.path} 
                                                className={`nav-link ${isActiveRoute(r.path) ? 'active' : ''}`}
                                            >
                                                {r.name}
                                            </Link>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            
                            {/* AI Doctor link */}
                            <div className="nav-item">
                                <Link 
                                    to="/ai" 
                                    className={`nav-link ${isActiveRoute('/ai') ? 'active' : ''}`}
                                >
                                    AI Doctor
                                </Link>
                            </div>
                            
                            {/* Profile link - after AI Doctor */}
                            <div className="nav-item">
                                <Link 
                                    to="/profile" 
                                    className={`nav-link ${isActiveRoute('/profile') ? 'active' : ''}`}
                                >
                                    Profile
                                </Link>
                            </div>
                            
                            
                            {/* Logout button */}
                            <button 
                                onClick={logout} 
                                className="logout-btn"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Login and Register for non-authenticated users */}
                            <div className="nav-item">
                                <Link 
                                    to="/login" 
                                    className={`nav-link ${isActiveRoute('/login') ? 'active' : ''}`}
                                >
                                    Login
                                </Link>
                            </div>
                            
                            
                            <div className="nav-item">
                                <Link 
                                    to="/register" 
                                    className={`nav-link ${isActiveRoute('/register') ? 'active' : ''}`}
                                >
                                    Register
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
export {RenderMenu};

const getComponent = (elementName) => {
    switch(elementName) {
        case "Home": return <Home />;
        case "Login": return <Login />;
        case "Habits": return <Habits />;
        case "Workout": return <Workout />;
        case "UserProfile": return <UserProfile />;
        case "Register": return <Register />;
        case "AiDoctorPage": return <AiDoctorPage />;
        default: return <Home />;
    }
};

function RenderRoutes(){
    const {user} = AuthData();
    console.log("RENDER ROUTES "+user.isAuthenticated);
    
    return (
        <div className="content-container">
            <Routes>
            {nav.map((r, i)=>{
                if(r.isPrivate && user.isAuthenticated){
                    return <Route key={i} path={r.path} element = {getComponent(r.element)}/>
                }
                else if(!r.isPrivate){
                    return <Route key={i} path = {r.path} element = {getComponent(r.element)}/>
                }
                else{
                    return false;
                }
                }
            )}
            </Routes>
        </div>
    )
}
export {RenderRoutes};