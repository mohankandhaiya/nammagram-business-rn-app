import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../helpers/firebaseConfig";
import { uploadImageToCloudinary } from "../helpers/cloudinaryHelper";

export default function useSaveItem() {
  const saveItem = async (initialData, itemName, itemCode, itemCategory, hsnCode, pricingData, stockData, images) => {
    try {
      // Upload images to Cloudinary
      let imageUrls = [];
      for (const uri of images) {
        const url = await uploadImageToCloudinary(uri);
        imageUrls.push(url);
      }

      const productData = {
        itemName,
        itemCode,
        itemCategory,
        hsnCode,
        pricing: pricingData,
        stock: stockData,
        images: imageUrls,
        updatedAt: new Date(),
      };

      if (initialData?.id) {
        // EDIT MODE -> update existing product
        const productRef = doc(db, "products", initialData.id);
        await updateDoc(productRef, productData);
        return { success: true, message: "Product updated successfully!" };
      } else {
        // ADD MODE -> create new product
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date(),
        });
        return { success: true, message: "Product added successfully!" };
      }
    } catch (error) {
      console.error("Error saving item:", error);
      return { success: false, message: "Failed to save item." };
    }
  };

  return { saveItem };
}
