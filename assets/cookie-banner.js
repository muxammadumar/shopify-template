/**
 * Cookie consent banner (GDPR compliance)
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Trap focus within cookie banner
   * @param {HTMLElement} banner - Banner element
   */
  function trapFocusInBanner(banner){
    var focusableElements = banner.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    var firstElement = focusableElements[0];
    var lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTab(e){
      if(e.key !== 'Tab') return;
      
      if(e.shiftKey){
        if(document.activeElement === firstElement){
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if(document.activeElement === lastElement){
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    banner.addEventListener('keydown', handleTab);
    return function(){
      banner.removeEventListener('keydown', handleTab);
    };
  }
  
  /**
   * Initialize cookie consent banner
   */
  IOSTheme.initCookieBanner = function(){
    try {
      var cookieBanner = document.getElementById('iosCookieBanner');
      if(!cookieBanner) {
        return false;
      }
      
      // Check if user has already consented
      var hasConsented = localStorage.getItem('cookieConsent');
      
      var removeFocusTrap = null;
      
      if(!hasConsented){
        // Show banner after short delay
        setTimeout(function(){
          cookieBanner.classList.add('show');
          cookieBanner.setAttribute('role', 'dialog');
          cookieBanner.setAttribute('aria-labelledby', 'iosCookieBannerTitle');
          cookieBanner.setAttribute('aria-modal', 'true');
          
          // Trap focus in banner
          removeFocusTrap = trapFocusInBanner(cookieBanner);
          
          // Focus first button
          var firstButton = cookieBanner.querySelector('button');
          if(firstButton) {
            firstButton.focus();
          }
        }, 1000);
      }
      
      // Accept button
      var acceptBtn = document.getElementById('acceptCookies');
      if(acceptBtn){
        acceptBtn.addEventListener('click', function(){
          localStorage.setItem('cookieConsent', 'accepted');
          cookieBanner.classList.remove('show');
          cookieBanner.removeAttribute('role');
          cookieBanner.removeAttribute('aria-labelledby');
          cookieBanner.removeAttribute('aria-modal');
          if(removeFocusTrap) {
            removeFocusTrap();
          }
        });
      }
      
      // Decline button
      var declineBtn = document.getElementById('declineCookies');
      if(declineBtn){
        declineBtn.addEventListener('click', function(){
          localStorage.setItem('cookieConsent', 'declined');
          cookieBanner.classList.remove('show');
          cookieBanner.removeAttribute('role');
          cookieBanner.removeAttribute('aria-labelledby');
          cookieBanner.removeAttribute('aria-modal');
          if(removeFocusTrap) {
            removeFocusTrap();
          }
        });
      }
      
      // Close on ESC key
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && cookieBanner.classList.contains('show')){
          localStorage.setItem('cookieConsent', 'declined');
          cookieBanner.classList.remove('show');
          cookieBanner.removeAttribute('role');
          cookieBanner.removeAttribute('aria-labelledby');
          cookieBanner.removeAttribute('aria-modal');
          if(removeFocusTrap) {
            removeFocusTrap();
          }
        }
      });
      
      return true;
    } catch(error) {
      console.error('Failed to initialize cookie banner:', error);
      return false;
    }
  };
  
  window.IOSTheme = IOSTheme;
})();
