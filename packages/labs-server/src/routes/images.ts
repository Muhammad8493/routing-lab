import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../providers/ImageProvider";
import { imageMiddlewareFactory, handleImageFileErrors } from "../middleware/imageUploadMiddleware";
import { verifyAuthToken } from "../routes/auth";


export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    const imageProvider = new ImageProvider(mongoClient);

    //  GET /api/images (All images or filtered by author)
    app.get("/api/images", async (req: Request, res: Response): Promise<void> => {
        let userId: string | undefined = undefined;
        if (typeof req.query.createdBy === "string") {
            userId = req.query.createdBy;
        }

        try {
            const images = await imageProvider.getAllImages(userId);
            res.json(images);
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    //  PATCH /api/images/:id (Update image name)
    app.patch("/api/images/:id", async (req: Request, res: Response): Promise<void> => {
        const imageId = req.params.id;
        const { name } = req.body;

        if (!name) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing name property",
            });
            return;
        }

        try {
            const updatedCount = await imageProvider.updateImageName(imageId, name);
            if (updatedCount === 0) {
                res.status(404).send({
                    error: "Not found",
                    message: "Image does not exist",
                });
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error("Error updating image:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    app.post(
        "/api/images",
        verifyAuthToken, 
        imageMiddlewareFactory.single("image"), 
        handleImageFileErrors,  
        async (req: Request, res: Response): Promise<void> => { 
            try {
                if (!req.file || !req.body.name) {
                    res.status(400).json({ error: "Bad Request", message: "Missing file or name" });
                    return;
                }
        
                const username = res.locals.token.username;
                const newImage = {
                    _id: req.file.filename,
                    src: `/uploads/${req.file.filename}`,
                    name: req.body.name,
                    author: username,
                    likes: 0
                };
        
                const createdImage = await imageProvider.createImage(newImage);
                res.status(201).json(createdImage);
            } catch (error) {
                console.error("Error handling image upload:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
}
