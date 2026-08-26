# 🌍 MandalGo

### Explore the World. Discover Places. Plan Your Journey.

MandalGo is a full-stack travel discovery and listing platform built with Node.js, Express.js, MongoDB, Mongoose, and EJS. It allows users to explore travel destinations, view detailed listings, create their own listings, manage listings they own, and share reviews with their actual user identity.

---

## ✈️ About MandalGo

MandalGo is designed to make travel discovery simple and convenient by bringing different types of travel stays and tourist destinations into one platform.

Users can explore:

- 🏨 Hotels
- 🏝️ Resorts
- 🏡 Villas
- 🏢 Apartments
- 🏠 Guesthouses
- 🛏️ Hostels
- 🏛️ Tourist Places

Users can also create an account, log in, create travel listings, manage their own listings, and add reviews and ratings to places.

---

# 🚀 Features

### 🌍 Explore Destinations

Browse travel listings from different locations and countries.

### 🔎 Search & Discover

Explore available listings and find suitable places for your journey.

### 🏨 Multiple Listing Categories

Listings can be categorized as:

- Hotel
- Resort
- Villa
- Apartment
- Guesthouse
- Hostel
- Tourist Place

### 📋 Listing Details

Each listing contains:

- Title
- Description
- Image
- Price
- Location
- Country
- Category
- Rating
- Owner

### 🔐 User Authentication

Users can:

- Create an account
- Log in
- Log out
- Access protected features

Authentication is implemented using Passport.js and sessions.

### ➕ Create Listing

Only authenticated users can create new travel listings.

Each listing is automatically associated with the logged-in user.

### ✏️ Edit Listing

Users can edit only the listings they own.

### 🗑️ Delete Listing

Users can delete only their own listings.

Ownership is verified using authorization middleware.

### ⭐ Reviews & Ratings

Authenticated users can submit reviews and ratings for listings.

Each review stores the actual logged-in user's ID as its author.

Reviews display:

- Username
- User avatar initial
- Rating
- Comment
- Review date

### 🗑️ Review Authorization

Only the user who created a review can see the delete option for that review.

Review ownership is checked using the authenticated user's ID.

### 🔄 Login Redirect

When a user tries to access a protected page without logging in, MandalGo remembers the requested page.

After successful login, the user is redirected back to the page they originally wanted to access.

```text
Create Listing
      ↓
Login Required
      ↓
Login Page
      ↓
Successful Login
      ↓
Create Listing Page

### 📂 Project Structure
MandalGo/
│
├── app.js
├── middleware.js
├── package.json
├── package-lock.json
├── README.md
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── navbar.css
│   │   ├── listing.css
│   │   └── review.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── images/
│       ├── mandalgo-logo.png
│       ├── hero1.jpg
│       ├── hero2.jpg
│       ├── hero3.jpg
│       ├── hero4.jpg
│       └── hero5.jpg
│
├── views/
│   │
│   ├── includes/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── review_form.ejs
│   │
│   ├── listing/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   │
│   └── users/
│       ├── login.ejs
│       └── signup.ejs
│
├── init/
│   ├── data.js
│   └── index.js
│
└── .env

### 🛠️ Technologies Used
# Frontend
HTML5
CSS3
JavaScript
EJS
Responsive Web Design
# Backend
Node.js
Express.js
Passport.js
Passport-Local
Express Session
Database
MongoDB
Mongoose
Validation & Middleware
# Joi
Custom Express Middleware
Method Override
RESTful Routing
# Other
Flash Messages
EJS Partials
git & github