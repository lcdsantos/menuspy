var MenuSpy = require('./menuspy');

(function() {

  var elm = document.querySelector('header');
  var ms = new MenuSpy(elm);

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-84723414-1', 'auto');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');

  function getScript(a,b,c,e){var d=a.getElementsByTagName(b)[0];a.getElementById(c)||(a=a.createElement(b),a.id=c,a.src=e,d.parentNode.insertBefore(a,d))};

  getScript(document, 'script', 'facebook-jssdk', 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=146929405493694');
  getScript(document, 'script', 'twitter-wjs',    'https://platform.twitter.com/widgets.js');
  getScript(document, 'script', 'googleplus-wjs', 'https://apis.google.com/js/plusone.js');

})();