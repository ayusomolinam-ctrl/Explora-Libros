"use strict";

const API_URL = "https://openlibrary.org/search.json";
const MAX_RESULTS = 12;

const searchForm = document.querySelector("#book-search-form");
const searchInput = document.querySelector("#book-search-input");
const searchButton = searchForm.querySelector('button[type="submit"]');
const userMessage = document.querySelector("#user-message");
const bookResults = document.querySelector("#book-results");

const originalButtonText = searchButton.textContent;
let isSearching = false;

class HttpError extends Error {
  constructor(status) {
    super(`La API respondió con el código HTTP ${status}.`);
    this.name = "HttpError";
    this.status = status;
  }
}

function showMessage(text, type = "info") {
  userMessage.textContent = text;
  userMessage.classList.remove("info", "error");
  userMessage.classList.add(type);
}

function setSearchingState(searching) {
  isSearching = searching;
  searchButton.disabled = searching;
  searchButton.textContent = searching ? "Buscando..." : originalButtonText;
  searchForm.setAttribute("aria-busy", String(searching));
  bookResults.setAttribute("aria-busy", String(searching));
}

function createFallbackCover(title) {
  const fallbackCover = document.createElement("div");
  fallbackCover.className = "book-cover";
  fallbackCover.setAttribute("role", "img");
  fallbackCover.setAttribute(
    "aria-label",
    `Portada no disponible para ${title}`
  );
  fallbackCover.textContent = "Portada no disponible";

  return fallbackCover;
}

function createBookCover(book, title) {
  const coverId = Number(book.cover_i);

  if (!Number.isFinite(coverId)) {
    return createFallbackCover(title);
  }

  const cover = document.createElement("img");
  cover.className = "book-cover";
  cover.src = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  cover.alt = `Portada de ${title}`;
  cover.loading = "lazy";
  cover.decoding = "async";

  cover.addEventListener(
    "error",
    () => {
      cover.replaceWith(createFallbackCover(title));
    },
    { once: true }
  );

  return cover;
}

function getValidWorkId(key) {
  if (typeof key !== "string") {
    return null;
  }

  const match = key.trim().match(/^(?:\/works\/)?(OL\d+W)$/);
  return match ? match[1] : null;
}

function createBookLink(key, title) {
  const workId = getValidWorkId(key);

  if (!workId) {
    const unavailableText = document.createElement("p");
    unavailableText.className = "book-link-unavailable";
    unavailableText.textContent = "Ficha no disponible";
    return unavailableText;
  }

  const bookLink = document.createElement("a");
  bookLink.className = "book-link";
  bookLink.href = `https://openlibrary.org/works/${workId}`;
  bookLink.target = "_blank";
  bookLink.rel = "noopener noreferrer";
  bookLink.textContent = "Ver libro";
  bookLink.setAttribute(
    "aria-label",
    `Ver la ficha de ${title} en Open Library (abre en una pestaña nueva)`
  );

  return bookLink;
}

function createBookCard(book) {
  const title =
    typeof book.title === "string" && book.title.trim()
      ? book.title.trim()
      : "Título no disponible";

  const authors = Array.isArray(book.author_name)
    ? book.author_name.filter(
        (author) => typeof author === "string" && author.trim()
      )
    : [];

  const authorText = authors.length
    ? authors.join(", ")
    : "Autor no disponible";

  const yearText = book.first_publish_year
    ? String(book.first_publish_year)
    : "Año no disponible";

  const card = document.createElement("article");
  card.className = "book-card";

  const bookInfo = document.createElement("div");
  bookInfo.className = "book-info";

  const bookTitle = document.createElement("h3");
  bookTitle.className = "book-title";
  bookTitle.textContent = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.className = "book-author";
  bookAuthor.textContent = `Autor: ${authorText}`;

  const bookYear = document.createElement("p");
  bookYear.className = "book-year";
  bookYear.textContent = `Primera publicación: ${yearText}`;

  const bookLink = createBookLink(book.key, title);

  bookInfo.append(bookTitle, bookAuthor, bookYear, bookLink);
  card.append(createBookCover(book, title), bookInfo);

  return card;
}

function displayBooks(books) {
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    fragment.append(createBookCard(book));
  });

  bookResults.replaceChildren(fragment);
}

function showSearchError(error) {
  console.error("No se pudo completar la búsqueda:", error);

  if (error instanceof HttpError && error.status === 429) {
    showMessage(
      "Se alcanzó el límite de peticiones de Open Library. Espera un momento e inténtalo de nuevo.",
      "error"
    );
    return;
  }

  if (error instanceof HttpError) {
    showMessage(
      `Open Library devolvió un error (HTTP ${error.status}). Inténtalo de nuevo más tarde.`,
      "error"
    );
    return;
  }

  if (error instanceof TypeError) {
    showMessage(
      "No fue posible conectar con Open Library. Revisa tu conexión a internet e inténtalo de nuevo.",
      "error"
    );
    return;
  }

  showMessage(
    "Ocurrió un error al procesar la información recibida. Inténtalo de nuevo.",
    "error"
  );
}

async function searchBooks(searchTerm) {
  const encodedSearch = encodeURIComponent(searchTerm);
  const requestUrl = `${API_URL}?q=${encodedSearch}&limit=${MAX_RESULTS}`;

  setSearchingState(true);
  bookResults.replaceChildren();
  showMessage("Buscando libros en Open Library...", "info");

  try {
    const response = await fetch(requestUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new HttpError(response.status);
    }

    const data = await response.json();

    if (!Array.isArray(data.docs)) {
      throw new Error("La respuesta de la API no contiene una lista de libros.");
    }

    const books = data.docs.slice(0, MAX_RESULTS);

    if (books.length === 0) {
      showMessage(
        "No se encontraron libros. Prueba con otro título o autor.",
        "info"
      );
      return;
    }

    displayBooks(books);

    const totalResults = Number(data.numFound ?? data.num_found);
    const resultSummary = Number.isFinite(totalResults)
      ? `Se encontraron ${totalResults.toLocaleString("es-MX")} resultados. `
      : "Búsqueda completada. ";

    showMessage(
      `${resultSummary}Se muestran ${books.length} como máximo.`,
      "info"
    );
  } catch (error) {
    showSearchError(error);
  } finally {
    setSearchingState(false);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isSearching) {
    return;
  }

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    bookResults.replaceChildren();
    showMessage("Escribe el título o el autor de un libro.", "error");
    searchInput.focus();
    return;
  }

  searchBooks(searchTerm);
});
