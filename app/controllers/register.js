
//
// View Language
//
$.register.title     = L('register', 'Register');
$.registerLabel.text = L('register', 'Register');


//
// Navigation
//

// Android 
if (OS_ANDROID) {
    $.register.addEventListener('open', function() {
        if($.register.activity) {
            var activity = $.register.activity;
    
            // Action Bar
            if( Alloy.Globals.Android.Api >= 11 && activity.actionBar) {      
                activity.actionBar.title = L('login', 'Login');
                activity.actionBar.displayHomeAsUp = true; 
                activity.actionBar.onHomeIconItemSelected = function() {              
                    $.register.close();
                    $.register = null;
                };             
            }
        }
    });
    
    // Back Button
    $.register.addEventListener('android:back', function() {             
        $.register.close();
        $.register = null;
    });     
}