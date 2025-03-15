import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../sendPostRequest";
import { useNavigate } from "react-router-dom";

export function RegisterPage({ setAuthToken }) {
    const navigate = useNavigate();

    async function handleRegister(username, password) {
        const response = await sendPostRequest("/auth/register", { username, password });

        if (response.ok) {
            const { token } = await response.json();
            setAuthToken(token);  // Store token in state
            navigate("/");  // Redirect to homepage
        } else {
            return { error: "Username already taken or invalid input" };
        }
    }

    return (
        <>
            <h2>Register a New Account</h2>
            <UsernamePasswordForm onSubmit={handleRegister} />
        </>
    );
}
