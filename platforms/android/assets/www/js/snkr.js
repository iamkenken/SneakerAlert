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

/*Local*/
/*var api_url = 'http://snkralrt.dev/api/v1';*/

/*Dev*/
var api_url = 'http://dev.alfafusion.com/snkrt-alrt/public/api/v1';

$$(document).on('deviceready', function deviceIsReady() {

  if(localStorage.auth == undefined)
  {
    mainView.router.load({
      template: myApp.templates.loginTemplate,
      animatePages: true,
      context: {
      },
      reload: true,
    });
    localStorage.currentPage = 'loginpage';
  }
  else
  {
    mainView.router.load({
      template: myApp.templates.homeTemplate,
      animatePages: true,
      context: {
      },
      reload: true,
    });
    localStorage.currentPage = 'homepage';
  }

  if(localStorage.photo == undefined)
  {
    localStorage.photo = 'img/p.jpg';
  }

  $$(document).on('submit', '#loginForm', function(){
    
    var username = $$('#username').val();
    var pass = $$('#pass').val();
    if(username == ''){
      $$('#username').focus();
    }else if(pass == ''){
      $$('#pass').focus();
    }else{
      $$('body').append('<span style="width:42px; height:42px; position: absolute; top: 45%; left: 45%; z-index: 9999;" class="preloader preloader-dark"></span>');
      $$.get(api_url+'/login', {username: username, pass: pass}, function (data) {
        //$$('.preloader').remove();
        var datas = JSON.parse(data);
        
        if(datas['status'] == 'OK'){
          console.log(datas['data']['photo']);
          localStorage.auth = 'true';
          localStorage.un = username;
          localStorage.pass = pass;
          localStorage.fname = datas['data']['firstname'];
          localStorage.lname = datas['data']['lastname'];
          if(datas['data']['photo'] !== ''){
          localStorage.photo = datas['data']['photo'];
          }else{
             localStorage.photo = 'img/p.jpg';
          }
          localStorage.userid = datas['data']['user_id'];

          /*$$('#menu-profile').trigger('click');
          $$('.p-name').text(localStorage.un);*/

          localStorage.currentPage = 'profilepage';
          mainView.router.load({
            template: myApp.templates.profileTemplate,
            animatePages: true,
            context: {
              name: localStorage.un,
              photo: localStorage.photo
            },
            reload: true,
          });
        }else{
          myApp.alert('Your shoes does not fit. Try again', 'SNKR ALRT');
        }
      });
    }
    return false;
  });
  
  $$(document).on('submit', '#signupForm', function(){
    var username = $$('#susername').val();
    var email = $$('#semail').val();
    var pass = $$('#spass').val();
    var cpass = $$('#scpass').val();
    if(username == ''){
      $$('#susername').focus();
    }else if(email == ''){
      $$('#semail').focus();
    }else if(pass == ''){
      $$('#spass').focus();
    }else if(cpass == ''){
      $$('#scpass').focus();
    }else if(cpass != pass){
      myApp.alert('Password do not match', 'SNKR ALRT');
    }else{
      $$('body').append('<span style="width:42px; height:42px; position: absolute; top: 45%; left: 45%; z-index: 9999;" class="preloader preloader-dark"></span>');
      $$.get(api_url+'/register', {username: username, email: email, pass: pass}, function (data) {
        $$('.preloader').remove();
        var datas = JSON.parse(data);
        console.log(datas);
        if(datas['status'] == 'OK'){
          localStorage.auth = 'true';
          localStorage.un = username;
          localStorage.pass = pass;
          localStorage.fname = datas['data']['firstname'];
          localStorage.lname = datas['data']['lastname'];
          if(datas['data']['photo'] !== ''){
          localStorage.photo = datas['data']['photo'];
          }else{
             localStorage.photo = 'img/p.jpg';
          }
          localStorage.userid = datas['data']['user_id'];

          /*$$('#menu-profile').trigger('click');
          $$('.p-name').text(localStorage.un);*/
          localStorage.currentPage = 'profilepage';
          mainView.router.load({
            template: myApp.templates.profileTemplate,
            animatePages: true,
            context: {
              name: localStorage.un,
              photo: localStorage.photo
            },
            reload: true,
          });
        }else{
          myApp.alert(datas['error'], 'SNKR ALRT');
        }
      });
    }
    return false;
  });

  $$('#logout').click(function(){
    localStorage.clear();
    mainView.router.load({
      template: myApp.templates.loginTemplate,
      animatePages: true,
      context: {
      },
      reload: true,
    });
  });

  $$('#a-browse').click(function(){
    if(localStorage.currentPage  !== 'homepage')
    {
      mainView.router.load({pageName: 'index'});
      localStorage.currentPage = 'homepage';
    }
  });

  $$('#a-profile').click(function(){
    if(localStorage.currentPage !== 'profilepage')
    {
      mainView.router.load({
        template: myApp.templates.profileTemplate,
        animatePages: true,
        context: {
          name: localStorage.un,
          photo: localStorage.photo
        },
        reload: true,
      });
      localStorage.currentPage = 'profilepage';
    }
  });

});




/*$$(document).on('click', '.profile-link', function profileLink() {
mainView.router.loadContent($$('#myPage').html());
});*/