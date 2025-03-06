"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProvider = void 0;
class ImageProvider {
    mongoClient;
    imageCollection;
    userCollection;
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const db = this.mongoClient.db();
        const imageCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const userCollectionName = process.env.USERS_COLLECTION_NAME;
        if (!imageCollectionName || !userCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
        this.imageCollection = db.collection(imageCollectionName);
        this.userCollection = db.collection(userCollectionName);
    }
    async getAllImages() {
        // Fetch all images
        const images = await this.imageCollection.find().toArray();
        // Extract all unique author IDs from images
        const authorIds = [...new Set(images.map(img => img.author))];
        // Fetch users matching those author IDs
        const users = await this.userCollection.find({ _id: { $in: authorIds } }).toArray();
        // Create a map of user IDs to user objects for easy lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user;
        });
        // Replace author ID with full user object
        return images.map(img => ({
            ...img,
            author: userMap[img.author] || null, // If user is not found, return null
        }));
    }
}
exports.ImageProvider = ImageProvider;
