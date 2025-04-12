import {createContext, useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar.jsx";
import {RenderMenu, RenderRoutes} from "../components/RenderNavigation.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

function AuthData (){
    return useContext(AuthContext);
}
export {AuthData};
let userstruct = {
    email:"nouser@gmail.com"
}
function AuthWrapper(){
    const navigate = useNavigate();

    const [user, setUser] = useState(userstruct);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser({ ...storedUser, isAuthenticated: true });
        }

    }, []);

    useEffect(() => {
        console.log("Updated user:", user);
    }, [user]);
    async function login(email, password) {
        try{
            const response = await axios.post("http://localhost:8080/api/user/login", {
                email,
                password
            });
            console.log(response.data);

            const {token, user: userData} = response.data;
            console.log(userData);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            console.log(localStorage.getItem("token"));
            setUser({
                ...userData,
                isAuthenticated: true
            });

            console.log(user.isAuthenticated);
            navigate("/");
            console.log("SUCceSS");
            return "success in login";
        }
        catch (error){
            // throw new Error("Invalid email or password", error);
            throw error;
        }
    }

    function logout(){
        console.log("in log out");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser({...userstruct, isAuthenticated: false});
        console.log(user);
    }

    return (
      <AuthContext.Provider value= {{login, logout, user}}>
        <>
            <RenderMenu/>
            <RenderRoutes/>
        </>
      </AuthContext.Provider>
    );
}
export {AuthWrapper};