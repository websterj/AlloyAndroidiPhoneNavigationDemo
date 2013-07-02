//
// Login stuff
//
var loggedIn = false;

// Check for persisted login
if (Ti.App.Properties.getString('loggedIn')) {
    loggedIn = true;
}

exports.isLoggedIn = function () {
    return loggedIn;
};

exports.login = function(username, password, callback) {
    if (username !== 'error') {
        loggedIn = true;
        Ti.App.Properties.setString('loggedIn', 1);
        
        // setTimeout to simulate delay of calling remote service
        setTimeout(function() {
            callback({ result: 'ok' }); 
        }, 1500);              
    } else {
        setTimeout(function() {
            callback({ result: 'error', msg: 'Username "error" triggers login error' });
        }, 1500);
    }       
};

exports.logout = function (callback) {
    loggedIn = false;
    Ti.App.Properties.removeProperty('loggedIn'); 
    callback({ result: 'ok' });
};


//
// App data and methods
//
var dataStore = [];
var dataBuilt = false;

// When app opens, build some dummy data - we are not going to persist the data though
// Create/Delete actions will be applied to this dataStore, which will be reset on relaunch
if (! dataBuilt) {
    for (var i=0; i<10; i++) {
        var row = {title: 'Row ' + i}
        dataStore.push(row);
    }
}

// Delete
exports.deleteItem = function (id) {
    dataStore.splice(id, 1);   
};

// Get
exports.getItem = function (id) {
    return dataStore[id];   
};

// GetAll
exports.getAll = function () {
    return dataStore;
};