import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection, Model, connect } from 'mongoose';
import { User, UsersSchema } from './schema/users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mongod: MongoMemoryServer;
  let database: Connection;
  let userModel: Model<User>;

  //   Creating the Module Testing
  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    database = mongoose.createConnection(mongod.getUri());
    userModel = database.model(User.name, UsersSchema);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  //   Destroy current connection
  afterAll(async () => {
    await database.dropDatabase();
    await database.close();
    await mongod.stop();
  });

  //   Delete every collection
  afterEach(async () => {
    const collections = database.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('Controller', () => {
    it(`Should be defined`, () => {
      expect(controller).toBeDefined();
    });
  });

  describe(`Users POST /users`, () => {
    it(`User create sucessfully`, async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
      };
      const result = await controller.create(createUserDto);
      expect(result.username).toBe(createUserDto.username);
    });
    it(`User create sucessfully and password is not the same of parameters, because his incripted`, async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
      };
      const result = await controller.create(createUserDto);
      expect(result.password).not.toBe(createUserDto.password);
    });
  });
  describe(`Users GET /user`, () => {
    it(`Should be return a User list`, async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
    it(`Should be return a User list with 1 user`, async () => {
      const createUserDto = { username: 'teste', password: 'teste' };
      await controller.create(createUserDto);
      const result = await controller.findAll();
      expect(result.length).toBe(1);
    });
  });
  describe(`Users GET /user:id`, () => {
    it(`Should be return a User filtered by id`, async () => {
      const createUserDto = { username: 'teste', password: 'teste' };
      const validate = await controller.create(createUserDto);
      const result = await controller.findOne(validate.id);
      expect(result.username).toBe(createUserDto.username);
    });
    it(`Should be return a null filtered by id, because his id not exist`, async () => {
      const createUserDto = { username: 'teste', password: 'teste' };
      await controller.create(createUserDto);
      const result = await controller.findOne(
        new mongoose.Types.ObjectId().toString(),
      );
      expect(result).toBeNull();
    });
  });
  describe(`Users PATCH /user:id`, () => {
    it(`Should be return a new username`, async () => {
      const createUserDto = { username: 'teste', password: 'teste' };
      const validate = await controller.create(createUserDto);
      const updateUserDto: UpdateUserDto = {
        username: 'filipe',
        password: 'teste',
      };
      const result = await controller.update(validate.id, updateUserDto);
      console.log(result);
      expect(result.username).toBe('filipe');
    });
  });
  describe(`Users DELETE /user:id`, () => {
    it(`Should be return a empty User list`, async () => {
      const createUserDto = { username: 'teste', password: 'teste' };
      const validate = await controller.create(createUserDto);
      await controller.remove(validate.id);
      const result = await controller.findAll();
      expect(result.length).toEqual(0);
    });
  });
});
