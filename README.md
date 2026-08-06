# 🌍 MandalGo

### Explore the World. Discover Places. Plan Your Journey.

MandalGo is a full-stack travel discovery and booking platform designed to make
travel planning easier and more convenient.

Users can explore destinations around the world, discover different types of
accommodations and tourist places, view detailed listing information, and
manage travel listings through a clean and responsive interface.

---

## ✈️ About MandalGo

Travel planning often requires searching through multiple platforms to find
hotels, resorts, villas, tourist attractions, and other places to stay or
visit.

**MandalGo** aims to bring these travel services together in one platform.

The platform allows users to discover places around the world and explore
different accommodation and travel options such as:

- 🏨 Hotels
- 🏝️ Resorts
- 🏡 Villas
- 🏢 Apartments
- 🏠 Guesthouses
- 🛏️ Hostels
- 🏛️ Tourist Places

MandalGo is designed to become a convenient platform for discovering
destinations and planning future trips.

---

## 🚀 Features

### 🌍 Explore Destinations

Discover travel listings from different locations and countries around the
world.

### 🔎 Search & Discover

Explore available travel listings and find suitable places for your trip.

### 🏨 Multiple Accommodation Types

Listings can be categorized into:

- Hotel
- Villa
- Apartment
- Resort
- Guesthouse
- Hostel
- Tourist Place

### 📋 Listing Details

Each listing provides information such as:

- Title
- Description
- Image
- Price
- Location
- Country
- Category
- Rating

### ➕ Add Listing

Users can create new travel listings.

### ✏️ Edit Listing

Existing listings can be updated when information changes.

### 🗑️ Delete Listing

Listings can be removed when they are no longer needed.

### ⭐ Ratings

Listings can display ratings to help users understand the quality of a place.

### 📱 Responsive Design

The interface is designed to work across desktop and mobile screen sizes.

### 🧩 Reusable EJS Components

Common UI elements such as the navbar and footer are separated into reusable
EJS components.

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- EJS
- Responsive Web Design

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Other Technologies

- Method Override
- RESTful Routing
- EJS Partials

---

## 📂 Project Structure

```text
MandalGo/
│
├── app.js
│
├── package.json
├── package-lock.json
│
├── models/
│   └── listing.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   └── images/
│       └── mandalgo-logo.png
│
├── views/
│   │
│   ├── includes/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   │
│   └── listing/
│       ├── index.ejs
│       ├── show.ejs
│       ├── new.ejs
│       └── edit.ejs
│
└── README.md