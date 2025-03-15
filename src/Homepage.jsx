import { ImageEditForm } from "./images/ImageEditForm";

export function Homepage({ userName, onImageUpdate, authToken }) {
    return (
      <>
        <h2>Welcome, {userName}</h2>
        <p>This is the content of the home page.</p>
        <div>
            <h1>Image Edit Form</h1>
            <ImageEditForm onImageUpdate={onImageUpdate} authToken={authToken} />
        </div>
      </>
    );
}
