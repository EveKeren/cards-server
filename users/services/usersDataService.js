import User from "./../models/User.js";

export const getAllUsersFromDb = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserByIdFromDb = async (id) => {
  try {
    const user = await User.findById(id); // FIXED: was "const User"
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async (user) => {
  try {
    const userForDb = new User(user);
    await userForDb.save();
    return userForDb;
  } catch (error) {
    console.error("Mongo error:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      throw new Error("Email already exists");
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      throw new Error(`Validation failed: ${messages.join(", ")}`);
    }

    if (
      error.name === "MongoNetworkError" ||
      error.message.includes("ECONNREFUSED")
    ) {
      throw new Error("Database connection error");
    }

    throw new Error("MongoDB - Error in creating new user");
  }
};

export const updateUserInDb = async (id, newUser) => {
  try {
    const userAfterUpdate = await User.findByIdAndUpdate(id, newUser, {
      new: true,
    });
    return userAfterUpdate;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteUserInDb = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
