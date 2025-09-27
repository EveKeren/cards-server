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

    // Check if user already liked this card
    const likeIndex = card.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      // User already liked - remove like
      card.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked - add like
      card.likes.push(userId);
    }

    // Save the updated card using your existing updateCard function
    const updatedCard = await updateCard(cardId, card);
    res.json(updatedCard);
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Make sure to import the required functions at the top:
// import { getCardById, updateCard } from '../services/cardsService.js';
// import { auth } from '../../auth/services/authService.js';
