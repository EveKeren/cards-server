import { validateCard } from "../validation/cardValidationService.js";
import {
  createCard,
  deleteCardInDb,
  getAllCardsFromDb,
  getCardByIdFromDb,
  updateCardInDb,
  getCardsByUserIdFromDb,
  getFavoriteCardsFromDb,
  getCardByBizNumber,
} from "./cardsDataService.js";

const generateBizNumber = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};

export const getAllCards = async () => {
  const cards = await getAllCardsFromDb();
  return cards;
};

export const getCardById = async (id) => {
  const card = await getCardByIdFromDb(id);
  return card;
};

export const getMyCards = async (userId) => {
  const cards = await getCardsByUserIdFromDb(userId);
  return cards;
};

export const getFavoriteCards = async (userId) => {
  const cards = await getFavoriteCardsFromDb(userId);
  return cards;
};

export const createNewCard = async (card, userId) => {
  card.bizNumber = generateBizNumber();
  card.user_id = userId;
  card.likes = [];

  const { error } = validateCard(card);
  if (error) {
    console.log(error.details[0].message);
    return null;
  }
  const newCard = await createCard(card);
  return newCard;
};

export const updateCard = async (id, newCard) => {
  const modifiedCard = await updateCardInDb(id, newCard);
  return modifiedCard;
};

export const deleteCard = async (id) => {
  const card = await getCardByIdFromDb(id);
  if (!card) {
    return null;
  }
  const idOfDeletedCard = await deleteCardInDb(id);
  return idOfDeletedCard;
};

export const changeBizNumber = async (cardId, newBizNumber) => {
  try {
    const existingCard = await getCardByBizNumber(newBizNumber);
    if (existingCard && existingCard._id.toString() !== cardId) {
      return null;
    }

    const card = await getCardByIdFromDb(cardId);
    if (!card) {
      return null;
    }

    card.bizNumber = newBizNumber;
    const updatedCard = await updateCardInDb(cardId, card);
    return updatedCard;
  } catch (error) {
    console.error("Error changing bizNumber:", error);
    return null;
  }
};
