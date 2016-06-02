// Code for platform detection
var isMaterial = Framework7.prototype.device.ios === false;
var isIos = Framework7.prototype.device.ios === true;

// Add the above as global variables for templates
Template7.global = {
  material: isMaterial,
  ios: isIos,
};

// A template helper to turn ms durations to mm:ss
// We need to be able to pad to 2 digits
function pad2(number) {
  if (number <= 99) { number = ('0' + number).slice(-2); }
  return number;
}

// Now the actual helper to turn ms to [hh:]mm:ss
function durationFromMsHelper(ms) {
  if (typeof ms != 'number') {
    return '';
  }
  var x = ms / 1000;
  var seconds = pad2(Math.floor(x % 60));
  x /= 60;
  var minutes = pad2(Math.floor(x % 60));
  x /= 60;
  var hours = Math.floor(x % 24);
  hours = hours ? pad2(hours) + ':' : '';
  return hours + minutes + ':' + seconds;
}

// A stringify helper
// Need to replace any double quotes in the data with the HTML char
//  as it is being placed in the HTML attribute data-context
function stringifyHelper(context) {
  var str = JSON.stringify(context);
  return str.replace(/"/g, '&quot;');
}

// Finally, register the helpers with Template7
Template7.registerHelper('durationFromMs', durationFromMsHelper);
Template7.registerHelper('stringify', stringifyHelper);

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


if (!isIos) {
  // Change class
  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
  // And move Navbar into Page
  $$('.view .navbar').prependTo('.view .page');
  console.log('materialto');
}

// Initialize app
var myApp = new Framework7({
  material: isIos? false : true,
  template7Pages: true,
  precompileTemplates: true,
  swipePanel: 'left',
  swipePanelActiveArea: '30',
  swipeBackPage: true,
  animateNavBackIcon: true,
  pushState: !!Framework7.prototype.device.os,
});

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true,
  domCache: true,
});

 var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
}); 

/*mainView.router.load({pageName: 'profile'});*/
// Handle Cordova Device Ready Event
var api_url = 'http://snkralrt.dev/api/v1';

$$(document).on('deviceready', function deviceIsReady() {
  
  $$('#btn-auth').click(function(){
    var username = $$('#username').val();
    var pass = $$('#pass').val();
    $$.get(api_url+'/login', {username: username, pass: pass}, function (data) {
      var datas = JSON.parse(data);
      console.log(datas['status']);
      if(datas['status'] == 'OK'){
        var fname = datas['data']['firstname'];

        $$('#menu-profile').trigger('click');
        $$('.p-name').text(fname);
      }
    });
  });
  

});


$$(document).on('click', '#btn-signup', function(){
  var username = $$('#susername').val();
  var email = $$('#semail').val();
  var pass = $$('#spass').val();
  var cpass = $$('#scpass').val();
  $$.get(api_url+'/register', {username: username, email: email, pass: pass}, function (data) {
    var datas = JSON.parse(data);
    console.log(datas);
    if(datas['status'] == 'OK'){
      var fname = datas['data']['username'];

      $$('#menu-profile').trigger('click');
      $$('.p-name').text(fname);
    }
  });
});

/*$$(document).on('click', '.profile-link', function profileLink() {
mainView.router.loadContent($$('#myPage').html());
});*/