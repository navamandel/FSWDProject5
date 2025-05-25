// Form -> username, password, verify password
// On submit -> check if username exsits
// If not go to CompleteProfile.jsx
import Form from '../components/Form.jsx'
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import '../styles/form.css'; 


const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});


export default function Register() {

    const { register } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            // Validate formData with Yup
            await registerSchema.validate(formData);

            const { username, password } = formData;
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
        } catch (error) {
            alert(error.message); // Show Yup validation error
        }
    };

    
   return (
  <div className="login-container">
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
  </div>
);
}