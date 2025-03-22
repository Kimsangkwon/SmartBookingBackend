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

## 📌 7️⃣ Get Concerts

### 🔹 `GET /concerts`

- **Description:** Retrieves concerts from the Ticketmaster API based on filters such as city, date range, genre, and keyword (artist, event name, or venue) and also retrieves most relevent concerts.

- **Request Example**

  ```http
  GET /api/concerts?city=Toronto&startDate=2025-06-01&endDate=2025-06-30&genre=Rock&keyword=Coldplay
  ```

- **Query Parameters (Optional)**
  | Parameter | Type | Description |
  |--------------|--------|-------------|
  | `city` | String | Filters concerts by a specific city (e.g., `Toronto`) |
  | `startDate` | String | Filters concerts starting from this date (`YYYY-MM-DD`) |
  | `endDate` | String | Filters concerts up to this date (`YYYY-MM-DD`) |
  | `genre` | String | Filters concerts by music genre (e.g., `Rock`, `Pop`) |
  | `keyword` | String | Filters concerts by artist, event name, or venue |

---

- **Success Response**

  ```json
  {
    "concerts": [
      {
        "id": "12345",
        "date": "2025-06-18",
        "dayOfWeek": "Wednesday",
        "time": "19:30:00",
        "name": "Coldplay World Tour",
        "city": "Toronto",
        "state": "Ontario",
        "venue": "Rogers Centre",
        "image": "https://someimage.com/coldplay.jpg"
      },
      {
        "id": "67890",
        "date": "2025-06-22",
        "dayOfWeek": "Sunday",
        "time": "20:00:00",
        "name": "Imagine Dragons Live",
        "city": "Toronto",
        "state": "Ontario",
        "venue": "Scotiabank Arena",
        "image": "https://someimage.com/imaginedragons.jpg"
      }
    ],
    "mostViewedConcertEvents": [
      {
        "id": "1A9ZkkeGkd1Zepn",
        "date": "2025-04-04",
        "dayOfWeek": "Thursday",
        "time": "20:30:00",
        "name": "Eagles Live at the Sphere - Suite Reservation",
        "city": "Las Vegas",
        "state": "Nevada",
        "venue": "Sphere",
        "image": "https://s1.ticketm.net/dam/a/71d/ad124f24-1532-4dae-937f-d32c3340471d_SOURCE"
      },
      {
        "id": "1kAYv-4bGACQ-mL",
        "date": "2025-04-04",
        "dayOfWeek": "Thursday",
        "time": "20:30:00",
        "name": "Eagles Live at Sphere",
        "city": "Las Vegas",
        "state": "Nevada",
        "venue": "Sphere",
        "image": "https://s1.ticketm.net/dam/a/71d/ad124f24-1532-4dae-937f-d32c3340471d_SOURCE"
      },
      {
        "id": "1A9ZkA4GkexSvWw",
        "date": "2025-04-05",
        "dayOfWeek": "Friday",
        "time": "20:30:00",
        "name": "Eagles Live at Sphere",
        "city": "Las Vegas",
        "state": "Nevada",
        "venue": "Sphere",
        "image": "https://s1.ticketm.net/dam/a/71d/ad124f24-1532-4dae-937f-d32c3340471d_SOURCE"
      },
      {
        "id": "1A9ZkkeGkd1Z3pR",
        "date": "2025-04-05",
        "dayOfWeek": "Friday",
        "time": "20:30:00",
        "name": "Eagles Live at the Sphere - Suite Reservation",
        "city": "Las Vegas",
        "state": "Nevada",
        "venue": "Sphere",
        "image": "https://s1.ticketm.net/dam/a/71d/ad124f24-1532-4dae-937f-d32c3340471d_SOURCE"
      }
    ]
  }
  ```

- **Error Response**
  ```json
  {
    "error": "Failed to fetch concerts"
  }
  ```

## 📌 8️⃣ Get Sports

### 🔹 `GET /sports`

- **Description:** Retrieves sports events from the Ticketmaster API based on filters such as city, date range, sport type, and keyword (team, event name, or venue).

- **Request Example**

  ```http
  GET /api/sports?city=Toronto&startDate=2025-06-01&endDate=2025-06-30&sportType=Basketball&keyword=Raptors
  ```

