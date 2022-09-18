let myLibrary = [];

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
let inputDropdown = document.getElementById("input-dropdown");

inputDropdown.onchange = (e) => {
    if (e.target.value == "")
        inputDropdown.style.color = "#757575";
    else
        inputDropdown.style.color = "#000";
}

let submitButton = document.getElementById("submit-button");
let inputBookTitle = document.getElementById("input-bookTitle");
let inputBookAuthor = document.getElementById("input-bookAuthor");
let inputBookPages = document.getElementById("input-bookPages");
let bookTitleError = document.getElementById("book-title-error");
let bookAuthorError = document.getElementById("book-author-error");
let bookPagesError = document.getElementById("book-pages-error");
let readingProgressError = document.getElementById("reading-progress-error");
let loader = document.getElementById("loader");


inputBookTitle.oninput = function() {checkOnChange(inputBookTitle);}
inputBookAuthor.oninput = function() {checkOnChange(inputBookAuthor);}
inputBookPages.oninput = function() {checkOnChange(inputBookPages);}
inputDropdown.oninput = function() {checkOnChange(inputDropdown);}

//Form interaction when onchange
function checkOnChange(htmlElement) {
    console.log(htmlElement);
    if (htmlElement["value"] == "" || (htmlElement["type"] == "number" && htmlElement["value"] < 1)) {
        htmlElement.style.borderColor = "red";
    } else {
        htmlElement.style.borderColor = "#04AA6D";
    }
}

// Form Validation when submit
submitButton.onclick = (e) => {
    if (inputBookTitle["value"] == "") {
        bookTitleError.innerText = "*Book title must not be empty!";
        inputBookTitle.style.borderColor = "red";
        inputBookTitle.style.animation = "shake 0.82s";
        setTimeout(function(){
            inputBookTitle.style.animation = "none";
        }, 900);
    } else {
        bookTitleError.innerText = "";
        inputBookTitle.style.borderColor = "#04AA6D";
    }

    if (inputBookAuthor["value"] == "") {
        bookAuthorError.innerText = "*Book author must not be empty!";
        inputBookAuthor.style.borderColor = "red";
        inputBookAuthor.style.animation = "shake 0.82s";
        setTimeout(function(){
            inputBookAuthor.style.animation = "none";
        }, 900);
    } else {
        bookAuthorError.innerText = "";
        inputBookAuthor.style.borderColor = "#04AA6D";
    }

    if (inputBookPages["value"] == "" || inputBookPages["value"] < 1) {
        bookPagesError.innerText = "*Book pages must be larger than 0!";
        inputBookPages.style.borderColor = "red";
        inputBookPages.style.animation = "shake 0.82s";
        setTimeout(function(){
            inputBookPages.style.animation = "none";
        }, 900);
    } else {
        bookPagesError.innerText = "";
        inputBookPages.style.borderColor = "#04AA6D";
    }

    if (inputDropdown["value"] == "") {
        readingProgressError.innerText = "*Reading progress must not be empty!";
        inputDropdown.style.borderColor = "red";
        inputDropdown.style.animation = "shake 0.82s";
        setTimeout(function(){
            inputDropdown.style.animation = "none";
        }, 900);
    } else {
        readingProgressError.innerText = "";
        inputDropdown.style.borderColor = "#04AA6D";
    }
 
    if(inputBookTitle["value"] && inputBookPages["value"] && inputDropdown["value"] && inputBookAuthor["value"]) {
        loader.style.display = "block";
        delay(1500).then(() => { 
            loader.style.opacity="0";
            delay(1500).then(() => { 
                loader.style.display="none";
                loader.style.opacity="100"; 
            });
        });
        console.log("Hello");
    }
}