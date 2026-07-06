let cartState = JSON.parse(localStorage.getItem('aoi_cart_memory')) || [];
const deliveryFee = 100;
// function getShippingCharge(state) {
//     // state = state.toLowerCase();
//     if (state === "Andhra Pradesh") return 450;
//     if (state === "Arunachal Pradesh") return 650;
//     if (state === "Assam") return 650;
//     if (state === "Bihar") return 350;
//     if (state === "Chhattisgarh") return 350;
//     if (state === "Delhi") return 150;
//     if (state === "Goa") return 450;
//     if (state === "Gujarat") return 350;
//     if (state === "Haryana") return 180;
//     if (state === "Himachal Pradesh") return 150;
//     if (state === "Jharkhand") return 350;
//     if (state === "Jammu and Kashmir") return 250;
//     if (state === "Karnataka") return 450;
//     if (state === "Kerala") return 550;
//     if (state === "Madhya Pradesh") return 250;
//     if (state === "Maharashtra") return 350;
//     if (state === "Manipur") return 650;
//     if (state === "Meghalaya") return 650;
//     if (state === "Mizoram") return 650;
//     if (state === "Nagaland") return 650;
//     if (state === "Odisha") return 350;
//     if (state === "Puducherry") return 550;
//     if (state === "Punjab") return 180;
//     if (state === "Rajasthan") return 250;
//     if (state === "Sikkim") return 650;
//     if (state === "Tamil Nadu") return 550;
//     if (state === "Telangana") return 450;
//     if (state === "Tripura") return 650;
//     if (state === "Uttarakhand") return 180;
//     if (state === "Uttar Pradesh") return 150;
//     if (state === "West Bengal") return 350;
   
//     return 400;
// }
document.addEventListener("DOMContentLoaded", () => {

    const stateField = document.getElementById("cust-state");

    if(stateField){
        stateField.addEventListener("change", function(){

            let shipping = getShippingCharge(this.value);

            let shippingBox = document.getElementById("shipping-charge");

            if(shippingBox){
                shippingBox.innerText = "₹" + shipping + ".00";
            }

            let subtotal = parseFloat(
                document.getElementById("chk-subtotal")
                .innerText.replace(/[₹,]/g,"")
            );

            document.getElementById("chk-grandtotal").innerText =
                "₹" + (subtotal + shipping).toLocaleString("en-IN") + ".00";
        });
    }

});

// shipping charge calculation based on state selection closed


document.addEventListener("DOMContentLoaded", () => {
    synchronizeCartCounterUI();
    if (document.getElementById('cart-items')) {
        renderCartPageDashboard();
    }
    syncNavbarHighlightLinks();
});

function syncNavbarHighlightLinks() {
    let path = window.location.pathname;
    let homeTab = document.getElementById('nav-home');
    let scoopTab = document.getElementById('nav-mystery');
    let prodTab = document.getElementById('nav-products');
    let aboutTab = document.getElementById('nav-about');

    if (homeTab) homeTab.classList.remove('active');
    if (scoopTab) scoopTab.classList.remove('active');
    if (prodTab) prodTab.classList.remove('active');
    if (aboutTab) aboutTab.classList.remove('active');

    if (path.includes('index.html') || path === '/') homeTab?.classList.add('active');
    else if (path.includes('mystery-scoop.html')) { scoopTab?.classList.add('active'); prodTab?.classList.add('active'); }
    else if (path.includes('about.html')) aboutTab?.classList.add('active');
}

function adjustFormQty(amt) {
    let field = document.getElementById('form-qty-val');
    if (field) {
        let currentVal = parseInt(field.value) + amt;
        if (currentVal >= 1) field.value = currentVal;
    }
}

// fgd about
        // document.getElementById('nav-home').classList.remove('active');
        // document.getElementById('nav-mystery').classList.remove('active');
        // if(document.getElementById('nav-about')) document.getElementById('nav-about').classList.remove('active');

        // if(viewId === 'home-view') document.getElementById('nav-home').classList.add('active');
        // if(viewId === 'products-view') document.getElementById('nav-mystery').classList.add('active');
        // if(viewId === 'about-view' && document.getElementById('nav-about')) document.getElementById('nav-about').classList.add('active'); 


        // end 
function executeAddToCart() {
    let title = document.getElementById('detail-title')?.innerText || "Mystery Scoop Selection";
    let priceText = document.getElementById('detail-price')?.innerText || "₹599";
    let cleanedPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 599;
    let image = document.getElementById('detail-img')?.src || "";
    
    let qty = parseInt(document.getElementById('form-qty-val')?.value) || 1;
    let exclusion = document.getElementById('custom-exclusion-input')?.value.trim() || "None";

    let lookIdx = cartState.findIndex(item => item.name === title && item.exclusions === exclusion);
    if (lookIdx > -1) {
        cartState[lookIdx].qty += qty;
    } else {
        cartState.push({ name: title, price: cleanedPrice, img: image, qty: qty, exclusions: exclusion });
    }

    localStorage.setItem('aoi_cart_memory', JSON.stringify(cartState));
    alert("✨ Successfully added items to your basket!");
    synchronizeCartCounterUI();
}

