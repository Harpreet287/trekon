import {AuthData} from "../auth/AuthWrapper.jsx";
import {Link, Route, Routes} from "react-router-dom";
import nav from "./structure/navigation.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Workout from "../pages/Workout.jsx";
import About from "../pages/About.jsx";
import Habits from "../pages/Habits.jsx";
import Register from "../pages/Register.jsx";

function RenderMenu(){
    const {user, logout} = AuthData();
    const MenuItem = ({r})=>{
        return (
            <div className="menuItem">
                <Link to={r.path}>
                    {r.name}
                </Link>
            </div>
        )
        }
        return (
            <div className="menu">
                {nav.map((r, i)=>{
                    if(!r.isPrivate && r.isMenu){
                        return (<MenuItem key={i} r={r}>
                        </MenuItem>)
                    }
                    else if(user.isAuthenticated && r.isMenu){
                        return (
                            <MenuItem key={i} r = {r}/>
                        )
                    }
                    else return false;
                    }
                )}
                {
                    user.isAuthenticated?
                        <div className="menuItem" ><Link onClick={logout} to={'#'}>log out</Link></div>
                        :
                        <div className = "menuItem"><Link to={'login'}>log in</Link> </div>
                }
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
        case "About": return <About />;
        case "Register": return <Register />;
        default: return <Home />;
    }
};

function RenderRoutes(){

    const {user} = AuthData();
    console.log("RENDER ROUTES "+user.isAuthenticated);
    return (
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
    )
}
export {RenderRoutes};