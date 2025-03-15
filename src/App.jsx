import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './MainLayout';
import { Homepage } from './Homepage';
import { AccountSettings } from './AccountSettings';
import { ImageGallery } from './images/ImageGallery';
import { ImageDetails } from './images/ImageDetails';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useImageFetching } from './images/useImageFetching';

export default function App() {
    const [userName, setUserName] = useState("John Doe");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || null);

    const { isLoading, fetchedImages, setFetchedImages } = useImageFetching(authToken);

    function handleImageUpdate(imageId, newName) {
        setFetchedImages(prevImages =>
            prevImages.map(img => img.id === imageId ? { ...img, name: newName } : img)
        );
    }

    function handleLogout() {
        setAuthToken(null);
        localStorage.removeItem("authToken");
    }

    useEffect(() => {
        if (authToken) {
            localStorage.setItem("authToken", authToken);
        }
    }, [authToken]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
                <Route path="/register" element={<RegisterPage setAuthToken={setAuthToken} />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <MainLayout
                                isDarkMode={isDarkMode}
                                setIsDarkMode={setIsDarkMode}
                                onLogout={handleLogout}
                            />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<Homepage userName={userName} onImageUpdate={handleImageUpdate} authToken={authToken} />}
                    />
                    <Route
                        path="account"
                        element={
                            <AccountSettings
                                userName={userName}
                                setUserName={setUserName}
                            />
                        }
                    />
                    <Route
                        path="images"
                        element={
                            <ImageGallery
                                isLoading={isLoading}
                                fetchedImages={fetchedImages}
                            />
                        }
                    />
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
    );
}