function synchronizeCartCounterUI() {
    let total = cartState.reduce((sum, item) => sum + item.qty, 0);
    let counter = document.getElementById('global-cart-counter');
    if (counter) counter.innerText = total;
}

function renderCartPageDashboard() {
    let itemsBody = document.getElementById('cart-items');
    let emptyBox = document.getElementById('empty-cart-state');
    let activeBox = document.getElementById('populated-cart-state');

    if (!itemsBody) return;

    if (cartState.length === 0) {
        emptyBox.style.display = "block";
        activeBox.style.display = "none";
        return;
    }

    emptyBox.style.display = "none";
    activeBox.style.display = "grid";
    itemsBody.innerHTML = "";
    let calculatedSubtotal = 0;

    cartState.forEach((item, index) => {
        let rowTotal = item.price * item.qty;
        calculatedSubtotal += rowTotal;

        itemsBody.innerHTML += `
            <tr>
                <td><span style="cursor:pointer; color:#b01e1e;" onclick="dropItem(${index})">❌</span></td>
                <td><img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;"></td>
                <td style="font-weight:500;">${item.name}</td>
                <td style="font-size:13px; color:#777;">${item.exclusions}</td>
                <td>₹${item.price.toLocaleString('en-IN')}.00</td>
                <td>${item.qty}</td>
                <td style="font-weight:600;">₹${rowTotal.toLocaleString('en-IN')}.00</td>
            </tr>`;
    });

    document.getElementById('summary-subtotal').innerText = "₹" + calculatedSubtotal.toLocaleString('en-IN') + ".00";
    document.getElementById('summary-grandtotal').innerText = "₹" + (calculatedSubtotal + deliveryFee).toLocaleString('en-IN') + ".00";
}

function dropItem(index) {
    cartState.splice(index, 1);
    localStorage.setItem('aoi_cart_memory', JSON.stringify(cartState));
    synchronizeCartCounterUI();
    renderCartPageDashboard();
}
// ==========================================
// CHECKOUT SUMMARY HANDLING
// ==========================================
function renderCheckoutSummaryBlock() {
    let container = document.getElementById('checkout-summary-items');
    if (!container) return;

    let subtotal = 0;
    container.innerHTML = "";

    cartState.forEach(item => {
        let rowTotal = item.price * item.qty;
        subtotal += rowTotal;

        container.innerHTML += `
            <div class="checkout-mini-item" style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: var(--text-muted);">
                <span><strong>${item.name}</strong> (x${item.qty})</span>
                <span>₹${rowTotal.toLocaleString('en-IN')}.00</span>
            </div>
            <div style="font-size:11px; margin-top:-8px; margin-bottom:12px; color:#999; padding-left:2px;">
                Exclusions: ${item.exclusions}
            </div>
        `;
    });

    let chkSubtotal = document.getElementById('chk-subtotal');
    let chkGrandtotal = document.getElementById('chk-grandtotal');

    if (chkSubtotal) chkSubtotal.innerText = "₹" + subtotal.toLocaleString('en-IN') + ".00";
    if (chkGrandtotal) chkGrandtotal.innerText = "₹" + (subtotal + deliveryFee).toLocaleString('en-IN') + ".00";
}

// Modify your DOMContentLoaded block or add this to check for checkout summary items on load
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('checkout-summary-items')) {
        renderCheckoutSummaryBlock();
    }
});
function initiateCheckoutWorkflow() {
    if (cartState.length === 0) {
        alert("Your cart is empty! Add some cute items before checking out.");
        return;
    }
    window.location.href = 'checkout.html';
}
// ======================================================
// PART 4: CHECKOUT SUMMARY MANAGER
// ======================================================

// This function automatically runs whenever ANY page loads.
// It checks if we are on the checkout page by looking for the 
// specific 'checkout-mini-items' container.
window.onload = function() {
    console.log("DOM is ready. Running shared multi-page synchronization...");
    
    // Global function calls that run on all pages
    synchronizeNavbarHighlightLinks(); // from Part 3
    synchronizeCartCounterUI();        // from Part 1

    // Part A: Cart Page check and dynamic rendering
    let itemsTableBody = document.getElementById('cart-items');
    if (itemsTableBody) {
        console.log("Cart page detected. Rendering full dashboard...");
        renderCartPageDashboard(); // from Part 2
    }

    // Part B: Checkout Page check and dynamic rendering
    let checkoutItemsBlock = document.getElementById('checkout-summary-items');
    if (checkoutItemsBlock) {
        console.log("Checkout page detected. Running Part 4: Checkout Summary Manager...");
        renderCheckoutSummaryBlock();
    }
};

