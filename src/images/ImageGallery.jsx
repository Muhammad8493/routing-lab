import "./ImageGallery.css";
import { Link } from "react-router-dom";
import { ImageUploadForm } from "./ImageUploadForm";

export function ImageGallery({ isLoading, fetchedImages, authToken, setFetchedImages }) {
  function handleUploadSuccess(newImage) {
    setFetchedImages((prevImages) => [...prevImages, newImage]);
  }

  return (
    <>
      <h2>Upload a New Image</h2>
      <ImageUploadForm authToken={authToken} onUploadSuccess={handleUploadSuccess} />

      <h2>Image Gallery</h2>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <div className="ImageGallery">
          {fetchedImages.map((image) => (
            <div key={image.id} className="ImageGallery-photo-container">
              {/* Use <Link> so it doesn't reload the page */}
              <Link to={`/images/${image.id}`}>
                <img src={image.src} alt={image.name} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
