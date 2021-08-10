

let db;
const request = indexedDB.open("BudgetTrackerDB");

//when "version change" occurs, or creation occurs; create the object store IFF one does not exist
request.onupgradeneeded = (e) => {
  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetTrackerStore", { autoIncrement: true });
  }
};

//if error, tell me the error
request.onerror = (e) => {
  console.log(`error: ${e.target}`);
};

//To pull data stored offline and store it in our backend db
//** failing at the POST  **/
const transferDatabase = () => {
  //create a transaction instance in our offline DB
  const transaction = db.transaction(["BudgetTrackerStore"], "readwrite");
  const store = transaction.objectStore("BudgetTrackerStore");
  const getRecords = store.getAll();
 //Connect to backend and add offline records => clear offline storage
  getRecords.onsuccess = () => {
    if (getRecords.result.length > 0) {
      fetch("/api/transcation/bulk", {
        method: "POST",
        body: JSON.stringify(getRecords.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(["BudgetTrackerStore"], "readwrite");
            const newStore = transaction.objectStore("BudgetTrackerStore");
            newStore.clear();
            console.log("cleared store");
          }
        });
    }
  };
};

//if online run function to pull data stored locally and add it to backend DB
request.onsuccess = (e) => {
  console.log("success!");
  db = e.target.result;

  if (navigator.onLine) {
    console.log("you're online!");
    transferDatabase();
    //check database function
  }
};

const saveRecord = (data) => {
  const transaction = db.transaction(["BudgetTrackerStore"], "readwrite");
  const store = transaction.objectStore("BudgetTrackerStore");
  store.add(data);
};

window.addEventListener("online", transferDatabase);
