export interface Image {
    _id: string;
    src: string;
    name: string;
    author: string;
    likes: number;
}

export interface ImageWithAuthor {
    _id: string;
    src: string;
    name: string;
    author: {
        _id: string;
        username: string;
        email: string;
    };
    likes: number;
}
