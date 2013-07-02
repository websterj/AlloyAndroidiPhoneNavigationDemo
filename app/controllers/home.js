
//
// View Language
//
$.tabHome.title = L('home', 'Home');
$.home.title = L('home', 'Home');
$.labelHome.text = L('labelHome', 'Home Label');


//
// Action Handlers
//
function actionLogout() {
    var AppData = require('data');
    AppData.logout(
        function (response) {
            if (response.result === 'ok') {
                // Android close app, iOS open login controller
                if(OS_ANDROID) {
                    var activity = Ti.Android.currentActivity;
                    activity.finish();
                } else {
                    var loginController = Alloy.createController('login');
                    loginController.getView().open();
                    Alloy.Globals.tabGroup.close();
                    Alloy.Globals.tabGroup = null;                       
                }
            } else {
                alert(L('error', 'Error') + ':\n' + response.msg);
            }       
        });
}


//
// Navigation
//

// Android
if(OS_ANDROID) {
    $.home.addEventListener('focus', function() {
        if($.home.activity) {
            var activity = $.home.activity;
            
            // Menu
            activity.invalidateOptionsMenu();
            activity.onCreateOptionsMenu = function(e) {
                var menu = e.menu;
                var menuItem1 = menu.add({
                    title: L('logout', 'Logout'),
                    showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
                });
                menuItem1.addEventListener('click', actionLogout);
            };            
        }   
    });
}

// iOS
if (OS_IOS) {
    var btnRightNav = Ti.UI.createButton({
       title: L('logout', 'Logout')
    });
    btnRightNav.addEventListener('click', actionLogout);
    $.home.rightNavButton = btnRightNav;
}