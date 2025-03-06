import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./providers/ImageProvider";

dotenv.config();

const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(staticDir));

let imageProvider: ImageProvider; // Store globally for later use

async function setUpServer() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
    
    if (!MONGO_USER || !MONGO_PWD || !MONGO_CLUSTER || !DB_NAME) {
        throw new Error("Missing required environment variables");
    }

    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
    console.log("Attempting Mongo connection...");
    
    try {
        const mongoClient = await MongoClient.connect(connectionString);
        console.log("Connected to MongoDB successfully");

        imageProvider = new ImageProvider(mongoClient);
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/images", async (req: Request, res: Response): Promise<void> => {
    if (!imageProvider) {
        res.status(500).json({ error: "Database not initialized yet" });
        return;
    }

    try {
        const images = await imageProvider.getAllImages();
        res.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("*", (req: Request, res: Response) => {
    console.log("None of the routes above were matched");
    res.sendFile(path.join(__dirname, "../../../dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

(async () => {
    await setUpServer();
})();
