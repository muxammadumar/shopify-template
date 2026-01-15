/**
 * Main orchestrator - initializes all theme functionality
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Initialize all theme functionality
   */
  IOSTheme.init = function(){
    // Detect reduced motion preference
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReducedMotion){
      document.documentElement.style.scrollBehavior = 'auto';
    }
    
    // Initialize smooth scroll
    var anchorLinksCount = IOSTheme.initSmoothScroll ? IOSTheme.initSmoothScroll() : 0;
    
    // Initialize mobile menu
    var mobileMenuInit = IOSTheme.initMobileMenu ? IOSTheme.initMobileMenu() : false;
    
    // Initialize FAQ accordion
    var faqCount = IOSTheme.initFAQAccordion ? IOSTheme.initFAQAccordion() : 0;
    
    // Initialize country selector
    var countrySelectorInit = IOSTheme.initCountrySelector ? IOSTheme.initCountrySelector() : false;
    
    // Initialize cookie banner (lazy loaded with requestIdleCallback)
    if(IOSTheme.initCookieBanner){
      function initCookieBanner(){
        IOSTheme.initCookieBanner();
      }
      
      if('requestIdleCallback' in window){
        requestIdleCallback(function(){
          setTimeout(initCookieBanner, 1000);
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(function(){
          if(document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', initCookieBanner);
          } else {
            initCookieBanner();
          }
        }, 1000);
      }
    }
    
    // Add loading state to CTA buttons
    try {
      var ctaButtons = document.querySelectorAll('.ios-btn[href*="launchheld.com"]');
      ctaButtons.forEach(function(btn){
        btn.addEventListener('click', function(){
          if(!btn.classList.contains('loading')){
            btn.classList.add('loading');
            var originalText = btn.textContent;
            btn.textContent = 'Loading...';
            
            // Revert after navigation (or timeout)
            setTimeout(function(){
              btn.textContent = originalText;
              btn.classList.remove('loading');
            }, 3000);
          }
        });
      });
    } catch(error) {
      console.warn('Failed to initialize CTA buttons:', error);
    }
    
    // Add error handling for images
    try {
      var images = document.querySelectorAll('img');
      images.forEach(function(img){
        img.addEventListener('error', function(){
          img.style.display = 'none';
          if(window.location.search.indexOf('debug=1') > -1){
            console.warn('Failed to load image:', img.src);
          }
        });
      });
    } catch(error) {
      console.warn('Failed to initialize image error handling:', error);
    }
    
    // Performance: Lazy load images if Intersection Observer is supported
    if('IntersectionObserver' in window){
      try {
        var lazyImages = document.querySelectorAll('img[data-src]');
        var imageObserver = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting){
              var img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });
        
        lazyImages.forEach(function(img){
          imageObserver.observe(img);
        });
      } catch(error) {
        console.warn('Failed to initialize lazy loading:', error);
      }
    }
    
    // Debug mode for development
    if(window.location.search.indexOf('debug=1') > -1){
      console.log('GoldBrand Theme - Debug Mode');
      console.log('Anchor links:', anchorLinksCount);
      console.log('FAQ items:', faqCount);
      console.log('Mobile menu:', mobileMenuInit ? 'Initialized' : 'Not found');
      console.log('Country selector:', countrySelectorInit ? 'Initialized' : 'Not found');
      console.log('Reduced motion:', prefersReducedMotion);
    }
  };
  
  // Initialize when DOM is ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', IOSTheme.init);
  } else {
    IOSTheme.init();
  }
  
  window.IOSTheme = IOSTheme;
})();
