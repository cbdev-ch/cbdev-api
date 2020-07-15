import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDocument extends Document {
  @Prop()
  discordId: string;

  @Prop()
  discordToken: string;

  @Prop()
  discordTokenExpiresAt: Date;

  @Prop()
  discordRefreshToken: string;

  @Prop()
  discordScopes: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);