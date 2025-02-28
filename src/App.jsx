import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './MainLayout'
import { Homepage } from './Homepage'
import { AccountSettings } from './AccountSettings'
import { ImageGallery } from './images/ImageGallery'
import { ImageDetails } from './images/ImageDetails'

const IMAGES = [
  {
    id: "0",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blue_merle_koolie_short_coat_heading_sheep.jpg",
    name: "Blue merle herding sheep"
  },
  {
    id: "1",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg",
    name: "Huskies"
  },
  {
    id: "2",
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg",
    name: "Shiba"
  },
  {
    id: "3",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/2560px-Felis_catus-cat_on_snow.jpg",
    name: "Tabby cat"
  },
  {
    id: "4",
    src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg",
    name: "Chickens"
  }
];

export default function App() {
  const [userName, setUserName] = useState("John Doe");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedImages, setFetchedImages] = useState([]);

  // Simulate a 1s fetch delay, then store IMAGES in state
  useEffect(() => {
    const timer = setTimeout(() => {
      setFetchedImages(IMAGES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <BrowserRouter>
      <Routes>
        {/* A parent route that always renders MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          }
        >
          {/* The “index” route is the homepage at path="/" */}
          <Route
            index
            element={<Homepage userName={userName} />}
          />
          {/* Account Settings */}
          <Route
            path="account"
            element={
              <AccountSettings
                userName={userName}
                setUserName={setUserName}
              />
            }
          />
          {/* Image Gallery */}
          <Route
            path="images"
            element={
              <ImageGallery
                isLoading={isLoading}
                fetchedImages={fetchedImages}
              />
            }
          />
          {/* Image Details */}
          <Route
            path="images/:imageId"
            element={
              <ImageDetails
                isLoading={isLoading}
                fetchedImages={fetchedImages}
              />
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
