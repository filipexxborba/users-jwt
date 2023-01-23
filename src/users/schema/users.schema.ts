import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  @ApiProperty()
  username: string;

  @Prop()
  @ApiProperty()
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);
