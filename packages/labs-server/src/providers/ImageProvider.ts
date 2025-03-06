import { MongoClient, Collection } from "mongodb";
import { Image, ImageWithAuthor } from "../types/image";
import { User } from "../types/user";

export class ImageProvider {
    private imageCollection: Collection<Image>;
    private userCollection: Collection<User>;

    constructor(private readonly mongoClient: MongoClient) {
        const db = this.mongoClient.db();

        const imageCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const userCollectionName = process.env.USERS_COLLECTION_NAME;

        if (!imageCollectionName || !userCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }

        this.imageCollection = db.collection<Image>(imageCollectionName);
        this.userCollection = db.collection<User>(userCollectionName);
    }

    async getAllImages(): Promise<ImageWithAuthor[]> {
        // Fetch all images
        const images = await this.imageCollection.find().toArray();

        // Extract all unique author IDs from images
        const authorIds = [...new Set(images.map(img => img.author))];

        // Fetch users matching those author IDs
        const users = await this.userCollection.find({ _id: { $in: authorIds } }).toArray();

        // Create a map of user IDs to user objects for easy lookup
        const userMap: { [key: string]: User } = {};
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
