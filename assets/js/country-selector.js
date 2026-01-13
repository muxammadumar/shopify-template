/**
 * Country selector dropdown functionality
 * @namespace IOSTheme
 */
(function(){
  'use strict';
  
  var IOSTheme = window.IOSTheme || {};
  
  /**
   * Initialize country selector dropdown
   */
  IOSTheme.initCountrySelector = function(){
    try {
      var selector = document.querySelector('.ios-country-selector');
      var trigger = document.getElementById('iosCountryTrigger');
      var list = document.getElementById('iosCountryList');
      var flagEl = document.getElementById('iosCountryFlag');
      var nameEl = document.getElementById('iosCountryName');
      
      if(!selector || !trigger || !list || !flagEl || !nameEl) {
        return false;
      }
      
      // Load saved country from localStorage
      var savedCountry = localStorage.getItem('selectedCountry');
      if(savedCountry){
        var savedOption = list.querySelector('[data-country="' + savedCountry + '"]');
        if(savedOption){
          updateSelection(savedOption);
        }
      }
      
      // Toggle dropdown
      trigger.addEventListener('click', function(e){
        e.stopPropagation();
        var isOpen = selector.getAttribute('aria-expanded') === 'true';
        selector.setAttribute('aria-expanded', !isOpen);
        
        if(!isOpen){
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
        option.addEventListener('click', function(){
          selectOption(option);
        });
        
        option.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            selectOption(option);
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
      
      function selectOption(option){
        updateSelection(option);
        closeDropdown();
        trigger.focus();
        
        // Save to localStorage
        var country = option.getAttribute('data-country');
        localStorage.setItem('selectedCountry', country);
        
        // Optional: Trigger custom event
        var event = new CustomEvent('countrySelected', {
          detail: {
            country: country,
            flag: option.getAttribute('data-flag'),
            name: option.getAttribute('data-name')
          }
        });
        document.dispatchEvent(event);
      }
      
      function updateSelection(option){
        flagEl.textContent = option.getAttribute('data-flag');
        nameEl.textContent = option.getAttribute('data-name');
        
        // Update aria-selected
        options.forEach(function(opt){
          opt.setAttribute('aria-selected', 'false');
        });
        option.setAttribute('aria-selected', 'true');
      }
      
      function closeDropdown(){
        selector.setAttribute('aria-expanded', 'false');
      }
      
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
      console.error('Failed to initialize country selector:', error);
      return false;
    }
  };
  
  window.IOSTheme = IOSTheme;
})();
