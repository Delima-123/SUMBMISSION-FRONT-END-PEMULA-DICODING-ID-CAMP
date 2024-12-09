document.addEventListener('DOMContentLoaded', (event) => {
  const bookForm = document.getElementById('bookForm');
  const bookFormTitle = document.getElementById('bookFormTitle');
  const bookFormAuthor = document.getElementById('bookFormAuthor');
  const bookFormYear = document.getElementById('bookFormYear');
  const bookFormIsComplete = document.getElementById('bookFormIsComplete');
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  const searchBook = document.getElementById('searchBook');
  const searchBookTitle = document.getElementById('searchBookTitle');

  const BOOKS_KEY = 'BOOKS_APP';

  let books = [];

  function loadBooksFromLocalStorage() {
    const serializedData = localStorage.getItem(BOOKS_KEY);
    if (serializedData !== null) {
      books = JSON.parse(serializedData);
    }

    renderBooks();
  }

  function saveBooksToLocalStorage() {
    const serializedData = JSON.stringify(books);
    localStorage.setItem(BOOKS_KEY, serializedData);
  }

  function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    const bookTitle = document.createElement('h3');
    bookTitle.textContent = book.title;
    bookTitle.setAttribute('data-testid', 'bookItemTitle');

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Penulis: ${book.author}`;
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

    const bookYear = document.createElement('p');
    bookYear.textContent = `Tahun: ${book.year}`;
    bookYear.setAttribute('data-testid', 'bookItemYear');

    const buttonContainer = document.createElement('div');

    const toggleCompleteButton = document.createElement('button');
    toggleCompleteButton.textContent = book.isComplete ? 'Belum Selesai' : 'Selesai dibaca';
    toggleCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleCompleteButton.addEventListener('click', () => {
      toggleBookComplete(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus Buku';
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.addEventListener('click', () => {
      deleteBook(book.id);
    });

    buttonContainer.appendChild(toggleCompleteButton);
    buttonContainer.appendChild(deleteButton);

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);
    bookItem.appendChild(buttonContainer);

    return bookItem;
  }

  function renderBooks() {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function addBook(book) {
    books.push(book);
    saveBooksToLocalStorage();
    renderBooks();
  }

  function deleteBook(bookId) {
    books = books.filter(book => book.id !== bookId);
    saveBooksToLocalStorage();
    renderBooks();
  }

  function toggleBookComplete(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage();
      renderBooks();
    }
  }

  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newBook = {
      id: +new Date(),
      title: bookFormTitle.value,
      author: bookFormAuthor.value,
      year: parseInt(bookFormYear.value, 10), // Konversi ke number
      isComplete: bookFormIsComplete.checked
    };

    addBook(newBook);

    bookFormTitle.value = '';
    bookFormAuthor.value = '';
    bookFormYear.value = '';
    bookFormIsComplete.checked = false;
  });

  searchBook.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchText = searchBookTitle.value.toLowerCase();
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchText));

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  });

  loadBooksFromLocalStorage();
});
