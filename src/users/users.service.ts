import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';
import * as bcrypt from 'bcrypt';
import { bcryptConstants } from './constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      bcryptConstants.saltRounds,
    );
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashPassword,
    });
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findByQuery(query: Object) {
    return this.userModel.findOne(query).exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findById(id);
    const hashPassword = await bcrypt.hash(updateUserDto.password, bcryptConstants.saltRounds);
    updateUser.username = updateUserDto.username;
    updateUser.password = hashPassword;
    return updateUser.save();
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id).exec();
  }
}
