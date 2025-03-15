import { useState, useId } from "react";

export function ImageUploadForm({ authToken, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState("");
    const [imageName, setImageName] = useState("");
    const [error, setError] = useState("");
    const inputId = useId(); 

    function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.onerror = (err) => reject(err);
            fr.readAsDataURL(file);
        });
    }

    async function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const dataURL = await readAsDataURL(file);
            setPreviewSrc(dataURL);
        }
    }

    async function handleUpload(event) {
        event.preventDefault();
        
        if (!selectedFile) {
            setErrorMessage("Please select a file before uploading.");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("name", imageName);
    
        try {
            const authToken = localStorage.getItem("authToken"); // Retrieve token
            const response = await fetch("/api/images", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${authToken}` // Include token
                }
            });
    
            if (!response.ok) {
                throw new Error("Upload failed");
            }
    
            console.log("Image uploaded successfully");
            setSuccessMessage("Image uploaded successfully!");
            setErrorMessage(""); // Clear error message
        } catch (error) {
            console.error("Error uploading image:", error);
            setErrorMessage("Failed to upload image.");
        }
    }
    

    return (
        <form onSubmit={handleUpload}>
            <div>
                <label htmlFor={inputId}>Choose image to upload: </label>
                <input
                    id={inputId}
                    name="image"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <label>
                    <span>Image title: </span>
                    <input name="name" value={imageName} onChange={(e) => setImageName(e.target.value)} />
                </label>
            </div>
            <div>
                {previewSrc && <img style={{ maxWidth: "20em" }} src={previewSrc} alt="Preview" />}
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Confirm upload</button>
        </form>
    );
}
