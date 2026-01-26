/**
 * Cart Functionality
 * Handles quantity updates, item removal, and cart count updates
 */

(function() {
  'use strict';

  var IOSTheme = window.IOSTheme || {};
  IOSTheme.Cart = {
    init: function() {
      this.bindEvents();
      this.updateCartCount();
    },

    bindEvents: function() {
      var self = this;
      
      // Quantity controls
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action="increase"], [data-action="decrease"]');
        if (btn) {
          e.preventDefault();
          self.handleQuantityChange(btn);
        }
      });

      // Remove item
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action="remove"]');
        if (btn) {
          e.preventDefault();
          self.handleRemoveItem(btn);
        }
      });

      // Quantity input changes
      document.addEventListener('change', function(e) {
        if (e.target.classList.contains('ios-quantity-input')) {
          self.handleQuantityInput(e.target);
        }
      });

      // Update cart count when cart changes (for cart drawer/updates)
      document.addEventListener('cart:updated', function() {
        self.updateCartCount();
      });
    },

    handleQuantityChange: function(btn) {
      var action = btn.getAttribute('data-action');
      var itemKey = btn.getAttribute('data-item-key');
      var input = document.querySelector('.ios-quantity-input[data-item-key="' + itemKey + '"]');
      
      if (!input) return;

      var currentQty = parseInt(input.value, 10) || 0;
      var newQty = action === 'increase' ? currentQty + 1 : Math.max(0, currentQty - 1);

      if (newQty === 0) {
        this.removeItem(itemKey);
      } else {
        this.updateQuantity(itemKey, newQty);
      }
    },

    handleQuantityInput: function(input) {
      var itemKey = input.getAttribute('data-item-key');
      var qty = parseInt(input.value, 10) || 0;

      if (qty <= 0) {
        this.removeItem(itemKey);
      } else {
        this.updateQuantity(itemKey, qty);
      }
    },

    handleRemoveItem: function(btn) {
      var itemKey = btn.getAttribute('data-item-key');
      if (confirm('Remove this item from cart?')) {
        this.removeItem(itemKey);
      }
    },

    updateQuantity: function(itemKey, quantity) {
      var self = this;
      var form = document.querySelector('.ios-cart-form');
      if (!form) return;

      var input = form.querySelector('.ios-quantity-input[data-item-key="' + itemKey + '"]');
      if (!input) return;

      var cartItem = input.closest('.ios-cart-item');
      if (cartItem) {
        cartItem.classList.add('ios-loading');
      }

      var formData = new FormData(form);
      formData.set('updates[]', quantity);

      fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: this.getUpdatesObject(formData)
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(cart) {
        self.refreshCart();
      })
      .catch(function(error) {
        console.error('Cart update error:', error);
        if (cartItem) cartItem.classList.remove('ios-loading');
        alert('Failed to update cart. Please try again.');
      });
    },

    removeItem: function(itemKey) {
      var self = this;
      var cartItem = document.querySelector('.ios-cart-item[data-cart-item-key="' + itemKey + '"]');
      if (!cartItem) return;

      cartItem.classList.add('ios-loading');

      var form = document.querySelector('.ios-cart-form');
      if (!form) return;

      var input = form.querySelector('.ios-quantity-input[data-item-key="' + itemKey + '"]');
      if (!input) return;

      var formData = new FormData(form);
      formData.set('updates[]', 0);

      fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: this.getUpdatesObject(formData)
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(cart) {
        if (cart.item_count === 0) {
          window.location.reload();
        } else {
          self.refreshCart();
        }
      })
      .catch(function(error) {
        console.error('Cart remove error:', error);
        cartItem.classList.remove('ios-loading');
        alert('Failed to remove item. Please try again.');
      });
    },

    getUpdatesObject: function(formData) {
      var updates = {};
      var inputs = document.querySelectorAll('.ios-quantity-input');
      inputs.forEach(function(input) {
        var cartItem = input.closest('.ios-cart-item');
        if (cartItem) {
          var key = cartItem.getAttribute('data-cart-item-key');
          var qty = parseInt(input.value, 10) || 0;
          updates[key] = qty;
        }
      });
      return updates;
    },

    refreshCart: function() {
      // Reload the page to show updated cart
      window.location.reload();
    },

    updateCartCount: function() {
      var cartIcon = document.querySelector('.ios-cart-icon');
      var badge = cartIcon ? cartIcon.querySelector('.ios-cart-badge') : null;
      var mobileLink = document.querySelector('.ios-mobile-cart-link .ios-cart-count');

      fetch('/cart.js')
        .then(function(response) {
          return response.json();
        })
        .then(function(cart) {
          var count = cart.item_count || 0;
          
          if (badge) {
            if (count > 0) {
              badge.textContent = count;
              badge.style.display = '';
            } else {
              badge.style.display = 'none';
            }
          }

          if (mobileLink) {
            if (count > 0) {
              mobileLink.textContent = '(' + count + ')';
              mobileLink.style.display = '';
            } else {
              mobileLink.style.display = 'none';
            }
          }

          // Dispatch event for other scripts
          document.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: count } }));
        })
        .catch(function(error) {
          console.error('Failed to update cart count:', error);
        });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      IOSTheme.Cart.init();
    });
  } else {
    IOSTheme.Cart.init();
  }

  // Make Cart available globally
  window.IOSTheme = IOSTheme;
})();
