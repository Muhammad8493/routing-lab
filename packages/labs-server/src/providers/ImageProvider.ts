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

    async getAllImages(authorId?: string): Promise<ImageWithAuthor[]> {
        const query = authorId ? { author: authorId } : {};
        const images = await this.imageCollection.find(query).toArray();

        const authorIds = [...new Set(images.map(img => img.author))];
        const users = await this.userCollection.find({ _id: { $in: authorIds } }).toArray();

        const userMap: { [key: string]: User } = {};
        users.forEach(user => {
            userMap[user._id] = user;
        });

        return images.map(img => ({
            ...img,
            author: userMap[img.author] || null,
        }));
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        const result = await this.imageCollection.updateOne(
            { _id: imageId },
            { $set: { name: newName } }
        );
        return result.matchedCount;
    }

    async createImage(image: Image): Promise<void> {
        await this.imageCollection.insertOne(image);
    }
}
