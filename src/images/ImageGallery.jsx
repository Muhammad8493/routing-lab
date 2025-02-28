import "./ImageGallery.css"
import { Link } from "react-router-dom"

export function ImageGallery({ isLoading, fetchedImages }) {
  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <>
      <h2>Image Gallery</h2>
      <div className="ImageGallery">
        {fetchedImages.map(image => (
          <div key={image.id} className="ImageGallery-photo-container">
            {/* Use <Link> so it doesn't reload the page */}
            <Link to={`/images/${image.id}`}>
              <img src={image.src} alt={image.name} />
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
