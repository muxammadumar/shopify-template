/**
 * Language selector dropdown functionality
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Initialize language selector dropdown
   */
  IOSTheme.initLanguageSelector = function(){
    try {
      var selector = document.querySelector('.ios-language-selector');
      var trigger = document.getElementById('iosLanguageTrigger');
      var list = document.getElementById('iosLanguageList');
      var flagEl = document.getElementById('iosLanguageFlag');
      var codeEl = document.getElementById('iosLanguageCode');
      
      if(!selector || !trigger || !list || !flagEl || !codeEl) {
        return false;
      }
      
      // Helper functions
      function closeDropdown(){
        selector.setAttribute('aria-expanded', 'false');
        list.setAttribute('hidden', 'true');
      }
      
      function openDropdown(){
        selector.setAttribute('aria-expanded', 'true');
        list.removeAttribute('hidden');
      }
      
      // Toggle dropdown
      trigger.addEventListener('click', function(e){
        e.stopPropagation();
        var isOpen = selector.getAttribute('aria-expanded') === 'true';
        
        if(isOpen){
          closeDropdown();
        } else {
          openDropdown();
          // Focus first option when opening
          var firstOption = list.querySelector('li[role="option"]');
          if(firstOption) {
            firstOption.focus();
          }
        }
      });
      
      // Handle option selection
      var options = list.querySelectorAll('li[role="option"]');
      options.forEach(function(option){
        option.addEventListener('click', function(e){
          var link = option.querySelector('a');
          if(link && link.href){
            // Let the link handle navigation naturally
            window.location.href = link.href;
          } else {
            // Fallback: construct URL manually
            var locale = option.getAttribute('data-locale');
            if(locale) {
              var currentPath = window.location.pathname;
              var localePath = '/' + locale;
              if(currentPath.startsWith('/de') || currentPath.startsWith('/en')){
                currentPath = currentPath.replace(/^\/(de|en)/, '');
              }
              if(currentPath === '/' || currentPath === ''){
                window.location.href = localePath;
              } else {
                window.location.href = localePath + currentPath;
              }
            }
          }
        });
        
        option.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            option.click();
          } else if(e.key === 'Escape'){
            closeDropdown();
            trigger.focus();
          } else if(e.key === 'ArrowDown'){
            e.preventDefault();
            var next = option.nextElementSibling;
            if(next) next.focus();
          } else if(e.key === 'ArrowUp'){
            e.preventDefault();
            var prev = option.previousElementSibling;
            if(prev) prev.focus();
            else trigger.focus();
          }
        });
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e){
        if(!selector.contains(e.target)){
          closeDropdown();
        }
      });
      
      // Close on ESC key
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && selector.getAttribute('aria-expanded') === 'true'){
          closeDropdown();
          trigger.focus();
        }
      });
      
      return true;
    } catch(error) {
      console.error('Failed to initialize language selector:', error);
      return false;
    }
  };
  
  window.IOSTheme = IOSTheme;
})();
