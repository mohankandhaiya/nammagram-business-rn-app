// app/helpers/cloudinaryHelper.js

export const uploadImageToCloudinary = async (uri) => {
  try {
    const data = new FormData();

    // ✅ Correct way to append file
    data.append("file", {
      uri: uri,
      type: "image/jpeg",   // detect dynamically if needed
      name: "upload.jpg",
    });

    data.append("upload_preset", "MedLink");

    const res = await fetch("https://api.cloudinary.com/v1_1/dwxchrrsl/image/upload", {
      method: "POST",
      body: data,
      // ❌ Do NOT set Content-Type manually — let RN handle it
      // headers: {
      //   Accept: "application/json",
      // },
    });

    const json = await res.json();

    if (json.secure_url) {
      return json.secure_url;
    } else {
      throw new Error(json.error?.message || "Cloudinary upload failed");
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};



