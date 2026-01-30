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
      
      // Add to cart from pricing section
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.ios-add-to-cart-btn');
        if (btn && !btn.disabled) {
          e.preventDefault();
          self.addToCart(btn);
        }
      });

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

    addToCart: function(btn) {
      var self = this;
      var variantId = btn.getAttribute('data-variant-id');
      var productId = btn.getAttribute('data-product-id');
      var productTitle = btn.getAttribute('data-product-title') || 'Product';

      if (!variantId) {
        this.showNotification('Error: Product variant not found', 'error');
        return;
      }

      // Show loading state
      var btnText = btn.querySelector('.btn-text');
      var btnLoading = btn.querySelector('.btn-loading');
      btn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: variantId,
            quantity: 1
          }]
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Success
        self.showNotification(productTitle + ' added to cart!', 'success');
        self.updateCartCount();
        
        // Reset button state after a short delay
        setTimeout(function() {
          btn.disabled = false;
          if (btnText) btnText.style.display = '';
          if (btnLoading) btnLoading.style.display = 'none';
        }, 1000);
      })
      .catch(function(error) {
        console.error('Add to cart error:', error);
        self.showNotification('Failed to add product to cart. Please try again.', 'error');
        
        // Reset button state
        btn.disabled = false;
        if (btnText) btnText.style.display = '';
        if (btnLoading) btnLoading.style.display = 'none';
      });
    },

    showNotification: function(message, type) {
      type = type || 'success';
      
      // Remove existing notification if any
      var existing = document.querySelector('.ios-cart-notification');
      if (existing) {
        existing.remove();
      }

      // Create notification element
      var notification = document.createElement('div');
      notification.className = 'ios-cart-notification ios-cart-notification-' + type;
      notification.textContent = message;
      
      // Add styles if not already in page
      if (!document.getElementById('ios-cart-notification-styles')) {
        var style = document.createElement('style');
        style.id = 'ios-cart-notification-styles';
        style.textContent = `
          .ios-cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: ios-notification-slide-in 0.3s ease-out;
            max-width: 400px;
            font-size: 14px;
            line-height: 1.5;
          }
          .ios-cart-notification-success {
            background-color: #10b981;
            color: white;
          }
          .ios-cart-notification-error {
            background-color: #ef4444;
            color: white;
          }
          @keyframes ios-notification-slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @media (max-width: 768px) {
            .ios-cart-notification {
              top: 10px;
              right: 10px;
              left: 10px;
              max-width: none;
            }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(notification);

      // Auto remove after 3 seconds
      setTimeout(function() {
        notification.style.animation = 'ios-notification-slide-in 0.3s ease-out reverse';
        setTimeout(function() {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }, 3000);
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
