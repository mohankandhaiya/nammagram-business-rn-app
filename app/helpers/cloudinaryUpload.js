// helpers/cloudinaryUpload.js
export async function uploadToCloudinary(imageUri) {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  });
  data.append("upload_preset", "MedLink"); // set in Cloudinary dashboard

  const res = await fetch("https://api.cloudinary.com/v1_1/dwxchrrsl/image/upload", {
    method: "POST",
    body: data,
  });
  const json = await res.json();
  return json.secure_url; // Cloudinary URL
}