- **Query Parameters (Optional)**
  | Parameter | Type | Description |
  |--------------|--------|-------------|
  | `city` | String | Filters sports events by a specific city (e.g., `Toronto`) |
  | `startDate` | String | Filters sports events starting from this date (`YYYY-MM-DD`) |
  | `endDate` | String | Filters sports events up to this date (`YYYY-MM-DD`) |
  | `sportType` | String | Filters sports events by type (e.g., `Basketball`, `Soccer`) |
  | `keyword` | String | Filters sports events by team name, event name, or venue |

  **Request Example**

  ```http
  GET /sports
  ```

- **Success Response**

  ```json
  {
  "sports": {
          "sportsEvents": [
              {
                  "id": "G5viZbaMNbUUf",
                  "date": "2024-08-25",
                  "dayOfWeek": "Saturday",
                  "time": "13:00:00",
                  "name": "Preseason Game: New Orleans Saints v Tennessee Titans",
                  "city": "New Orleans",
                  "state": "Louisiana",
                  "venue": "Caesars Superdome ",
                  "image": "https://s1.ticketm.net/dam/a/86d/0dcfe694-65df-44e1-bb73-0263fdb7f86d_1325401_ARTIST_PAGE_3_2.jpg"
              },
              {
                  "id": "G5eVZb22k9bRL",
                  "date": "2024-09-29",
                  "dayOfWeek": "Saturday",
                  "time": "19:00:00",
                  "name": "TNA Wrestling",
                  "city": "Spartanburg",
                  "state": "South Carolina",
                  "venue": "The Hall at Spartanburg Memorial Auditorium",
                  "image": "https://s1.ticketm.net/dam/a/d79/a9f3194a-e475-4427-8bd9-ca935236ed79_RETINA_PORTRAIT_16_9.jpg"
              },
    ],
    "mostViewedSportEvent": [
            {
                "id": "G5vYZb2n_2V2d",
                "date": "2025-04-13",
                "dayOfWeek": "Saturday",
                "time": "12:30:00",
                "name": "SACRAMENTO KINGS VS. PHOENIX SUNS",
                "city": "Sacramento",
                "state": "California",
                "venue": "Golden 1 Center",
                "image": "https://s1.ticketm.net/dam/a/022/6fdae8b5-6fa8-4793-8829-edef2a77a022_1339671_RETINA_PORTRAIT_3_2.jpg"
            },
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

## 📌 9️⃣ Get Others

### 🔹 `GET /others`

- **Description:**  
  Retrieves events that do not fall under a specific classification, allowing users to filter out unwanted event categories.

- **Query Parameters (Optional)**
  | Parameter | Type | Description |
  |---------------------|--------|-----------------------------------------------------------|
  | `classificationName` | String | Excludes events matching this classification (e.g., `Sports`, `Music`). |
  | `city` | String | Filters sports events by a specific city (e.g., `Toronto`) |
  | `startDate` | String | Filters sports events starting from this date (`YYYY-MM-DD`) |
  | `endDate` | String | Filters sports events up to this date (`YYYY-MM-DD`) |
  | `sportType` | String | Filters sports events by type (e.g., `Basketball`, `Soccer`) |
  | `keyword` | String | Filters sports events by team name, event name, or venue |

- **Request Example**

  ```http
  GET /others?classificationName=Comedy
  ```

- **Success Response**

  ```json
  {
    "events": [
      {
        "id": "1Ad0ZbKGkR7vgsC",
        "date": "2024-07-01",
        "dayOfWeek": "Sunday",
        "time": "10:00:00",
        "name": "Jimmy Kimmel's Comedy Club Ticket + Hotel Deals",
        "city": "Las Vegas",
        "state": "Nevada",
        "venue": "Jimmy Kimmel's Comedy Club",
        "image": "https://s1.ticketm.net/dam/a/b46/00337dcc-5bd1-4b00-816c-491561ad4b46_RETINA_PORTRAIT_16_9.jpg",
        "classificationName": "Arts & Theatre - Comedy - Comedy"
      }
    ],
    "mostViewedOtherEvent": [
      {
        "id": "1A_Zk7JGkeg1dxD",
        "date": "2025-03-28",
        "dayOfWeek": "Thursday",
        "time": "19:30:00",
        "name": "Jerry Seinfeld And Jim Gaffigan",
        "city": "Phoenix",
        "state": "Arizona",
        "venue": "PHX Arena (formerly Footprint Center)",
        "image": "https://s1.ticketm.net/dam/a/c01/09403b0b-95e2-49e2-a310-9d586a455c01_EVENT_DETAIL_PAGE_16_9.jpg",
        "classificationName": "Arts & Theatre"
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

## 📌 🔟 Get Event Details

### 🔹 `GET /eventDetail/:eventId`

- **Description:**  
  Retrieves detailed information about a specific event using its `eventId`.

- **Path Parameters**
  | Parameter | Type | Description |
  |-----------|--------|---------------------------------|
  | `eventId` | String | The unique ID of the event. |

- **Request Example**

  ```http
  GET /eventDetail/1A8ZkFJGkdjgopg
  ```

- **Success Response**(for now it is retreiving raw data)

  ```json
  {
    "eventData": {
        "name": "The Musical Box - 50th Anniversary Of Selling England By The Pound",
        "type": "event",
        "id": "1A8ZkFJGkdjgopg",
        "test": false,
        "url": "https://www.ticketmaster.ca/the-musical-box-50th-anniversary-of-toronto-ontario-05-31-2025/event/10006226DCD515B5",
        "locale": "en-us",
        "images": [
            {
                "ratio": "3_2",
                "url": "https://s1.ticketm.net/dam/a/0b7/c373ca90-c06b-45c0-b085-983181cbf0b7_TABLET_LANDSCAPE_3_2.jpg",
                "width": 1024,
                "height": 683,
                "fallback": false
            },
            {
                "ratio": "3_2",
                "url": "https://s1.ticketm.net/dam/a/0b7/c373ca90-c06b-45c0-b085-983181cbf0b7_ARTIST_PAGE_3_2.jpg",
                "width": 305,
                "height": 203,
                "fallback": false
            },
  ```

- **Error Response**

  ```json
  {
    "error": "Event not found"
  }
  ```

  **Note:** If an invalid or non-existent `eventId` is used, a `404 Not Found` response will be returned.

---

- **Success Response**

  ```json
  {
    "sports": [
      {
        "id": "78901",
        "date": "2025-07-05",
        "dayOfWeek": "Saturday",
        "time": "15:00:00",
        "name": "Toronto Raptors vs Lakers",
        "city": "Toronto",
        "state": "Ontario",
        "venue": "Scotiabank Arena",
        "image": "https://someimage.com/raptors-vs-lakers.jpg"
      },
      {
        "id": "89012",
        "date": "2025-07-10",
        "dayOfWeek": "Thursday",
        "time": "19:00:00",
        "name": "Blue Jays vs Yankees",
        "city": "Toronto",
        "state": "Ontario",
        "venue": "Rogers Centre",
        "image": "https://someimage.com/bluejays-vs-yankees.jpg"
      }
    ]
  }
  ```

- **Error Response**
  ```json
  {
    "error": "Failed to fetch sports events"
  }
  ```

---

## 📌 1️⃣1️⃣ Wishlist (Requires Authentication)

### 🔹 `POST /wishlist`

- **Description:**  
  Adds an event to the logged-in user's wishlist.

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Request Body (JSON)**

  ```json
  {
    "eventId": "1A9ZkkeGkd1Zepn",
    "name": "Eagles Live at the Sphere",
    "date": "2025-04-04",
    "image": "https://someimage.com/eagles.jpg",
    "venue": "Sphere"
  }
  ```

- **Success Response**

  ```json
  {
    "message": "Event added to wishlist",
    "wishlist": {
      "_id": "65ff2e9307ddc42bfa877534",
      "userId": "65f1d1d6a8a3f2b3c3f9e7b2",
      "eventId": "1A9ZkkeGkd1Zepn",
      "name": "Eagles Live at the Sphere",
      "date": "2025-04-04",
      "image": "https://someimage.com/eagles.jpg",
      "venue": "Sphere",
      "addAt": "2025-03-20T18:01:55.711Z",
      "__v": 0
    }
  }
  ```

- **Error Response (Unauthorized)**
  ```json
  {
    "message": "No token provided"
  }
  ```

---

### 🔹 `GET /wishlist`

- **Description:**  
  Retrieves all wishlist items for the authenticated user.

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Success Response**

  ```json
  {
    "wishlist": [
      {
        "_id": "65ff2e9307ddc42bfa877534",
        "userId": "65f1d1d6a8a3f2b3c3f9e7b2",
        "eventId": "1A9ZkkeGkd1Zepn",
        "name": "Eagles Live at the Sphere",
        "date": "2025-04-04",
        "image": "https://someimage.com/eagles.jpg",
        "venue": "Sphere",
        "addAt": "2025-03-20T18:01:55.711Z",
        "__v": 0
      }
    ]
  }
  ```

- **Error Response (Unauthorized)**
  ```json
  {
    "message": "No token provided"
  }
  ```

---

### 🔹 `DELETE /wishlist/:eventId`

- **Description:**  
  Removes an event from the user's wishlist using the eventId.

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Request Example**

  ```http
  DELETE /wishlist/1A9ZkkeGkd1Zepn
  ```

- **Success Response**

  ```json
  {
    "message": "Event removed from wishlist"
  }
  ```

- **Error Response (Not Found)**
  ```json
  {
    "message": "Event not found in wishlist"
  }
  ```

---

📌 **Note:**  
All wishlist operations require the user to be authenticated. The `userId` is automatically extracted from the JWT token and does not need to be provided manually in the request body.

---

## 📌 1️⃣2️⃣ Billing Information (Requires Authentication)

### 🔹 `POST /billing`

- **Description:**  
  Creates a new billing information entry for the authenticated user.

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Request Body (JSON)**

  ```json
  {
    "nameOnCard": "John Doe",
    "cardNumber": "1234567812345678",
    "expirationDate": "2026-08",
    "country": "Canada",
    "addressLine1": "123 Billing St",
    "addressLine2": "Apt 202",
    "city": "Toronto",
    "province": "Ontario",
    "postalCode": "M5G2C3",
    "phoneNumber": "123-456-7890"
  }
  ```

- **Success Response**
  ```json
  {
    "message": "Billing info created successfully",
    "billing": {
      "_id": "66004e12db4b5f87af63fa1a",
      "userId": "65f1d1d6a8a3f2b3c3f9e7b2",
      "nameOnCard": "John Doe",
      "cardNumber": "1234567812345678",
      "expirationDate": "2026-08",
      "country": "Canada",
      "addressLine1": "123 Billing St",
      "addressLine2": "Apt 202",
      "city": "Toronto",
      "province": "Ontario",
      "postalCode": "M5G2C3",
      "phoneNumber": "123-456-7890"
    }
  }
  ```

---

### 🔹 `GET /billing`

- **Description:**  
  Retrieves all billing cards for the authenticated user (with card number partially masked).

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Success Response**
  ```json
  {
    "billingInfos": [
      {
        "_id": "66004e12db4b5f87af63fa1a",
        "nameOnCard": "John Doe",
        "cardNumber": "**** **** **** 5678",
        "expirationDate": "2026-08"
      }
    ]
  }
  ```

---

### 🔹 `PUT /billing/:cardId`

- **Description:**  
  Updates billing info for the specified card.

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Request Body (Partial or Full Update)**

  ```json
  {
    "phoneNumber": "987-654-3210"
  }
  ```

- **Success Response**
  ```json
  {
    "message": "Billing info updated successfully",
    "billing": {
      "_id": "66004e12db4b5f87af63fa1a",
      ...
    }
  }
  ```

---

### 🔹 `DELETE /billing/:cardId`

- **Description:**  
  Deletes the billing information by card ID.

- **Headers**

  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Success Response**
  ```json
  {
    "message": "Billing info deleted successfully"
  }
  ```

---

📌 **Note:**

- All billing operations require the user to be authenticated.
- The `userId` is automatically extracted from the JWT token.
- Card numbers are stored securely and returned only in a masked format during read operations.

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
