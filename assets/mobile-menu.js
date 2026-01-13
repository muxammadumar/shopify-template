/**
 * Mobile menu toggle and focus management
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Trap focus within mobile menu
   * @param {HTMLElement} menu - Menu element
   * @param {HTMLElement} trigger - Trigger button
   */
  function trapFocus(menu, trigger){
    var focusableElements = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
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
    
    menu.addEventListener('keydown', handleTab);
    return function(){
      menu.removeEventListener('keydown', handleTab);
    };
  }
  
  /**
   * Initialize mobile menu functionality
   */
  IOSTheme.initMobileMenu = function(){
    try {
      var burger = document.getElementById('iosBurger');
      var mobileNav = document.getElementById('iosMobileNav');
      
      if(!burger || !mobileNav) {
        return false;
      }
      
      var removeFocusTrap = null;
      
      burger.addEventListener('click', function(e){
        e.stopPropagation();
        var isOpen = mobileNav.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen);
        var menuOpen = burger.getAttribute('data-menu-open') || 'Open menu';
        var menuClose = burger.getAttribute('data-menu-close') || 'Close menu';
        burger.setAttribute('aria-label', isOpen ? menuClose : menuOpen);
        
        if(isOpen){
          // Trap focus in mobile menu when open
          var firstLink = mobileNav.querySelector('a');
          if(firstLink) {
            firstLink.focus();
            removeFocusTrap = trapFocus(mobileNav, burger);
          }
        } else {
          // Remove focus trap and return focus to trigger
          if(removeFocusTrap) {
            removeFocusTrap();
            removeFocusTrap = null;
          }
          burger.focus();
        }
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', function(e){
        if(mobileNav.classList.contains('open')){
          var isClickInside = mobileNav.contains(e.target) || burger.contains(e.target);
          if(!isClickInside){
            mobileNav.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            var menuOpen = burger.getAttribute('data-menu-open') || 'Open menu';
            burger.setAttribute('aria-label', menuOpen);
            if(removeFocusTrap) {
              removeFocusTrap();
              removeFocusTrap = null;
            }
            burger.focus();
          }
        }
      });
      
      // Close mobile menu on ESC key
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && mobileNav.classList.contains('open')){
          mobileNav.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          burger.setAttribute('aria-label', 'Menü öffnen');
          if(removeFocusTrap) {
            removeFocusTrap();
            removeFocusTrap = null;
          }
          burger.focus();
        }
      });
      
      return true;
    } catch(error) {
      console.error('Failed to initialize mobile menu:', error);
      return false;
    }
  };
  
  window.IOSTheme = IOSTheme;
})();
