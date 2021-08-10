let db;
const request = indexedDB.open('BudgetTrackerDB');

request.onupgradeneeded = (e) => {
    db = e.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetTrackerStore', { autoIncrement: true });
    }
};
request.onerror = (e) => {
    console.log(`error: ${e.target}`);
};
request.onsuccess = (e) => {
    console.log('success!');
    db = e.target.result

    if (navigator.onLine) {
        console.log("you're online!");
        //check database function
    }
}

const saveRecord = (data) => {
    const transaction = db.transaction(['BudgetTrackerStore'], 'readwrite');
    const store = transaction.objectStoreNames('BudgetTrackerStore');
    store.add(data);
};

window.addEventListener('online', "**function here**")