// script.js

// 1. Select all "Add to Cart" buttons
const buttons = document.querySelectorAll('button');
const cartNav = document.querySelector('.cart-btn');

// 2. Initialize Cart Count (Check if user already has items)
let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
updateCartDisplay();

// 3. Add Click Event to all buttons
buttons.forEach(button => {
    button.addEventListener('click', function() {
        if(this.innerText === "Add to Cart") {
            cartCount++;
            localStorage.setItem('cartCount', cartCount); // Save to memory
            updateCartDisplay();
            
            // Visual Feedback
            this.innerText = "Added!";
            this.style.backgroundColor = "#28a745"; // Green color
            
            setTimeout(() => {
                this.innerText = "Add to Cart";
                this.style.backgroundColor = "#222"; // Back to black
            }, 2000);
        }
    });
});

// 4. Function to update the top right corner text
function updateCartDisplay() {
    if(cartNav) {
        cartNav.innerText = `Cart (${cartCount})`;
    }
}
/* --- NEW: CLEAR CART FUNCTIONALITY --- */

// 1. Select the Clear Button (We will add this to HTML next)
const clearBtn = document.querySelector('.clear-cart-btn');

// 2. Add Click Event
if(clearBtn) {
    clearBtn.addEventListener('click', function() {
        // A. Reset variable
        cartCount = 0;
        
        // B. Clear memory
        localStorage.setItem('cartCount', 0);
        
        // C. Update Display
        updateCartDisplay();
        
        // D. Visual Feedback
        alert("Cart has been cleared!");
        
        // E. (Optional) clear the table visually if on cart page
        const cartTableBody = document.getElementById('cart-items');
        if(cartTableBody) {
            cartTableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Your cart is empty</td></tr>";
        }
    });
}