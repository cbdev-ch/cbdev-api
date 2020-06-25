import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class LoginAttempt extends Document {
    @Prop()
    integrity: string;

    @Prop()
    callbackUri: string;

    @Prop({ type: Date, default: new Date() })
    triedAt: Date;

    @Prop({ type: Date })
    expiresAt: Date;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);