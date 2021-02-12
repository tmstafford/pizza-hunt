const { response } = require("express");

// create variable to hold db connection
let db;

// establish connection to IndexedDB database called 'pizza_hunt' set to version 1
const request = indexedDB.open('pizza_hunt', 1);

// emit if the db version changes (nonexistant to v1)
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {
    // save reference to db in global var when db is successfully created w its object store
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() to send all local data to api
    if (navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// executed if we attempt to suubmit a new pizza and theres no internet connection
function saveRecord(record) {
    // open new transaction with db with read/write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    // add record to store 
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_pizza');

    const getAll = pizzaObjectStore.getAll();

    // upon successful getAll(), run this function
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}

window.addEventListener('online', uploadPizza);