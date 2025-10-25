import express from "express";
import { auth } from "../../auth/services/authService.js";
import {
  isAdmin,
  isAdminOrOwner,
  isOwner,
} from "../../auth/services/authorizationService.js";
import {
  createNewUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  changeUserBusinessStatus,
  deleteUser,
} from "../services/usersService.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    const user = await createNewUser(newUser);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const token = await login(email, password);
    res.send(token);
  } catch (error) {
    res.status(401).send("Invalid email or password");
  }
});

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

router.get("/:id", auth, isAdminOrOwner("id"), async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

router.put("/:id", auth, isOwner("id"), async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send("Update failed: " + error.message);
  }
});

router.patch("/:id", auth, isOwner("id"), async (req, res) => {
  try {
    const updatedUser = await changeUserBusinessStatus(req.params.id);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});
router.delete("/:id", auth, isAdminOrOwner("id"), async (req, res) => {
  try {
    const deletedUserId = await deleteUser(req.params.id);
    if (!deletedUserId) {
      return res.status(404).send("User not found");
    }
    res.send({ message: "User deleted successfully", id: deletedUserId });
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

export default router;
