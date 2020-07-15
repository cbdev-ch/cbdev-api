import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDoc extends Document {
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

export const UserSchema = SchemaFactory.createForClass(UserDoc);