# Backend for AI Plant Disease Recognition Website

---

## 📌 Project Overview
This project is the backend server for an **AI-powered e-commerce website** tailored for agriculture. It provides features such as:
- User authentication and authorization.
- CRUD operations for articles, products, and plant diseases.
- Product purchasing and online payment integration with **ZaloPay**.
- History tracking for purchases and plant disease diagnoses.

---
## 🔧 Technologies Used
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) for image storage
- ![ngrok](https://img.shields.io/badge/ngrok-1F1E37?style=for-the-badge&logo=ngrok&logoColor=white) for public URL exposure during development
---

## 💻 How to Run

Follow these steps to set up and run the backend server:

### 1️⃣ Clone the Repository and Navigate
```bash
git clone https://github.com/DaiNef163/BE-AI-Solutions-for-Plant-DiseaseRecognition.git
cd BE-AI-Solutions-for-Plant-DiseaseRecognition
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following configurations:
```plaintext
PORT=5000
MONGO_URI=<Your MongoDB Atlas Connection String>
JWT_SECRET=<Your JWT Secret Key>
ZALOPAY_KEY=<Your ZaloPay API Key>
CLOUDINARY_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
NGROK_AUTH_TOKEN=<Your ngrok Auth Token> # Optional for exposing localhost
```
> 🌟 **MongoDB Atlas**: Use the connection string provided by MongoDB Atlas, replacing `<username>`, `<password>`, and `<cluster>` as required.

### 4️⃣ Configure Cloudinary
Update your `cloudinary.js` (or equivalent file) with the following code:
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```
For more details, visit [Cloudinary Documentation](https://cloudinary.com/documentation).

### 5️⃣ Run the Development Server
Start the server using:
```bash
npm start
```
The server will be available at:
- **Localhost**: `http://localhost:8080`
- **Public URL (via ngrok)**:
   - Start ngrok:
     ```bash
     ngrok http 8080
     ```
   - Copy the public URL provided by ngrok (e.g., `https://xyz.ngrok.io`) and use it for external testing.

---

## Example `.env` File
```plaintext
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority
JWT_SECRET=mysecretkey
ZALOPAY_KEY=myzalopayapikey
CLOUDINARY_NAME=mycloudname
CLOUDINARY_API_KEY=mycloudinaryapikey
CLOUDINARY_API_SECRET=mycloudinaryapisecret
NGROK_AUTH_TOKEN=myngrokauthtoken
```

---

## 🛠 Responsibilities
- **Database Design**: Analyzed and designed the database structure.
- **User Authentication**: Implemented user login, registration, and authorization.
- **Core Functionalities**:
  - CRUD operations for articles, products, and plant diseases.
  - Product purchasing and purchase history tracking.
  - Integrated ZaloPay for secure online payments.
- **Collaborative Development**: Worked with a team to ensure seamless integration between frontend and backend.

---

## 🔗 GitHub Repository
[Backend AI Plant Disease Recognition](https://github.com/DaiNef163/BE-AI-Solutions-for-Plant-DiseaseRecognition)

---

Feel free to reach out for any queries or contributions!
