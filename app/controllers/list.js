
//
// View Language
//
$.tabList.title = L('list', 'List');
$.list.title = L('list', 'List');


//
// Present our data - wrap it in an event handler which we can trigger when we manipulate our data store
// This eventListener is application-wide, but could be localised to this controller
// Using 'Ti.App.addEventListener' it can be triggered from other controllers
//
Ti.App.addEventListener('dataUpdated', function(e) {
    // Reset table if there are any existing rows (Alloy includes underscore)
    if(! _.isEmpty($.tableRecords.data)) {
        $.tableRecords.data = [];
        $.tableRecords.removeEventListener('click', tableClick);
        $.tableRecords.removeEventListener('longpress', tableLongPress);        
    } 
    
    // Set loading state
    $.activityIndicator.show();
    $.labelNoRecords.visible = false;
    
    // Wrap the following in setTimeout purely to show activityIndicator (simulate network activity)
    setTimeout(function() {
	
        $.activityIndicator.hide();
        
        // Require our data store - we are not creating a fresh instance each call
        // Access to the data module we are requiring works like a singleton (create new, or reuse if exists)
        var AppData = require('data');
        var dataStore = AppData.getAll();
        
        // Either set the state for no records, or loop and add each item as a TableViewRow
        if(! dataStore.length) {
            $.labelNoRecords.text = L('noRecordsFound', 'No Records Found');
            $.labelNoRecords.visible = true;
        } else {       
            var recordData = [];
    
            for (var i = 0; i < dataStore.length; i++) {
                var record = dataStore[i];
    
                // This doesn't need to be a row, it could just be an object
                // http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
                var row = Ti.UI.createTableViewRow({
                    title: record.title,
                    dataId: i,                             
                    className: 'row',
                    objName: 'row',
                    height: Alloy.Globals.Styles.TableViewRow.height,
                    // This demonstrates that custom properties can be set
                    // Enabling you to pass whatever you want to the click event handler later
                    someRandomVar: 'Just as an example ' + i
                });
                recordData.push(row);              
            }
            // Set the table data in one go rather than making repeated (costlier) calls on the loop
            $.tableRecords.setData(recordData);                       
        }
        
        // Handle table clicks - either single click or longpress (holding button down then releasing)
        // Rather than passing the function directly as the 2nd arguement, pass a reference
        // This allows it to be removed later: $.tableRecords.removeEventListener('click', tableClick);
        $.tableRecords.addEventListener('click', tableClick);
        $.tableRecords.addEventListener('longpress', tableLongPress);
        
    }, 2000);        
});

// Manually call dataUpdated once to perform the initial table rendering (subsequently called after data edited)
Ti.App.fireEvent('dataUpdated');


//
// Action Handlers
//

// Table Clicks
function tableClick(e) {
    var dataId = e.rowData.dataId;
    // Here we can pick up the custom variable set with Ti.UI.createTableViewRow
    var someRandomVar = e.rowData.someRandomVar;
    
    // All single clicks are just going to open the detail window for this item
    // We pass the tab object to the child controller so if it needed to open a window it has a reference to the parent tab in which to do so
    // Rather than passing $.tabList as a controller arg, we could set: Alloy.Globals.tabList = $.tabList; outside of this function
    // and have the child controller call: Alloy.Globals.tabList.open(someController.getView()) instead of parentTab.open(someController.getView()) 
    var detailController = Alloy.createController('detail', {
        parentTab: $.tabList,
        dataId: dataId
    });
    // As detail controller will only be opened from this list controller, which will call an open() method on it
    // there is no need in the detail.js controller to call $.detail.open();
    $.tabList.open(detailController.getView()); 
}
// Long clicks open the options menu, enabling us to view, delete, or cancel the row item
function tableLongPress(e) {
    var dataId = e.rowData.dataId;

    var dialog = Ti.UI.createOptionDialog({
        options: ['View', 'Delete', 'Cancel'],
        cancel: 2,
        destructive: 1,
        persistent: false,
        dataId: dataId
    });  
    
    // Handle clicks on our dialog menu itself
    dialog.addEventListener('click', function(e) {
        var index = e.index;
        var dataId = e.source.dataId;

		// View option selected
        if (dataId !== '' && index === 0) {
            var detailController = Alloy.createController('detail', {
                parentTab: $.tabList,
                dataId: dataId
            });
            $.tabList.open(detailController.getView()); 
        } else if (dataId !== '' && index === 1) {
		    // Delete option selected
			// Checking for !== '' specifically as dataId in this case could be 0 - array key 1st position
            var AppData = require('data');
            AppData.deleteItem(dataId);
            Ti.App.fireEvent('dataUpdated');
        }
        
        // Tidy up our dialog
		// Need to look into comparing performance of this approach (rebuilding dialog each time)
		// Vs creating a single dialog and reusing it each time (changing the dataId)
        dialog.hide();
        dialog = null;
    });
    
    // Open it
    dialog.show();  
}

// Menu Clicks
function openAddItem() {
	// We aren't adding the function to add rows
	// Otherwise this would open a "create" controller like how detail is created in dialog above
	// Create would have a form, which if valid, push the data to an "AppData.addItem(dataObject);"
	// And then close the window and trigger the redrawing of the data table
	// $.create.close(); Ti.App.fireEvent('dataUpdated');
    alert('Not Implemented');
}


//
// Navigation
//

// Android
if(OS_ANDROID) {
    $.list.addEventListener('focus', function() {
        if($.list.activity) {
            var activity = $.list.activity;
            
            // Menu
            activity.invalidateOptionsMenu();
            activity.onCreateOptionsMenu = function(e) {
                var menu = e.menu;
                var menuItem1 = menu.add({
                    title: L('addItem', 'Add Item'),
					// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Android.MenuItem
					// Menu items can be all hidden, shown if space available, forced to show all times
                    showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
                });
                menuItem1.addEventListener('click', openAddItem);
            };
            
            // Action Bar
            if( Alloy.Globals.Android.Api >= 11 && activity.actionBar) {      
                activity.actionBar.title = L('list', 'List');
            }            
        }   
    });
}

// iOS
if (OS_IOS) {
	var btnRightNav = Ti.UI.createButton({
	   title: L('addItem', 'Add Item')
	});
	btnRightNav.addEventListener('click', openAddItem);
	$.list.rightNavButton = btnRightNav;
} 