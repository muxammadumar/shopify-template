/**
 * Smooth scroll functionality for anchor links
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Smooth scroll to element with polyfill for older browsers
   * @param {HTMLElement} element - Target element to scroll to
   */
  function smoothScrollTo(element){
    try {
      if('scrollBehavior' in document.documentElement.style){
        element.scrollIntoView({behavior:'smooth', block:'start'});
      } else {
        // Fallback for browsers without smooth scroll support
        var targetPos = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({top: targetPos, behavior:'smooth'});
      }
    } catch(error) {
      console.warn('Smooth scroll failed:', error);
      // Fallback to instant scroll
      element.scrollIntoView();
    }
  }
  
  /**
   * Initialize smooth scroll for anchor links
   */
  IOSTheme.initSmoothScroll = function(){
    try {
      var anchorLinks = document.querySelectorAll('a[href^="#"]');
      var mobileNav = document.getElementById('iosMobileNav');
      
      anchorLinks.forEach(function(link){
        link.addEventListener('click', function(e){
          var href = link.getAttribute('href');
          if(!href || href === '#') return;
          
          var target = document.querySelector(href);
          if(!target) return;
          
          e.preventDefault();
          smoothScrollTo(target);
          
          // Close mobile menu if open
          if(mobileNav && mobileNav.classList.contains('open')){
            mobileNav.classList.remove('open');
            var burger = document.getElementById('iosBurger');
            if(burger) {
              burger.setAttribute('aria-expanded', 'false');
              var menuOpen = burger.getAttribute('data-menu-open') || 'Open menu';
              burger.setAttribute('aria-label', menuOpen);
            }
          }
          
          // Update focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
          setTimeout(function(){
            target.removeAttribute('tabindex');
          }, 1000);
        });
      });
      
      return anchorLinks.length;
    } catch(error) {
      console.error('Failed to initialize smooth scroll:', error);
      return 0;
    }
  };
  
  window.IOSTheme = IOSTheme;
})();
