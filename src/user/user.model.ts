export class User {
    id: string;
    username: string;
    avatarUri: string;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}