import { useParams } from "react-router-dom"

export function ImageDetails({ isLoading, fetchedImages }) {
  // The :imageId param from the route
  const { imageId } = useParams()

  if (isLoading) {
    return <>Loading...</>
  }

  // Find the image with the matching ID
  const imageData = fetchedImages.find(img => img.id === imageId)
  if (!imageData) {
    return <h2>Image not found</h2>
  }

  return (
    <>
      <h2>{imageData.name}</h2>
      <img className="ImageDetails-img" src={imageData.src} alt={imageData.name} />
    </>
  )
}
