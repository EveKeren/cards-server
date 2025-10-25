import User from "../../users/models/User.js";
import Card from "../../cards/models/Card.js";
import { generatePassword } from "../../users/helpers/bcrypt.js";

const initialUsers = [
  {
    name: {
      first: "Regular",
      middle: "",
      last: "User",
    },
    phone: "050-1234567",
    email: "regular@example.com",
    password: "Abc123!@#",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      alt: "regular user",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Tel Aviv",
      street: "Dizengoff",
      houseNumber: 10,
      zip: 6100001,
    },
    isBusiness: false,
    isAdmin: false,
  },
  {
    name: {
      first: "Business",
      middle: "",
      last: "Owner",
    },
    phone: "050-2345678",
    email: "business@example.com",
    password: "Abc123!@#",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      alt: "business user",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Haifa",
      street: "Herzl",
      houseNumber: 25,
      zip: 3300001,
    },
    isBusiness: true,
    isAdmin: false,
  },
  {
    name: {
      first: "Admin",
      middle: "",
      last: "Super",
    },
    phone: "050-3456789",
    email: "admin@example.com",
    password: "Abc123!@#",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      alt: "admin user",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Jerusalem",
      street: "King George",
      houseNumber: 50,
      zip: 9100001,
    },
    isBusiness: true,
    isAdmin: true,
  },
];

const initialCards = [
  {
    title: "Tech Solutions Ltd",
    subtitle: "Web Development Services",
    description:
      "Professional web development and consulting services for businesses of all sizes. We specialize in modern web technologies.",
    phone: "050-1111111",
    email: "contact@techsolutions.com",
    web: "https://www.techsolutions.com",
    image: {
      url: "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg",
      alt: "tech solutions",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Tel Aviv",
      street: "Rothschild",
      houseNumber: 15,
      zip: 6688101,
    },
    bizNumber: 1000001,
    likes: [],
  },
  {
    title: "Cafe Aroma",
    subtitle: "Best Coffee in Town",
    description:
      "Cozy coffee shop serving premium coffee, pastries and light meals. Perfect place for meetings or work.",
    phone: "050-2222222",
    email: "info@cafearoma.com",
    web: "https://www.cafearoma.com",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/05/07/13/45/coffee-756490_1280.jpg",
      alt: "cafe aroma",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Haifa",
      street: "Ben Gurion",
      houseNumber: 88,
      zip: 3200003,
    },
    bizNumber: 1000002,
    likes: [],
  },
  {
    title: "Legal Consulting Group",
    subtitle: "Expert Legal Services",
    description:
      "Comprehensive legal services for individuals and businesses. Specializing in corporate law, contracts and real estate.",
    phone: "050-3333333",
    email: "office@legalconsulting.com",
    web: "https://www.legalconsulting.com",
    image: {
      url: "https://cdn.pixabay.com/photo/2017/07/10/11/28/law-2490921_1280.jpg",
      alt: "legal consulting",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Jerusalem",
      street: "Jaffa",
      houseNumber: 120,
      zip: 9400001,
    },
    bizNumber: 1000003,
    likes: [],
  },
];

export const createInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Initial data already exists, skipping...");
      return;
    }

    console.log("Creating initial data...");

    const usersWithHashedPasswords = initialUsers.map((user) => ({
      ...user,
      password: generatePassword(user.password),
    }));

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} initial users`);

    const businessUserId = createdUsers[1]._id.toString();

    const cardsWithUserId = initialCards.map((card) => ({
      ...card,
      user_id: businessUserId,
    }));

    const createdCards = await Card.insertMany(cardsWithUserId);
    console.log(`✅ Created ${createdCards.length} initial cards`);

    console.log("✅ Initial data created successfully!");
    console.log("\n📧 Login credentials:");
    console.log("Regular User: regular@example.com / Abc123!@#");
    console.log("Business User: business@example.com / Abc123!@#");
    console.log("Admin User: admin@example.com / Abc123!@#");
  } catch (error) {
    console.error("❌ Error creating initial data:", error);
  }
};
