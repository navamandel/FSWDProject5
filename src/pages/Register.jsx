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
        const { username, password, confirmpassword } = formData;

        if (!username || !password || !confirmpassword) {
            alert("Please fill in all fields");
            return;
        }

        if (password !== confirmpassword) {
            alert("Passwords must match");
            return;
        }

       const result = await register({ username, password });

        if (!result || typeof result.success === 'undefined') {
            console.error("Register function returned:", result);
            alert("An unexpected error occurred. Please try again.");
            return;
        }

        if (result.success) {
            nav('/completeprofile');
        } else {
            alert("Please choose a different username");
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
                 handleSubmitData={handleSubmit}
                 buttonText="Complete Registration"
            />
        </>
    );
}