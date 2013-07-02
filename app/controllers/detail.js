//
// Check for expected controller args
//
var args = arguments[0] || {};
var parentTab = args.parentTab || '';
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';

//
// The list controller shouldn't call detail unless it has an id it is going to pass it
// Just double check we got it anyway and nothing if not
//
if (dataId !== '') {
    //
    // Fetch data row and assign to the label
    //
    var AppData = require('data');
    var dataItem = AppData.getItem(dataId);
    $.detail.title = dataItem.title;
    $.detailLabel.text  = dataItem.title;
    
    
    //
    // Navigation
    //
        
    // Android
    if (OS_ANDROID) {
        $.detail.addEventListener('open', function() {
            if($.detail.activity) {
                var activity = $.detail.activity;

                // Action Bar
                if( Ti.Platform.Android.API_LEVEL >= 11 && activity.actionBar) {      
                    activity.actionBar.title = L('detail', 'Detail');
                    activity.actionBar.displayHomeAsUp = true; 
                    activity.actionBar.onHomeIconItemSelected = function() {               
                        $.detail.close();
                        $.detail = null;
                    };             
                }
            }
        });
        
        // Back Button (not necessary in this case though)
        $.detail.addEventListener('android:back', function() {              
            $.detail.close();
            $.detail = null;
        });     
    }
    
    // iOS
    // as detail opened in tabGroup, iOS will handle the nav itself, giving the back button a title - we could take more control
    // or could add right nav button to do something with this detail, like delete it
}