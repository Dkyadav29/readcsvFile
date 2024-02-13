const cookie = require("cookies");

const csv = require("csv-parser");
const secretKey = "dbhfdghfgjghhjhgkjh,hkjhkjkjhk";

const regularUserFile = "regularUser.csv";
const adminUserFile = "adminUser.csv";
const jwt = require("jsonwebtoken");
const users = {
  admin: { password: "dablu1", role: "admin" },
  user1: { password: "dablu123", role: "regular" },
};

const userController = (req, res) => {
  const { username, password } = req.body;

  if (!(username in users) || users[username].password !== password) {
    return res.status(401).json({ msg: "Invalid username or password" });
  }

  // Create JWT token
  const accessToken = jwt.sign(
    { username, role: users[username].role },
    secretKey
  );
  res.cookie("cookie", accessToken, { httpOnly: true });
  res.json({ accessToken });
  console.log(`jwt token ${accessToken}`);
};

// home
const homeController = (req, res) => {
  let bookList = [];

  if (req.user.role === "admin") {
    // Read books from both admin and regular user files
    bookList = readBooksFromFile(adminUserFile).concat(
      readBooksFromFile(regularUserFile)
    );
  } else if (req.user.role === "regular") {
    // Read books only from the regular user file
    bookList = readBooksFromFile(regularUserFile);
  }

  res.json({ books: bookList });
};

const bookController = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admins only! Forbidden" });
  }

  const { bookName, author, publicationYear } = req.body;

  // Validate parameters
  if (
    !isString(bookName) ||
    !isString(author) ||
    !isValidYear(publicationYear)
  ) {
    return res.status(400).json({ msg: "Invalid parameters" });
  }

  // Add the new book to the regular user file
  const newBook = `${bookName},${author},${publicationYear}`;
  fs.appendFileSync(regularUserFile, `\n${newBook}`);

  res.json({ msg: "Book added successfully" });
};

const deleteBookController = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admins only! Forbidden" });
  }

  const { bookName } = req.body;

  // Validate parameters
  if (!isString(bookName)) {
    return res.status(400).json({ msg: "Invalid parameters" });
  }

  // Delete the book from the regular user file
  const books = readBooksFromFile(regularUserFile);
  const updatedBooks = books.filter(
    (book) => !book.toLowerCase().includes(bookName.toLowerCase())
  );
  fs.writeFileSync(regularUserFile, updatedBooks.join("\n"));

  res.json({ msg: "Book deleted successfully" });
};

// Helper function to read books from a CSV file
function readBooksFromFile(fileName) {
  try {
    const fileContent = fs.readFileSync(fileName, "utf-8");
    return fileContent.trim().split("\n");
  } catch (error) {
    return [];
  }
}

module.exports = {
  userController,
  homeController,
  bookController,
  deleteBookController,
};
