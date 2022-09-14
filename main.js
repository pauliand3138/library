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

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", "295", false);

console.log(theHobbit.info());