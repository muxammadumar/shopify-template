(function(){
  'use strict';
  
  // Smooth scroll polyfill for older browsers
  function smoothScrollTo(element){
    if('scrollBehavior' in document.documentElement.style){
      element.scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      // Fallback for browsers without smooth scroll support
      var targetPos = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({top: targetPos, behavior:'smooth'});
    }
  }
  
  // Smooth scroll for anchor links
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(link){
    link.addEventListener('click', function(e){
      var href = link.getAttribute('href');
      if(!href || href === '#') return;
      
      var target = document.querySelector(href);
      if(!target) return;
      
      e.preventDefault();
      smoothScrollTo(target);
      
      // Close mobile menu if open
      var mobileNav = document.getElementById('iosMobileNav');
      if(mobileNav && mobileNav.classList.contains('open')){
        mobileNav.classList.remove('open');
      }
      
      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
      setTimeout(function(){
        target.removeAttribute('tabindex');
      }, 1000);
    });
  });
  
  // Mobile menu toggle
  var burger = document.getElementById('iosBurger');
  var mobileNav = document.getElementById('iosMobileNav');
  
  if(burger && mobileNav){
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      burger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
      
      // Trap focus in mobile menu when open
      if(isOpen){
        var firstLink = mobileNav.querySelector('a');
        if(firstLink) firstLink.focus();
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e){
      if(mobileNav.classList.contains('open')){
        var isClickInside = mobileNav.contains(e.target) || burger.contains(e.target);
        if(!isClickInside){
          mobileNav.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          burger.setAttribute('aria-label', 'Menü öffnen');
        }
      }
    });
    
    // Close mobile menu on ESC key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && mobileNav.classList.contains('open')){
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Menü öffnen');
        burger.focus();
      }
    });
  }
  
  // FAQ accordion - only one open at a time
  var allDetails = Array.prototype.slice.call(document.querySelectorAll('details'));
  allDetails.forEach(function(details){
    details.addEventListener('toggle', function(){
      if(!details.open) return;
      allDetails.forEach(function(otherDetails){
        if(otherDetails !== details){
          otherDetails.open = false;
        }
      });
    });
  });
  
  // Cookie consent banner (GDPR)
  var cookieBanner = document.getElementById('iosCookieBanner');
  if(cookieBanner){
    // Check if user has already consented
    var hasConsented = localStorage.getItem('cookieConsent');
    
    if(!hasConsented){
      // Show banner after short delay
      setTimeout(function(){
        cookieBanner.classList.add('show');
      }, 1000);
    }
    
    // Accept button
    var acceptBtn = document.getElementById('acceptCookies');
    if(acceptBtn){
      acceptBtn.addEventListener('click', function(){
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }
    
    // Decline button
    var declineBtn = document.getElementById('declineCookies');
    if(declineBtn){
      declineBtn.addEventListener('click', function(){
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }
  
  // Add loading state to CTA buttons
  var ctaButtons = document.querySelectorAll('.ios-btn[href*="launchheld.com"]');
  ctaButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      if(!btn.classList.contains('loading')){
        btn.classList.add('loading');
        var originalText = btn.textContent;
        btn.textContent = 'Lädt...';
        
        // Revert after navigation (or timeout)
        setTimeout(function(){
          btn.textContent = originalText;
          btn.classList.remove('loading');
        }, 3000);
      }
    });
  });
  
  // Detect reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReducedMotion){
    document.documentElement.style.scrollBehavior = 'auto';
  }
  
  // Add error handling for images
  var images = document.querySelectorAll('img');
  images.forEach(function(img){
    img.addEventListener('error', function(){
      img.style.display = 'none';
      console.warn('Failed to load image:', img.src);
    });
  });
  
  // Performance: Lazy load images if Intersection Observer is supported
  if('IntersectionObserver' in window){
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
  }
  
  // Debug mode for development
  if(window.location.search.indexOf('debug=1') > -1){
    console.log('GoldBrand Theme - Debug Mode');
    console.log('Anchor links:', anchorLinks.length);
    console.log('FAQ items:', allDetails.length);
    console.log('Cookie banner:', cookieBanner ? 'Present' : 'Missing');
    console.log('Reduced motion:', prefersReducedMotion);
  }
  
})();
