// Form component to handle login, register, etc

import { useState } from "react";

// Template for all forms, so form login only has to be handled once
// title: type of form, text to display at the top
// inputs: input fields which include: label, type, name, placeholder
// handleSubmit function from the parent component
// buttonText: text to display on the submit button
export default function Form({ title, inputs, handleSubmitData, buttonText }) {

    const [formData, setFormData] = useState({})

    function handleChange(e) {
        e.preventDefault();

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleSubmitData({...formData});
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <h3>{title}</h3>
            {inputs.map(({ label, type, name, placeholder }) => (
                <section key={name}>
                    <label>{label}</label>
                    <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        onChange={(e) => handleChange(e)}
                    />
                </section>
            ))}
            <button type="submit">{buttonText}</button>
        </form>
    );
}