var AppData = require('data');

if (! AppData.isLoggedIn()) {
    var loginController = Alloy.createController('login');
} else {
    $.tabGroup.open();
    $.tabGroup.setActiveTab(1); 
    Alloy.Globals.tabGroup = $.tabGroup;
    
    //
    // Navigation
    //
    
    // Android
    if (OS_ANDROID) {
        $.tabGroup.addEventListener('open', function() {
            if($.tabGroup.activity) {
                var activity = $.tabGroup.activity;
    
                // Action Bar
                if( Ti.Platform.Android.API_LEVEL >= 11 && activity.actionBar) {      
                    activity.actionBar.title = L('appTitle', 'Demo App');            
                }
            }   
        });
        
        // Back Button
        $.tabGroup.addEventListener('android:back', function() {
            var activity = Ti.Android.currentActivity;
            activity.finish();
        });
    }       
}