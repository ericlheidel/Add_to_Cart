/*Import Firebase information to pull from*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

/*Initialize Firebase "assSettings" from personal Firebase Realtime Database*/
const appSettings = {
    databaseURL: "https://realtime-database-28ef7-default-rtdb.firebaseio.com/"
}

/*Initialize (pull) information from Firebase & reference specific Firebase Realtime Database*/
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

/*Initialize initial variables for "Add to Cart" App*/
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

/*create event listener to give "Add Button" a purpose*/
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

/*onValue ?method? ?function? to have a constant line of communication to specific Firebase Realtime Database to push and pull changes to database info*/
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "<li>No items here... yet</li>"
    }
})

/*this function clears a/the Shopping List Element*/
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

/*this function clears the Input field Element*/
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

/*this APPEND-function adds a new item (array) to the database and creates a reference with its unique identifier to remove/add items to list*/
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}