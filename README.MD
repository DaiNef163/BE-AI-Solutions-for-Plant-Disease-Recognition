# 🌱 Backend for AI Plant Disease Recognition Website

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 📝 Description
This project is the **backend system** for an AI-powered e-commerce website designed for the agricultural sector. The backend provides robust functionalities, including:
- **User authentication and authorization**.
- **CRUD operations** for articles, products, and plant diseases.
- **Payment integration** with ZaloPay.
- **Product buying and selling features**, along with purchase and disease history tracking.

### **GitHub Repository**
🔗 [Backend Repository](https://github.com/DaiNef163/BE-AI-Solutions-for-Plant-DiseaseRecognition)

---

## 🔧 Technologies Used
- **Node.js** (Express.js): For building a scalable RESTful API.
- **MongoDB**: NoSQL database for storing user, product, and transaction data.
- **JavaScript**: Backend logic implementation.

---

## 📂 Database
The backend uses **MongoDB** for managing the following:
- **User Data**: Login, registration, roles, and authorization.
- **Products**: Product details for buying and selling.
- **Plant Diseases**: Historical data for diagnosis tracking.
- **News Articles**: CRUD operations for agricultural updates.
- **Payment History**: Integrated with **ZaloPay** for seamless transactions.

---

## 🛠 Responsibilities
### Key Contributions:
- **Database Design**:
  - Created a well-structured schema to ensure efficient data flow.
- **Authentication**:
  - Implemented **JWT-based authentication** and role-based authorization.
- **Feature Implementation**:
  - Developed:
    - **Login/Registration** functionalities.
    - **CRUD operations** for articles, products, and plant diseases.
    - **Payment integration** with ZaloPay.
    - **Purchase and disease history** tracking.

---

## 🔑 Key Features
- **User Authorization**: Role-based access control for different user roles (admin, staff, customer).
- **CRUD Functionalities**: Complete backend support for creating, updating, and managing data.
- **ZaloPay Integration**: Secure and reliable payment handling for transactions.
- **Historical Tracking**: Maintains records for product purchases and plant disease diagnoses.

---

## 📦 How to Run

Follow these steps to set up and run the backend server:

1. **Clone the Repository and Navigate**:
   ```bash
   git clone https://github.com/DaiNef163/BE-AI-Solutions-for-Plant-DiseaseRecognition.git
   cd BE-AI-Solutions-for-Plant-DiseaseRecognition
2. Install Dependencies: npm install

3. Set Up Environment Variables: Create a .env file in the root directory and add the following configurations:
  PORT=5000
  MONGO_URI=<Your MongoDB Connection String>
  JWT_SECRET=<Your JWT Secret Key>
  ZALOPAY_KEY=<Your ZaloPay API Key>
  CLOUDINARY_NAME=<Your Cloudinary Cloud Name>
  CLOUDINARY_API_KEY=<Your Cloudinary API Key>
  CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>

4. Configure Cloudinary: Update your cloudinary.js or related configuration file with:
https://cloudinary.com/home

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

5. Run the Development Server: npm start

---
**Thank you for visiting! Feel free to contribute or reach out for collaboration opportunities.**

