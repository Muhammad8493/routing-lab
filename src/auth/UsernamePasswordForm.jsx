import { useState } from "react";

export function UsernamePasswordForm({ onSubmit }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent full page reload
        setError(null);
        setIsLoading(true);

        if (!username || !password) {
            setError("Please fill in your username and password.");
            setIsLoading(false);
            return;
        }

        const result = await onSubmit(username, password);
        if (result?.error) {
            setError(result.error);
        }

        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                />
            </label>

            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
            </label>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Submit"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
