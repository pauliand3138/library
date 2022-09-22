// @ts-nocheck
const myLibrary = [];

function Book(title, author, pages, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
    this.info = () => {
        return this.title + " by " + this.author + ", " + this.pages + " pages, " + (this.hasRead ? "already read" : "not read yet");
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function delay(ms) {
    // @ts-ignore
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Input dropdown color styles
const inputDropdown = document.getElementById("input-dropdown");

inputDropdown.onchange = (e) => {
    if (e.target.value == "")
        inputDropdown.style.color = "#757575";
    else
        inputDropdown.style.color = "#000";
}

const submitButton = document.getElementById("submit-button");
const inputBookTitle = document.getElementById("input-bookTitle");
const inputBookAuthor = document.getElementById("input-bookAuthor");
const inputBookPages = document.getElementById("input-bookPages");
const bookTitleError = document.getElementById("book-title-error");
const bookAuthorError = document.getElementById("book-author-error");
const bookPagesError = document.getElementById("book-pages-error");
const readingProgressError = document.getElementById("reading-progress-error");
const loader = document.getElementById("loader");

const BOOK_TITLE_ERROR_MESSAGE = "*Book title must not be empty!";
const BOOK_AUTHOR_ERROR_MESSAGE = "*Book author must not be empty!";
const BOOK_PAGES_ERROR_MESSAGE = "*Book pages must be larger than 0!";
const READING_PROGRESS_ERROR_MESSAGE = "*Reading progress must not be empty!";

const inputErrorMap = new Map([
    [inputBookTitle, bookTitleError],
    [inputBookAuthor, bookAuthorError],
    [inputBookPages, bookPagesError],
    [inputDropdown, readingProgressError]
]);

inputBookTitle.oninput = function() {checkOnChange(inputBookTitle);}
inputBookAuthor.oninput = function() {checkOnChange(inputBookAuthor);}
inputBookPages.oninput = function() {checkOnChange(inputBookPages);}
inputDropdown.oninput = function() {checkOnChange(inputDropdown);}

//Form interaction when onchange
function checkOnChange(htmlElement) {
    if (htmlElement["value"] == "" || (htmlElement["type"] == "number" && htmlElement["value"] < 1)) {
        htmlElement.style.borderColor = "red";
        switch(inputErrorMap.get(htmlElement)) {
            case bookTitleError:
                bookTitleError.innerText = BOOK_TITLE_ERROR_MESSAGE;
                break;
            case bookAuthorError:
                bookAuthorError.innerText = BOOK_AUTHOR_ERROR_MESSAGE;
                break;
            case bookPagesError:
                bookPagesError.innerText = BOOK_PAGES_ERROR_MESSAGE;
                break;
            case readingProgressError:
                readingProgressError.innerText = READING_PROGRESS_ERROR_MESSAGE;
                break;
        }
    } else {
        htmlElement.style.borderColor = "#04AA6D";
        inputErrorMap.get(htmlElement).innerText = "";
    }
}

// Form Validation when submit
submitButton.onclick = (e) => {
    for (const [key, value] of inputErrorMap) {
        if (key["value"] == "" || (key == inputBookPages && key["value"] < 1)) {
            switch(inputErrorMap.get(key)) {
            case bookTitleError:
                value.innerText = BOOK_TITLE_ERROR_MESSAGE;
                break;
            case bookAuthorError:
                value.innerText = BOOK_AUTHOR_ERROR_MESSAGE;
                break;
            case bookPagesError:
                value.innerText = BOOK_PAGES_ERROR_MESSAGE;
                break;
            case readingProgressError:
                value.innerText = READING_PROGRESS_ERROR_MESSAGE;
                break;
            }

            key.style.borderColor = "red";
            key.style.animation = "shake 0.82s";
            setTimeout(function(){
                key.style.animation = "none";
            }, 900);
        }
    }
 
    if(inputBookTitle["value"] && inputBookPages["value"] && inputDropdown["value"] && inputBookAuthor["value"]) {
        loader.style.display = "block";
        delay(1500).then(() => { 
            loader.style.opacity="0";
            delay(1500).then(() => { 
                loader.style.display="none";
                loader.style.opacity="100";
            });
            const newBook = new Book(inputBookTitle["value"], inputBookAuthor["value"], inputBookPages["value"], inputDropdown["value"])
            addBookToLibrary(newBook);
            addNewBookToTable(newBook);
        });
        
    }
}
const readingProgressButtons = document.getElementsByClassName("reading-progress-button");

function addNewBookToTable(newBook) {
    const table = document.getElementById("table-row");
    const row = table.insertRow(-1);
    const numberCell = row.insertCell(0)
    const titleCell = row.insertCell(1);
    const authorCell = row.insertCell(2);
    const pagesCell = row.insertCell(3);
    const readingProgressCell = row.insertCell(4);
    const actionCell = row.insertCell(5);

    numberCell.innerText = myLibrary.length < 10 ? "0" + myLibrary.length : myLibrary.length; 
    titleCell.innerText = newBook.title;
    authorCell.innerText = newBook.author;
    pagesCell.innerText = newBook.pages;
    readingProgressCell.innerHTML = `<div class="reading-progress-div" style="color:${newBook.hasRead == "Completed" ? 'green' : 'red'};" onclick=readingProgressClick(this)>${newBook.hasRead}</div>`;
    console.log(readingProgressButtons);
    actionCell.innerHTML = `<a id="${myLibrary.length}" onclick=deleteButtonClick(this)>Delete</a>`;
}


function readingProgressClick(e) {
    if (e.innerText == "Completed") {
        e.innerText = "Not yet";
        e.style.color = "red";
    } else {
        e.innerText = "Completed";
        e.style.color = "green";
    }
    
}

function deleteButtonClick(e) {
    const table = document.getElementById("content-table");
    console.log(e.id);
    myLibrary.splice(e.id);
    console.log(myLibrary);
    table.deleteRow(parseInt(e.id) - 1);
}