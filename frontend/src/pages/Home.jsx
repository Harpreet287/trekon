import React from 'react'
import Navbar from "../components/Navbar.jsx";
import {AuthData} from "../auth/AuthWrapper.jsx";

function Home(){
    const {user} = AuthData();
    return (
        <div>
            <h1>Home of {user.email}</h1>
        </div>
    );
}
export default Home;