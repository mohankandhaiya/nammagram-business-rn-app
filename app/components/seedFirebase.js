import { db } from "../helpers/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import seedData from "./seedData.json";

const seedFirebase = async () => {
  try {
    console.log("Seeding categories...");

    for (const category of seedData.categories) {
      await addDoc(collection(db, "categories"), {
        categoryId: category.id,
        name: category.name,
        createdAt: new Date(),
      });
    }

    console.log("Seeding subcategories...");

    for (const sub of seedData.subcategories) {
      await addDoc(collection(db, "subcategories"), {
        subCategoryId: sub.id,
        categoryId: sub.categoryId,
        name: sub.name,
        createdAt: new Date(),
      });
    }

    console.log("Seeding products...");

    for (const product of seedData.products) {
      await addDoc(collection(db, "products"), {
        productId: product.id,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        itemName: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        discount: product.discount,
        createdAt: new Date(),
      });
    }

    console.log("✅ Firebase seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding Firebase:", error);
  }
};

seedFirebase();