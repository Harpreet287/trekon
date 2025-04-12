import React from "react";
import {AuthData} from "../auth/AuthWrapper.jsx";
function About(){
    const {user} = AuthData();

    return(
        <div>
            <h1>Hi this is About page of the user {user.email}</h1>
        </div>
    );
}
export default About;