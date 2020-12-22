import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    avatarUri: string;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}