import type { Timestamp, DocumentReference } from "firebase/firestore"

export class Post {
    title: string;
    thumbnail_url: string;
    description: string;
    body: string;
    timestamp: Timestamp;
    author: DocumentReference;

    constructor(post: { title: string, thumbnail_url: string, description: string, body: string, timestamp: Timestamp, author: DocumentReference }) {
        this.title = post.title;
        this.thumbnail_url = post.thumbnail_url;
        this.description = post.description;
        this.body = post.body;
        this.timestamp = post.timestamp;
        this.author = post.author;
    }
    public check() {
        if (this.title == '') throw new Error("Field 'title' is required");
        else if (this.body == '') throw new Error("Field 'body' is required");
    }
}