import { useEffect, useState } from "react";

export function useImageFetching(authToken, imageId = "") {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);

    useEffect(() => {
        async function fetchImages() {
            setIsLoading(true);
            try {
                const url = imageId ? `/api/images?createdBy=${imageId}` : "/api/images";
                const headers = {
                    "Content-Type": "application/json",
                };

                if (authToken) {
                    headers["Authorization"] = `Bearer ${authToken}`;
                }

                const response = await fetch(url, { headers });
                if (!response.ok) {
                    throw new Error(`Error fetching images: ${response.statusText}`);
                }

                const data = await response.json();

                const formattedData = data.map(img => ({
                    ...img,
                    id: img._id
                }));

                setFetchedImages(formattedData);
            } catch (error) {
                console.error("Error fetching images:", error);
                setFetchedImages([]);
            } finally {
                setIsLoading(false);
            }
        }

        if (authToken) {
            fetchImages();
        }

    }, [authToken, imageId]);

    return { isLoading, fetchedImages, setFetchedImages };
}
