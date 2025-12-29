import { UserController } from "./UserController";
import { UserRepository } from "./UserRepository";
import { Create } from "./Services/Create";
import { Auth } from "./Services/Auth";
import { UpdateUser } from "./Services/Update";
import { FindById } from "./Services/FindById";
import { UpdateAvatar } from "./Services/UpdateAvatar";
import { StorageProvider } from "../providers/StorageProvider";

const userRepository = new UserRepository();

const createUser = new Create(userRepository);
const authService = new Auth(createUser);
const updateUser = new UpdateUser(userRepository);
const findUserById = new FindById(userRepository);
const storageProvider = new StorageProvider();
const updateAvatar = new UpdateAvatar(userRepository, storageProvider)

export const userController = new UserController(
  authService,
  updateUser,
  findUserById,
  updateAvatar
);
