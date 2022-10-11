// @ts-nocheck
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
const deleteAllButton = document.getElementById("stat-delete-button");

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
            localStorage.setItem('library-data', JSON.stringify(myLibrary));
            resetForm();
            displayAllBooks();
            showToast("form-success");
        });
        
    } else {
        showToast("form-warning");
    }
}

//Delete all button onclick event
deleteAllButton.onclick = (e) => {

    if (myLibrary.length > 0) {
        const modalContainer = document.querySelector(".modal-container");

        modalContainer.classList.add('show');
        
        modalContainer.onclick = (e) => {
            const { target } = e;
            if (target.classList.contains('close-modal')) {
                modalContainer.classList.remove("show");
            } else if (target.classList.contains('yes')) {
                console.log('Hello');
                myLibrary.splice(0, myLibrary.length);
                localStorage.setItem('library-data', JSON.stringify(myLibrary));
                modalContainer.classList.remove("show");
                displayAllBooks();
                showToast("reset-success");
            }
        }
    } else {
        showToast("reset-error");
    }
};


function resetForm() {
    const form = document.querySelector(".add-book-form");
    const input = document.querySelectorAll("input");
    for(let i = 0; i < input.length; i++) {
        input[i].style.borderColor = "#5F9AEC";
    }
    const select = document.querySelector("select");
    select.style.borderColor = "#5F9AEC";
    select.style.color = "#757575";
    form.reset();    
}

function changeReadingProgress(e) {
    const index = e.parentNode.parentNode.rowIndex - 1;
    if (e.innerText == "Completed") {
        myLibrary[index].hasRead = "Not yet";
    } else {
        myLibrary[index].hasRead = "Completed";
    }
    localStorage.setItem('library-data', JSON.stringify(myLibrary));
    displayAllBooks();
}

function deleteBook(e) {
    const tr = e.parentNode.parentNode.rowIndex - 1;
    myLibrary.splice(tr, 1);
    //console.log(myLibrary);
    showToast("delete-item-success");
    localStorage.setItem('library-data', JSON.stringify(myLibrary));
    displayAllBooks();
}

function updateLibraryStats() {
    const totalBooksCount = document.querySelector("#total-books");
    const booksCompletedCount = document.querySelector("#books-completed");
    const booksIncompleteCount = document.querySelector("#books-incomplete");

    let completedCount = 0;
    let incompleteCount = 0;
    for(let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].hasRead == "Completed") {
            completedCount++;
        } else {
            incompleteCount++;
        } 
    }

    totalBooksCount.innerText = myLibrary.length;
    booksCompletedCount.innerText = completedCount;
    booksIncompleteCount.innerText = incompleteCount;
}

function showToast(toastType) {
    let toast;
    let toastClose;
    let toastProgress;
    let toastMessage;

    if (toastType == "form-success" || toastType == "delete-item-success" || toastType == "reset-success") {
        toast = document.querySelector("#success-toast");
        toastClose = document.querySelector("#success-toast .close");
        toastProgress = document.querySelector("#success-toast .progress");
        toastMessage = document.querySelector("#success-toast .text-2");
        if (toastType == "form-success") {
            toastMessage.innerText = "New record has been added !";
        } else if (toastType == "delete-item-success") {
            toastMessage.innerText = "Record has been deleted!";
        } else if (toastType == "reset-success") {
            toastMessage.innerText = "Library has been reset successfully!";
        }
    } else if (toastType == "reset-error") {
        toast = document.querySelector("#error-toast");
        toastClose = document.querySelector("#error-toast .close");
        toastProgress = document.querySelector("#error-toast .progress");
    } else if (toastType == "form-warning") {
        toast = document.querySelector("#warning-toast");
        toastClose = document.querySelector("#warning-toast .close");
        toastProgress = document.querySelector("#warning-toast .progress");
    }    

    toast.classList.add("toast-active");
    toastProgress.classList.add("toast-active");

    setTimeout(() => {
        toast.classList.remove("toast-active");
    }, 2000);

    setTimeout(() => {
        toastProgress.classList.remove("toast-active");
    }, 2300);

    toastClose.addEventListener("click", () => {
        toast.classList.remove("toast-active");

        setTimeout(() => {
            toastProgress.classList.remove("toast-active");
        }, 300);
    });
}

function displayAllBooks() {
    const bookRowInTable = document.getElementById("table-row");
    bookRowInTable.textContent = ""
    for(let i = 0; i < myLibrary.length; i++) {
        const row = bookRowInTable.insertRow(-1);
        const numberCell = row.insertCell(0)
        const titleCell  = row.insertCell(1);
        const authorCell = row.insertCell(2);
        const pagesCell  = row.insertCell(3);
        const readingProgressCell = row.insertCell(4);
        const actionCell = row.insertCell(5); 

        numberCell.innerText = (i + 1) < 10 ? "0" + parseInt(i + 1) : parseInt(i + 1); 
        titleCell.innerText = myLibrary[i].title;
        authorCell.innerText = myLibrary[i].author;
        pagesCell.innerText = myLibrary[i].pages;
        readingProgressCell.innerHTML = `<div class="reading-progress-div" style="color:${myLibrary[i].hasRead == "Completed" ? 'green' : 'red'};" onclick=changeReadingProgress(this)>${myLibrary[i].hasRead}</div>`;
        actionCell.innerHTML = `<a class="delete-btn" onclick=deleteBook(this)><span style="color: #003E77"><i class="fa-solid fa-trash-can"></span></i>Delete</a>`;
    }
    updateLibraryStats();
}

function getLocalStorageBooks() {
    if (localStorage.getItem("library-data") == null) {
        localStorage.setItem("library-data", '[]');
    }

    var existing_data = JSON.parse(localStorage.getItem('library-data'));

    myLibrary = existing_data;

    localStorage.setItem('library-data', JSON.stringify(myLibrary));
}

getLocalStorageBooks();
displayAllBooks();