function renderCheckoutSummaryBlock() {
    let container = document.getElementById('checkout-summary-items');
    
    // Safety check: Don't run this code on pages that don't have this container (e.g., cart.html)
    if (!container) return;

    // Use your global cartState variable which Part 1 already loaded from memory
    if (cartState.length === 0) {
        // Handle the case where the user somehow got to checkout with an empty cart
        container.innerHTML = "<p style='color: var(--text-muted); font-size:14px; text-align:center;'>Your cart is empty.</p>";
        updateCheckoutSummaryCosts(0);
        return;
    }

    // Prepare the list rendering
    container.innerHTML = "";
    let calculatedSubtotal = 0;

    cartState.forEach((item) => {
        let rowTotal = item.price * item.qty;
        calculatedSubtotal += rowTotal;

        // Use a clean, simplified mini-preview layout from Part 4 for the checkout sidebar
        container.innerHTML += `
            <div class="checkout-mini-item" style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: var(--text-muted);">
                <span><strong>${item.name}</strong> (x${item.qty})</span>
                <span>₹${rowTotal.toLocaleString('en-IN')}.00</span>
            </div>
            <div style="font-size:11px; margin-top:-8px; margin-bottom:12px; color:#999; padding-left:2px;">
                Exclusions: ${item.exclusions}
            </div>
        `;
    });

    updateCheckoutSummaryCosts(calculatedSubtotal);
}

// Separate helper function to update the bottom total line items
function updateCheckoutSummaryCosts(subtotal) {
    let chkSubtotalField = document.getElementById('chk-subtotal');
    let chkGrandtotalField = document.getElementById('chk-grandtotal');

    if (chkSubtotalField) {
        chkSubtotalField.innerText = "₹" + subtotal.toLocaleString('en-IN') + ".00";
    }

    // If subtotal is greater than zero, add the delivery fee
    let finalTotal = subtotal;
    if (finalTotal > 0) {
        // Re-use your global deliveryFee variable from Part 1
        finalTotal += deliveryFee;
    }

    if (chkGrandtotalField) {
        chkGrandtotalField.innerText = "₹" + finalTotal.toLocaleString('en-IN') + ".00";

    }
}
// new add now 
// ==========================================
// RAZORPAY CHECKOUT & PAYMENT HANDLER
// ==========================================
async function handleFormSubmit(e) {
    e.preventDefault(); // Stops the page from refreshing when you click submit

    // 1. Grab customer data from your HTML inputs
    const customerData = {
        name: document.getElementById('cust-fname').value + " " + document.getElementById('cust-lname').value,
        email: document.getElementById('cust-email').value,
        phone: document.getElementById('cust-phone').value
    };

    // 2. Calculate Final Total (Subtotal + Delivery)
    let subtotal = 0;
    cartState.forEach(item => subtotal += (item.price * item.qty));
    
    // Using the deliveryFee variable you defined at the top of your file (100)
    const finalTotal = subtotal + deliveryFee; 

    // 3. Update Button State to show it's loading
    const payBtn = document.getElementById('pay-btn');
    const originalText = payBtn.innerText;
    payBtn.innerText = "Processing...";
    payBtn.disabled = true;

    try {
        // 4. Ask your Node.js backend to create an Order ID
        const response = await fetch('https://aoi-mystery-scoops.onrender.com/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: finalTotal })
        });
        
        if (!response.ok) throw new Error("Backend not responding properly");
        const data = await response.json();

        // 5. Open Razorpay Popup
        const options = {
            "key": "rzp_test_TACbm478WmFfJF", // Your Razorpay Test Key
            "amount": data.order.amount,
            "currency": "INR",
            "name": "AOI - Mystery Scoops",
            "order_id": data.order.id,
            "prefill": {
                "name": customerData.name,
                "email": customerData.email,
                "contact": customerData.phone
            },
            "theme": { "color": "#ff63a5" },
            "handler": async function (response) {
                // 6. On Success: Verify payment with backend
                const verifyRes = await fetch('https://aoi-mystery-scoops.onrender.com/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(response)
                });
                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    // Show Congratulations Screen!
                    document.getElementById('checkout-form-screen').style.display = 'none';
                    document.getElementById('success-screen').style.display = 'flex'; 
                    
                    // Clear the cart
                    localStorage.removeItem('aoi_cart_memory'); 
                    cartState = [];
                    if(document.getElementById('global-cart-counter')) {
                         document.getElementById('global-cart-counter').innerText = "0";
                    }
                } else {
                    alert("Payment verification failed! Please contact support.");
                }
            }
        };

        const rzp = new Razorpay(options);
        
        // 7. On Failure: Let user try again
        rzp.on('payment.failed', function (response){
            alert("Payment failed! Reason: " + response.error.description);
            payBtn.innerText = originalText;
            payBtn.disabled = false;
        });

        rzp.open();

    } catch (error) {
        console.error("Checkout Error:", error);
        alert("Server error. Please make sure your Node.js backend (server.js) is running in the terminal!");
        payBtn.innerText = originalText;
        payBtn.disabled = false;
    }
}







