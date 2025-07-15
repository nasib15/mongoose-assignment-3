# Library Management System API

A REST API for managing a library system built with Node.js, Express.js, MongoDB, Mongoose and TypeScript. This system allows you to manage books and handle book borrowing operations.

## 🚀 Features

- **Book Management**: Create, read, update, and delete books
- **Borrowing System**: Track book borrowing with quantity and due dates
- **Data Validation**: Robust input validation using Zod
- **MongoDB Integration**: Persistent data storage with Mongoose
- **TypeScript**: Full type safety and modern JavaScript features

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [npm](https://www.npmjs.com/)

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/nasib15/mongoose-assignment-3.git
   cd mongoose-assignment-3
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory and add your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.talr0yk.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=Cluster0
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "error": object (only present if success is false)
}
```

---

## 📖 Book Management APIs

### 1. Create a Book

**POST** `/api/books`

Creates a new book in the library.

**Request Body:**

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "FICTION",
  "isbn": "9780743273565",
  "description": "A classic American novel set in the Jazz Age",
  "copies": 5,
  "available": true
}
```

**Field Validations:**

- `title`: String, minimum 3 characters (required)
- `author`: String, minimum 3 characters (required)
- `genre`: Enum - `"FICTION"` | `"NON_FICTION"` | `"SCIENCE"` | `"HISTORY"` | `"BIOGRAPHY"` | `"FANTASY"` (default: "FICTION")
- `isbn`: String, minimum 10 characters, must be unique (required)
- `description`: String, minimum 10 characters (required)
- `copies`: Number, minimum 1 (required)
- `available`: Boolean (default: true)

**Response (201):**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "647a1234567890abcdef1234",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "FICTION",
    "isbn": "9780743273565",
    "description": "A classic American novel set in the Jazz Age",
    "copies": 5,
    "available": true,
    "createdAt": "2023-06-02T10:30:00.000Z",
    "updatedAt": "2023-06-02T10:30:00.000Z"
  }
}
```

### 2. Get All Books

**GET** `/api/books`

Retrieves all books with optional filtering and sorting.

**Query Parameters:**

- `filter`: Filter by genre (optional)
- `sort`: Sort order - `"asc"` or `"desc"` (default: "asc")
- `sortBy`: Sort field - any book field (default: "createdAt")
- `limit`: Number of books to return (default: "10")

**Examples:**

```bash
# Get all books
GET /api/books

# Filter by genre
GET /api/books?filter=FICTION

# Sort by title in descending order
GET /api/books?sortBy=title&sort=desc

# Limit results and sort by author
GET /api/books?limit=5&sortBy=author&sort=asc
```

**Response (200):**

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "647a1234567890abcdef1234",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "FICTION",
      "isbn": "9780743273565",
      "description": "A classic American novel set in the Jazz Age",
      "copies": 5,
      "available": true,
      "createdAt": "2023-06-02T10:30:00.000Z",
      "updatedAt": "2023-06-02T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Book

**GET** `/api/books/:id`

Retrieves a specific book by its ID.

**Parameters:**

- `id`: MongoDB ObjectId of the book

**Response (200):**

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "647a1234567890abcdef1234",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "FICTION",
    "isbn": "9780743273565",
    "description": "A classic American novel set in the Jazz Age",
    "copies": 5,
    "available": true,
    "createdAt": "2023-06-02T10:30:00.000Z",
    "updatedAt": "2023-06-02T10:30:00.000Z"
  }
}
```

### 4. Update Book Copies

**PUT** `/api/books/:bookId`

Updates the number of copies for a specific book.

**Parameters:**

- `bookId`: MongoDB ObjectId of the book

**Request Body:**

```json
{
  "copies": 10
}
```

**Field Validations:**

- `copies`: Number, minimum 1 (required)

**Response (201):**

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "647a1234567890abcdef1234",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "FICTION",
    "isbn": "9780743273565",
    "description": "A classic American novel set in the Jazz Age",
    "copies": 10,
    "available": true,
    "createdAt": "2023-06-02T10:30:00.000Z",
    "updatedAt": "2023-06-02T12:45:00.000Z"
  }
}
```

### 5. Delete Book

**DELETE** `/api/books/:bookId`

Deletes a specific book from the library.

**Parameters:**

- `bookId`: MongoDB ObjectId of the book

**Response (200):**

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

---

## 🔄 Borrowing System APIs

### 1. Borrow a Book

**POST** `/api/borrow`

Creates a new book borrowing record and decreases available copies.

**Request Body:**

```json
{
  "book": "647a1234567890abcdef1234",
  "quantity": 2,
  "dueDate": "2023-07-15T23:59:59.000Z"
}
```

**Field Validations:**

- `book`: String, must be a valid 24-character MongoDB ObjectId (required)
- `quantity`: Number, minimum 1 (required)
- `dueDate`: ISO 8601 datetime string with timezone offset (required)

**Business Logic:**

- Checks if requested quantity is available
- Decreases book copies by borrowed quantity
- Sets book availability to false if no copies remain
- Creates borrowing record

**Response (201):**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "647b5678901234567890abcd",
    "book": "647a1234567890abcdef1234",
    "quantity": 2,
    "dueDate": "2023-07-15T23:59:59.000Z",
    "createdAt": "2023-06-02T14:30:00.000Z",
    "updatedAt": "2023-06-02T14:30:00.000Z"
  }
}
```

**Error Response (400) - Insufficient Copies:**

```json
{
  "success": false,
  "message": "The requested quantity is bigger than the available copies"
}
```

### 2. Get Borrowing Summary

**GET** `/api/borrow`

Retrieves a summary of all borrowed books grouped by book with total quantities.

**Response (200):**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Great Gatsby",
        "isbn": "9780743273565"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "To Kill a Mockingbird",
        "isbn": "9780061120084"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## 🗂️ Data Models

### Book Schema

```typescript
interface IBook {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string; // unique
  description: string;
  copies: number;
  available: boolean;
}
```

### Borrow Schema

```typescript
interface IBorrow {
  book: ObjectId; // Reference to Book
  quantity: number;
  dueDate: Date;
}
```

---

## 🛡️ Error Handling

The API includes comprehensive error handling:

### Common HTTP Status Codes

- `200`: Success (GET, DELETE)
- `201`: Created successfully (POST, PUT)
- `400`: Bad Request (validation errors, business logic errors)
- `404`: Not Found (invalid endpoints)
- `500`: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    // Detailed error information
  }
}
```

---

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with hot reload

### Project Structure

```
src/
├── app/
│   ├── controllers/      # Route handlers
│   │   ├── book.controller.ts
│   │   └── borrow.controller.ts
│   ├── interfaces/       # TypeScript interfaces
│   │   ├── books.interfaces.ts
│   │   └── borrow.interfaces.ts
│   └── models/          # Mongoose schemas
│       ├── books.model.ts
│       └── borrow.model.ts
├── app.ts              # Express app configuration
└── server.ts           # Server startup
```

### Technologies Used

- **Node.js & Express.js**: Backend framework
- **TypeScript**: Type safety and modern JavaScript
- **MongoDB & Mongoose**: Database and ODM
- **Zod**: Runtime type validation
- **dotenv**: Environment variable management

---

## 📝 Testing the API

You can test the API using tools like:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
