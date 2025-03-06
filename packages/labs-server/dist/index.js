"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const ImageProvider_1 = require("./providers/ImageProvider");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const app = (0, express_1.default)();
app.use(express_1.default.static(staticDir));
let imageProvider; // Store globally for later use
async function setUpServer() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
    if (!MONGO_USER || !MONGO_PWD || !MONGO_CLUSTER || !DB_NAME) {
        throw new Error("Missing required environment variables");
    }
    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
    console.log("Attempting Mongo connection...");
    try {
        const mongoClient = await mongodb_1.MongoClient.connect(connectionString);
        console.log("Connected to MongoDB successfully");
        imageProvider = new ImageProvider_1.ImageProvider(mongoClient);
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get("/api/images", async (req, res) => {
    if (!imageProvider) {
        res.status(500).json({ error: "Database not initialized yet" });
        return;
    }
    try {
        const images = await imageProvider.getAllImages();
        res.json(images);
    }
    catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("*", (req, res) => {
    console.log("None of the routes above were matched");
    res.sendFile(path_1.default.join(__dirname, "../../../dist/index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
(async () => {
    await setUpServer();
})();
