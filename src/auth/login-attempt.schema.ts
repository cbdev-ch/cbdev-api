import { Schema, Prop } from "@nestjs/mongoose";

@Schema()
export class LoginAttempt extends Document {
    @Prop()
    integrity: string;

    @Prop()
    callbackUri: string;

    @Prop()
    triedAt: Date;

    @Prop()
    expiresAt: Date;
}