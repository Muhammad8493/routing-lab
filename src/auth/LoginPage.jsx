import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../sendPostRequest";
import { useNavigate, Link } from "react-router-dom";

export function LoginPage({ setAuthToken }) {
    const navigate = useNavigate();

    async function handleLogin(username, password) {
        const response = await sendPostRequest("/auth/login", { username, password });

        if (response.ok) {
            const { token } = await response.json();
            setAuthToken(token);  // Store token in state
            navigate("/");  // Redirect to homepage
        } else {
            return { error: "Incorrect username or password" };
        }
    }

    return (
        <>
            <h2>Login</h2>
            <UsernamePasswordForm onSubmit={handleLogin} />
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </>
    );
}
