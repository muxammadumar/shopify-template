/**
 * FAQ accordion functionality - only one open at a time
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Initialize FAQ accordion
   */
  IOSTheme.initFAQAccordion = function(){
    try {
      var allDetails = Array.prototype.slice.call(document.querySelectorAll('details.ios-details'));
      
      allDetails.forEach(function(details){
        // Set initial ARIA attributes
        var summary = details.querySelector('summary');
        if(summary) {
          summary.setAttribute('role', 'button');
          summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
        }
        
        details.addEventListener('toggle', function(){
          var isOpen = details.open;
          
          // Update ARIA attributes
          if(summary) {
            summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          }
          
          if(isOpen){
            // Close all other details
            allDetails.forEach(function(otherDetails){
              if(otherDetails !== details && otherDetails.open){
                otherDetails.open = false;
                var otherSummary = otherDetails.querySelector('summary');
                if(otherSummary) {
                  otherSummary.setAttribute('aria-expanded', 'false');
                }
              }
            });
          }
        });
      });
      
      return allDetails.length;
    } catch(error) {
      console.error('Failed to initialize FAQ accordion:', error);
      return 0;
    }
  };
  
  window.IOSTheme = IOSTheme;
})();
