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

## 📌 5️⃣ Get Events List

### 🔹 `GET /events/list`

- **Description:** Fetches a list of events from the Ticketmaster API.
- **Query Parameters (Optional)**
  - `city`: City (Default: `Toronto`)
  - `country`: Country Code (Default: `CA`)
  - `keyword`: Search keyword (Default: `""`)
  - `page`: Page number (Default: `0`)
- **Request Example**
  ```http
  GET /events/list?city=Toronto&country=CA&keyword=concert&page=1
  ```
- **Success Response**
  ```json
  [
    {
      "id": "1A2B3C",
      "name": "Music Festival 2025",
      "date": "2025-07-12",
      "time": "19:00",
      "venue": "Toronto Music Hall",
      "city": "Toronto",
      "country": "Canada",
      "image": "https://eventimage.com/example.jpg",
      "url": "https://ticketmaster.com/event/1A2B3C"
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
