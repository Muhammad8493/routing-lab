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
    async getAllImages(authorId) {
        const query = authorId ? { author: authorId } : {};
        const images = await this.imageCollection.find(query).toArray();
        const authorIds = [...new Set(images.map(img => img.author))];
        const users = await this.userCollection.find({ _id: { $in: authorIds } }).toArray();
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user;
        });
        return images.map(img => ({
            ...img,
            author: userMap[img.author] || null,
        }));
    }
    async updateImageName(imageId, newName) {
        const result = await this.imageCollection.updateOne({ _id: imageId }, { $set: { name: newName } });
        return result.matchedCount;
    }
    async createImage(image) {
        await this.imageCollection.insertOne(image);
    }
}
exports.ImageProvider = ImageProvider;
