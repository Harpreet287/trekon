import React from "react";
import Navbar from "../components/Navbar.jsx";
import {AuthData} from "../auth/AuthWrapper.jsx";

function Habits(){
    const {user} = AuthData();
    return(
    <div>
        <h1>Habits Page of {user.email}</h1>
    </div>
);
}
export default Habits;