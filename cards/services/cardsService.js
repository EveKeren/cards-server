import { validateCard } from "../validation/cardValidationService.js";
import {
  createCard,
  deleteCardInDb,
  getAllCardsFromDb,
  getCardByIdFromDb,
  updateCardInDb,
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

//create
export const createNewCard = async (card, userId) => {
  //generate biznumber for the card
  //it will look like this:
  card.bizNumber = generateBizNumber();
  card.user_id = userId;
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

//toggleLike

//changeBizNumber
