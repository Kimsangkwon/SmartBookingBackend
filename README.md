# 📖 SMART BOOKING API Documentation

## 📌 1️⃣ User Registration

### 🔹 `POST /user/create`

- **Description:** Registers a new user and hashes the password before saving.
- **Request Body (JSON)**
  ```json
  {
    "email": "test@example.com",
    "userPassword": "mypassword"
  }
  ```
- **Success Response**
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Error Response**
  ```json
  {
    "error": "User already exists"
  }
  ```

---

## 📌 2️⃣ User Login

### 🔹 `POST /user/login`

- **Description:** Authenticates the user and returns a JWT token.
- **Request Body (JSON)**
  ```json
  {
    "email": "test@example.com",
    "userPassword": "mypassword"
  }
  ```
- **Success Response**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

## 📌 3️⃣ Get User Profile

### 🔹 `GET /user/profile`

- **Description:** Retrieves the authenticated user's profile information.
- **Headers**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Example (Postman)**
  ```http
  GET /user/profile
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Success Response (Profile Exists)**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "uniqueDisplayName": "johndoe123",
    "phoneNumber": "1234567890",
    "country": "Canada",
    "province": "Ontario",
    "city": "Toronto",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "birthdate": "1995-08-15"
  }
  ```
- **Success Response (No Profile)**
  ```json
  {
    "profile": null
  }
  ```
- **Error Response (Unauthorized)**
  ```json
  {
    "error": "Unauthorized"
  }
  ```

---

## 📌 4️⃣ Create or Update User Profile

### 🔹 `POST /user/profile`

- **Description:** Creates or updates the user's profile. (Authentication required)
- **Headers**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body (JSON)**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "uniqueDisplayName": "johndoe123",
    "phoneNumber": "1234567890",
    "country": "Canada",
    "province": "Ontario",
    "city": "Toronto",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "birthdate": "1995-08-15"
  }
  ```
- **Success Response**
  ```json
  {
    "message": "Profile updated successfully",
    "profile": {
      "userId": "65f1d1d6a8a3f2b3c3f9e7b2",
      "firstName": "John",
      "lastName": "Doe",
      "uniqueDisplayName": "johndoe123",
      "phoneNumber": "1234567890",
      "country": "Canada",
      "province": "Ontario",
      "city": "Toronto",
      "address1": "123 Main St",
      "address2": "Apt 4B",
      "birthdate": "1995-08-15"
    }
  }
  ```
- **Error Response (Validation Error)**
  ```json
  {
    "error": "First name must be at least 2 characters"
  }
  ```

---

## 📌 5️⃣ Get Home

### 🔹 `GET /home`

- **Description:** Fetches a list of events from the Ticketmaster API to show on the home page.

- **Request Example**
  ```http
  GET /home
  ```
- **Success Response**

  ```json
  {
    "mostViewed": [
      {
        "id": "12345",
        "date": "2025-06-12",
        "name": "Live in Concert",
        "images": [
          "https://someimage.com/img1.jpg",
          "https://someimage.com/img2.jpg"
        ],
        "info": "VIP package available"
      }
    ],
    "sportsEvents": [
      {
        "id": "67890",
        "date": "2025-06-15",
        "name": "NBA Finals",
        "images": ["https://someimage.com/nba.jpg"],
        "info": "Final match of the season"
      }
    ],
    "concertEvents": [
      {
        "id": "11223",
        "date": "2025-06-18",
        "name": "Coldplay World Tour",
        "images": ["https://someimage.com/coldplay.jpg"],
        "info": "Coldplay's new world tour!"
      }
    ]
  }
  ```

- **Error Response**
  ```json
  {
    "error": "Failed to fetch events"
  }
  ```

---

## 📌 6️⃣ Get Search

### 🔹 `GET /search`

- **Description:** Search events based on the user input.

- **Request Example**

  ```http
  GET /api/search?cityOrPostalCode=Toronto&date=2025-03-20&keyword=Coldplay

  ```

- **Success Response**

  ```json
  [
    {
      "id": "1k7Zv-a6GACrYyf",
      "name": "PRIDE NIGHT | Toronto Raptors v San Antonio Spurs",
      "date": "2025-03-23",
      "time": "18:00:00",
      "venue": "Scotiabank Arena",
      "city": "Toronto",
      "postalCode": "M5J 2L2",
      "country": "Canada",
      "image": "https://s1.ticketm.net/dam/a/810/587e669b-5946-46c0-a526-b63b6e008810_1339651_TABLET_LANDSCAPE_16_9.jpg",
      "url": "https://www.ticketmaster.ca/pride-night-toronto-raptors-v-san-toronto-ontario-03-23-2025/event/100061247E7B0E54"
    },
    {
      "id": "1k7Zv-a6GACLOy_",
      "name": "GREATEST OF ALL TORONTO NIGHT | Toronto Raptors v Charlotte Hornets",
      "date": "2025-03-28",
      "time": "19:30:00",
      "venue": "Scotiabank Arena",
      "city": "Toronto",
      "postalCode": "M5J 2L2",
      "country": "Canada",
      "image": "https://s1.ticketm.net/dam/a/810/587e669b-5946-46c0-a526-b63b6e008810_1339651_TABLET_LANDSCAPE_16_9.jpg",
      "url": "https://www.ticketmaster.ca/greatest-of-all-toronto-night-toronto-toronto-ontario-03-28-2025/event/100061247E7E0E59"
    }
  ]
  ```

- **Error Response**
  ```json
  {
    "error": "Failed to fetch events"
  }
  ```

---

# 🚀 Additional Information

### 📌 Authentication (JWT Token)

- **Endpoints requiring authentication:**
  - `GET /user/profile`
  - `POST /user/profile`
- **To authenticate, add `Authorization: Bearer YOUR_JWT_TOKEN` in the request header.**
- **JWT Token can be obtained by logging in (`POST /user/login`).**

### 📌 Environment Variables (`.env.local`)

```env
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=SmartBookingDatabase
SECRET_KEY=your_secret_key
EVENT_API_KEY=your_ticketmaster_api_key
```

✅ **Ensure these environment variables are set in `.env.local` for the project to function properly.**
