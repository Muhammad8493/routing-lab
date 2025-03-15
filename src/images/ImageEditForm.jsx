import { useState } from "react";

export function ImageEditForm({ onImageUpdate, authToken }) {
    const [imageId, setImageId] = useState("");
    const [imageName, setImageName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        if (!imageId || !imageName) {
            setError("Please provide both Image ID and new name.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ name: imageName }),
            });

            if (response.status === 204) {
                alert("Image name updated successfully!");
                onImageUpdate(imageId, imageName);
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to update image name:", error);
            setError("Failed to update image name.");
        } finally {
            setImageId("");
            setImageName("");
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h3>Edit Image Name</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Image ID:
                    <input
                        type="text"
                        value={imageId}
                        onChange={(e) => setImageId(e.target.value)}
                        disabled={isLoading}
                    />
                </label>
                <label>
                    New Image Name:
                    <input
                        type="text"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        disabled={isLoading}
                    />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Name"}
                </button>
            </form>
        </div>
    );
}
