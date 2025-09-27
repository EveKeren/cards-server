import { validateCard } from "../validation/cardValidationService.js";
import {
  createCard,
  deleteCardInDb,
  getAllCardsFromDb,
  getCardByIdFromDb,
  updateCardInDb,
  getCardsByUserIdFromDb, // Add this import if it doesn't exist
} from "./cardsDataService.js";

// Generate unique business number for card
const generateBizNumber = () => {
  // Generate a 7-digit random business number
  return Math.floor(1000000 + Math.random() * 9000000);
};

//get all
export const getAllCards = async () => {
  const cards = await getAllCardsFromDb();
  return cards;
};

//get one by id
export const getCardById = async (id) => {
  const card = await getCardByIdFromDb(id);
  return card;
};

// ADD THIS NEW FUNCTION - Get user's cards
export const getMyCards = async (userId) => {
  const cards = await getCardsByUserIdFromDb(userId);
  return cards;
};

//create
export const createNewCard = async (card, userId) => {
  //generate biznumber for the card
  card.bizNumber = generateBizNumber();
  card.user_id = userId;

  // ADD THIS - Initialize likes array for new cards
  card.likes = [];

  const { error } = validateCard(card);
  if (error) {
    console.log(error.details[0].message);
    return null;
  }
  const newCard = await createCard(card);
  return newCard;
};

//update
export const updateCard = async (id, newCard) => {
  const modifiedCard = await updateCardInDb(id, newCard);
  return modifiedCard;
};

//delete
export const deleteCard = async (id) => {
  const card = await getCardByIdFromDb(id);
  if (!card) {
    return null;
  }
  const idOfDeletedCard = await deleteCardInDb(id);
  return idOfDeletedCard;
};

//toggleLike - IMPLEMENTATION NOT NEEDED (handled in controller)

//changeBizNumber
