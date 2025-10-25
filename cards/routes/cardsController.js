import express from "express";
import { auth } from "../../auth/services/authService.js";
import {
  isBusiness,
  isAdmin,
} from "../../auth/services/authorizationService.js";
import {
  getAllCards,
  getCardById,
  createNewCard,
  updateCard,
  deleteCard,
  getMyCards,
  getFavoriteCards,
  changeBizNumber,
} from "../services/cardsService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cards = await getAllCards();
    res.json(cards);
  } catch (error) {
    console.error("Get all cards error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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

router.get("/favorite-cards", auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const favoriteCards = await getFavoriteCards(userId);
    res.json(favoriteCards);
  } catch (error) {
    console.error("Get favorite cards error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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

router.post("/", auth, isBusiness, async (req, res) => {
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

router.put("/:id", auth, async (req, res) => {
  try {
    const card = await getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied - not card owner" });
    }

    const updatedCard = await updateCard(req.params.id, req.body);
    res.json(updatedCard);
  } catch (error) {
    console.error("Update card error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id;

    const card = await getCardById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (!card.likes) {
      card.likes = [];
    }

    const userIdStr = userId.toString();

    const likeIndex = card.likes.findIndex((id) => id === userIdStr);

    if (likeIndex > -1) {
      card.likes.splice(likeIndex, 1);
    } else {
      card.likes.push(userIdStr);
    }

    const updatedCard = await updateCard(cardId, card);
    res.json(updatedCard);
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const isOwner = card.user_id.toString() === req.user._id.toString();
    const isAdminUser = req.user.isAdmin;

    if (!isOwner && !isAdminUser) {
      return res
        .status(403)
        .json({ message: "Access denied - not card owner or admin" });
    }

    const deletedId = await deleteCard(req.params.id);
    res.json({ message: "Card deleted", id: deletedId });
  } catch (error) {
    console.error("Delete card error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/biz-number/:id", auth, isAdmin, async (req, res) => {
  try {
    const { bizNumber } = req.body;

    if (!bizNumber || typeof bizNumber !== "number") {
      return res.status(400).json({ message: "Valid bizNumber is required" });
    }

    const updatedCard = await changeBizNumber(req.params.id, bizNumber);

    if (!updatedCard) {
      return res.status(400).json({
        message:
          "Failed to update bizNumber. It may already be in use or card not found.",
      });
    }

    res.json(updatedCard);
  } catch (error) {
    console.error("Change bizNumber error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
