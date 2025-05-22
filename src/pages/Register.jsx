// Form -> username, password, verify password
// On submit -> check if username exsits
// If not go to CompleteProfile.jsx
import Form from '../components/Form.jsx'
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const { register } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (formData) => {
        if (formData.password != formData.confirmpassword) {
            alert("Passwords must match");
        } else {
            const { success } = await register(formData);
            success ? nav('/completeprofile') : alert("Please choose a different username");
        }
    };
    
    return (
        <>
            <Form 
                title="Register"
                inputs={[
                    { 
                        label: "Username", 
                        type: "text", 
                        name: "username", 
                        placeholder: "Choose Username"
                    },
                    {
                        label: "Password", 
                        type: "password", 
                        name: "password", 
                        placeholder: "Choose Password"
                    },
                    {
                        label: "Confirm Password", 
                        type: "password", 
                        name: "confirmpassword", 
                        placeholder: "Confirm Password"
                    }
                ]}
                handleSubmitData={(formData) => handleSubmit(formData)}
                buttonText="Complete Registration"
            />
        </>
    );
}