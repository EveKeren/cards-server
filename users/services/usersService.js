import { generateToken } from "../../auth/providers/jwtProvider.js";
import { comparePassword, generatePassword } from "../helpers/bcrypt.js";
import {
  createUser,
  getUserByEmail,
  getAllUsersFromDb,
  getUserByIdFromDb,
  updateUserInDb,
  deleteUserInDb,
} from "./usersDataService.js";
import {
  validateUser,
  validateUserUpdate,
} from "../validation/userValidationService.js";
import _ from "lodash";

export const createNewUser = async (user) => {
  try {
    const { error } = validateUser(user);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const hashPass = generatePassword(user.password);
    user.password = hashPass;

    const newUser = await createUser(user);

    const DTOuser = _.pick(newUser, [
      "email",
      "name",
      "_id",
      "isBusiness",
      "isAdmin",
    ]);
    return DTOuser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (comparePassword(password, user?.password)) {
      return generateToken(user);
    }
    throw new Error("Password incorrect");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await getAllUsersFromDb();
    return users.map((user) =>
      _.pick(user, [
        "_id",
        "name",
        "email",
        "phone",
        "address",
        "image",
        "isBusiness",
        "isAdmin",
        "createdAt",
      ])
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await getUserByIdFromDb(id);
    if (!user) {
      return null;
    }
    return _.pick(user, [
      "_id",
      "name",
      "email",
      "phone",
      "address",
      "image",
      "isBusiness",
      "isAdmin",
      "createdAt",
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (id, userData) => {
  try {
    const { error } = validateUserUpdate(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const updatedUser = await updateUserInDb(id, userData);
    if (!updatedUser) {
      return null;
    }

    return _.pick(updatedUser, [
      "_id",
      "name",
      "email",
      "phone",
      "address",
      "image",
      "isBusiness",
      "isAdmin",
      "createdAt",
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const changeUserBusinessStatus = async (id) => {
  try {
    const user = await getUserByIdFromDb(id);
    if (!user) {
      return null;
    }
    user.isBusiness = !user.isBusiness;

    const updatedUser = await updateUserInDb(id, user);

    return _.pick(updatedUser, [
      "_id",
      "name",
      "email",
      "phone",
      "address",
      "image",
      "isBusiness",
      "isAdmin",
      "createdAt",
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const deletedId = await deleteUserInDb(id);
    return deletedId;
  } catch (error) {
    throw new Error(error.message);
  }
};
