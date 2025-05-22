// Form -> username and password
// On submit -> fetch with API and authenticate
//  If valid store user in local storage otherwise error
//

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form.jsx'

export default function Login() {
   
    const { login } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (formData) => {
        const { success } = await login(formData);
        success ? nav('/home') : alert("Incorrect username or password");
    };

    return (
        <>
            <Form 
                title="Log In"
                inputs={[
                    { 
                        label: "Username", 
                        type: "text", 
                        name: "username", 
                        placeholder: "Enter Your Username"
                    },
                    {
                        label: "Password", 
                        type: "password", 
                        name: "password", 
                        placeholder: "Enter Your Password"
                    }
                ]}
                handleSubmitData={(formData) => handleSubmit(formData)}
                buttonText="Log In"
            />
            <button type="button" onClick={() => nav('/register')} >Register</button>
        </>
    );
}