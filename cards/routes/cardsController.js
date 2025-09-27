import express from "express";
import { auth } from "../../auth/services/authService.js";
import {
  getAllCards,
  getCardById,
  createNewCard,
  updateCard,
  deleteCard,
  getMyCards,
} from "../services/cardsService.js";

const router = express.Router();

// GET /cards - Get all cards
router.get("/", async (req, res) => {
  try {
    const cards = await getAllCards();
    res.json(cards);
  } catch (error) {
    console.error("Get all cards error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /cards/my-cards - Get current user's cards
router.get("/my-cards", auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cards = await getMyCards(userId);
    res.json(cards);
  } catch (error) {
    console.error("Get my cards error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /cards/:id - Get card by ID
router.get("/:id", async (req, res) => {
  try {
    const card = await getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    console.error("Get card by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /cards - Create new card
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const newCard = await createNewCard(req.body, userId);
    if (!newCard) {
      return res
        .status(400)
        .json({ message: "Card creation failed - validation error" });
    }
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Create card error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /cards/:id - Update card
router.put("/:id", auth, async (req, res) => {
  try {
    const card = await getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Check if user owns this card
    if (card.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedCard = await updateCard(req.params.id, req.body);
    res.json(updatedCard);
  } catch (error) {
    console.error("Update card error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /cards/:id - Delete card
router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Check if user owns this card
    if (card.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedId = await deleteCard(req.params.id);
    res.json({ message: "Card deleted", id: deletedId });
  } catch (error) {
    console.error("Delete card error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /cards/:id - Toggle like
router.patch("/:id", auth, async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id; // From auth middleware

    // Use your existing cardsService
    const card = await getCardById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Initialize likes array if it doesn't exist
    if (!card.likes) {
      card.likes = [];
    }

    // Convert userId to string since your model uses String array
    const userIdStr = userId.toString();

    // Check if user already liked this card
    const likeIndex = card.likes.findIndex((id) => id === userIdStr);

    if (likeIndex > -1) {
      // User already liked - remove like
      card.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked - add like
      card.likes.push(userIdStr);
    }

    // Save the updated card using your existing updateCard function
    const updatedCard = await updateCard(cardId, card);
    res.json(updatedCard);
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
