//
// Check for expected controller args
//
var args = arguments[0] || {};
var parentTab = args.parentTab || '';
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';

//
// The list controller "shouldn't" call detail unless it has an id it is going to pass it in the first place
// Just double check we got it anyway and do nothing if we didn't
//
if (dataId !== '') {
    //
    // Fetch data row and assign title value to the label/window title (nothing else!)
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
        
        // Back Button - not really necessary here - this is the default behaviour anyway?
        $.detail.addEventListener('android:back', function() {              
            $.detail.close();
            $.detail = null;
        });     
    }
    
    // iOS
    // as detail was opened in the tabGroup, iOS will handle the nav itself (back button action and title)
    // but we could change the iOS back button text:
    //$.detail.backButtonTitle = L('backText', 'Back to List');
}