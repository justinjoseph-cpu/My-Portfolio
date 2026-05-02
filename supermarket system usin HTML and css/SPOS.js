// SPOS.js - Smart Point of Sale System
// Add this file to ALL HTML pages before </body>

// ==================== 1. PRODUCT MANAGEMENT ====================
const ProductManager = {
    STORAGE_KEY: 'spos_products',

    getAllProducts() {
        const products = localStorage.getItem(this.STORAGE_KEY);
        return products ? JSON.parse(products) : [];
    },

    saveProduct(product) {
        const products = this.getAllProducts();
        product.id = Date.now(); // Unique ID
        product.createdAt = new Date().toISOString();
        products.push(product);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
        return product;
    },

    updateProduct(id, updates) {
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
            return true;
        }
        return false;
    },

    deleteProduct(id) {
        const products = this.getAllProducts().filter(p => p.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    },

    sellProduct(productId, quantity) {
        const products = this.getAllProducts();
        const product = products.find(p => p.id === productId);

        if (product && product.quantity >= quantity) {
            product.quantity -= quantity;

            // Save sale record
            const sale = {
                productId,
                productName: product.name,
                quantity,
                price: product.price,
                total: product.price * quantity,
                date: new Date().toISOString()
            };

            this.saveSale(sale);
            this.updateProduct(productId, { quantity: product.quantity });

            return {
                success: true,
                message: `Sold ${quantity} of ${product.name}`,
                remaining: product.quantity
            };
        }

        return {
            success: false,
            message: product ? 'Insufficient quantity' : 'Product not found'
        };
    },

    saveSale(sale) {
        const sales = this.getSales();
        sales.push(sale);
        localStorage.setItem('spos_sales', JSON.stringify(sales));
    },

    getSales() {
        return JSON.parse(localStorage.getItem('spos_sales') || '[]');
    },

    getProductByBarcode(barcode) {
        return this.getAllProducts().find(p => p.barcode === barcode);
    }
};

// ==================== 2. AUTHENTICATION ====================
const AuthManager = {
    STORAGE_KEY: 'spos_users',
    CURRENT_USER_KEY: 'spos_current_user',

    init() {
        this.setupAuthForms();
        this.checkAuthStatus();
    },

    setupAuthForms() {
        // Login form - FIXED: remove the form submission override
        const loginForm = document.querySelector('form[action="index.html"]');
        if (loginForm) {
            // Remove any existing listener first
            const newLoginForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);

            newLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Register form - FIXED: remove the form submission override
        const registerForm = document.querySelector('form[action="login.html"]');
        if (registerForm) {
            const newRegisterForm = registerForm.cloneNode(true);
            registerForm.parentNode.replaceChild(newRegisterForm, registerForm);

            newRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        }

        // Logout buttons
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href="login.html"]');
            if (link && !link.href.includes('#')) {
                e.preventDefault();
                this.logout();
            }
        });
    },

    handleLogin(e) {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.setCurrentUser(user);
            window.location.href = 'home.html';
        } else {
            alert('Invalid email or password');
        }
    },

    handleRegister(e) {
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!name || !email || !password) {
            alert('Please fill all fields');
            return;
        }

        const users = this.getUsers();

        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        this.setCurrentUser(newUser);

        alert(`Welcome ${name}! Registration successful.`);
        window.location.href = 'home.html';
    },

    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'login.html';
    },

    setCurrentUser(user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    },

    getCurrentUser() {
        const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },

    checkAuthStatus() {
        const currentUser = this.getCurrentUser();
        const currentPage = window.location.pathname.split('/').pop() || 'login.html';

        const publicPages = ['login.html', 'register.html'];

        if (!currentUser && !publicPages.includes(currentPage)) {
            window.location.href = 'login.html';
            return false;
        }

        if (currentUser && publicPages.includes(currentPage)) {
            window.location.href = 'home.html';
            return false;
        }

        // Display user info if logged in
        if (currentUser && !publicPages.includes(currentPage)) {
            this.displayUserInfo(currentUser);
        }

        return true;
    },

    displayUserInfo(user) {
        // Remove existing user display
        const existingDisplay = document.getElementById('user-display');
        if (existingDisplay) existingDisplay.remove();

        // Add user display BELOW the Smart Retail System text
        const userDisplay = document.createElement('div');
        userDisplay.id = 'user-display';
        userDisplay.style.cssText = `
            position: absolute;
            top: 100px;
            left: 60px;
            background: #46007b;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 100;
        `;

        userDisplay.innerHTML = `<span>👤</span><span>${user.name}</span>`;
        document.body.appendChild(userDisplay);
    }
};

// ==================== 3. ADD PRODUCT MANAGEMENT ====================
const AddProductManager = {
    init() {
        const form = document.querySelector('.form');
        if (form) {
            // Clone form to remove existing event listeners
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            newForm.addEventListener('submit', (e) => this.handleAddProduct(e));

            // Set barcode as required
            const barcodeInput = document.getElementById('barcode');
            if (barcodeInput) {
                barcodeInput.required = true;
                barcodeInput.pattern = "[0-9]*";
                barcodeInput.title = "Enter barcode (numbers only)";

                // Auto-focus on barcode
                setTimeout(() => barcodeInput.focus(), 100);

                // Auto-tab after barcode scan (13 digits)
                barcodeInput.addEventListener('input', (e) => {
                    if (e.target.value.length >= 13) {
                        document.getElementById('product_name')?.focus();
                    }
                });
            }
        }
    },

    handleAddProduct(e) {
        e.preventDefault();

        const barcode = document.getElementById('barcode')?.value.trim();

        if (!barcode) {
            alert('Barcode is required');
            document.getElementById('barcode')?.focus();
            return false;
        }

        // Check if barcode already exists
        const existingProduct = ProductManager.getProductByBarcode(barcode);
        if (existingProduct) {
            const update = confirm(`Product "${existingProduct.name}" already exists.\nUpdate quantity?`);
            if (update) {
                const addQty = prompt(`Add to current quantity (${existingProduct.quantity}):`, '1');
                if (addQty && !isNaN(addQty)) {
                    const newQty = existingProduct.quantity + parseInt(addQty);
                    ProductManager.updateProduct(existingProduct.id, { quantity: newQty });
                    this.showMessage(`Added ${addQty} to ${existingProduct.name}`, 'success');
                }
            }
            e.target.reset();
            document.getElementById('barcode')?.focus();
            return false;
        }

        const product = {
            name: document.getElementById('product_name')?.value || '',
            quantity: parseInt(document.getElementById('quantity')?.value) || 1,
            price: parseFloat(document.getElementById('price')?.value) || 0,
            weight: document.getElementById('weight')?.value || '',
            barcode: barcode
        };

        if (!product.name || product.price <= 0) {
            alert('Please enter valid product name and price');
            return false;
        }

        ProductManager.saveProduct(product);
        this.showMessage(`Added: ${product.name}`, 'success');

        e.target.reset();
        setTimeout(() => document.getElementById('barcode')?.focus(), 100);

        return false;
    },

    showMessage(text, type) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 1000;
        `;
        msg.innerHTML = `✅ ${text}`;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
};

// ==================== 4. SELL PRODUCT MANAGEMENT ====================
const SellProductManager = {
    cart: [],

    init() {
        this.setupSellPage();
    },

    setupSellPage() {
        const barcodeInput = document.getElementById('barcode');
        const sellButton = document.getElementById('sell');

        if (barcodeInput) {
            // Change type to text if it's not already
            if (barcodeInput.type !== 'text') {
                barcodeInput.type = 'text';
            }

            barcodeInput.placeholder = "Scan or enter barcode";
            barcodeInput.autocomplete = "off";

            // Auto-focus
            setTimeout(() => barcodeInput.focus(), 100);

            // Enter key to scan
            barcodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.scanProduct();
                }
            });

            // Auto-scan after 13 digits (standard barcode)
            barcodeInput.addEventListener('input', (e) => {
                if (e.target.value.length === 13) {
                    setTimeout(() => this.scanProduct(), 50);
                }
            });
        }

        if (sellButton) {
            // Change button text and function
            sellButton.value = "Complete Sale";
            sellButton.onclick = () => this.completeSale();
        }

        // Create cart display
        this.createCartDisplay();
    },

    scanProduct() {
        const barcodeInput = document.getElementById('barcode');
        if (!barcodeInput) return;

        const barcode = barcodeInput.value.trim();
        if (!barcode) {
            alert("Please scan or enter barcode");
            return;
        }

        const product = ProductManager.getProductByBarcode(barcode);
        if (!product) {
            alert("Product not found!");
            barcodeInput.value = '';
            barcodeInput.focus();
            return;
        }

        // Check if already in cart
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
            this.showScanFeedback(product, "➕ Quantity increased");
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                barcode: product.barcode
            });
            this.showScanFeedback(product, "✅ Added to cart");
        }

        barcodeInput.value = '';
        barcodeInput.focus();
        this.updateCartDisplay();
    },

    createCartDisplay() {
        // Remove existing cart if any
        const existingCart = document.getElementById('cart-display');
        if (existingCart) existingCart.remove();

        const cartDiv = document.createElement('div');
        cartDiv.id = 'cart-display';
        cartDiv.style.cssText = `
            position: absolute;
            top: 200px;
            right: 50px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 3px 15px rgba(0,0,0,0.2);
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 100;
        `;

        document.body.appendChild(cartDiv);
        this.updateCartDisplay();
    },

    updateCartDisplay() {
        const cartDiv = document.getElementById('cart-display');
        if (!cartDiv) return;

        if (this.cart.length === 0) {
            cartDiv.innerHTML = `
                <h3 style="margin-top: 0; color: #46007b;">🛒 Cart</h3>
                <p style="color: #666;">No items yet</p>
                <p style="color: #999; font-size: 12px;">Scan products to add</p>
            `;
            return;
        }

        let total = 0;
        let itemsHtml = '';

        this.cart.forEach((item, index) => {
            const subtotal = item.quantity * item.price;
            total += subtotal;

            itemsHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 5px;">
                    <div>
                        <div><strong>${item.name}</strong></div>
                        <div style="font-size: 12px; color: #666;">
                            ${item.quantity} × $${item.price.toFixed(2)} = $${subtotal.toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <button onclick="SellProductManager.updateQuantity(${index}, ${item.quantity - 1})" 
                                style="background: #ff9800; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer; margin-right: 5px;">-</button>
                        <button onclick="SellProductManager.updateQuantity(${index}, ${item.quantity + 1})" 
                                style="background: #4CAF50; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer;">+</button>
                        <button onclick="SellProductManager.removeFromCart(${index})" 
                                style="background: #f44336; color: white; border: none; border-radius: 3px; padding: 2px 8px; cursor: pointer; margin-left: 5px;">✕</button>
                    </div>
                </div>
            `;
        });

        cartDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #46007b;">🛒 Cart (${this.cart.length})</h3>
            <div style="max-height: 250px; overflow-y: auto; margin-bottom: 15px;">
                ${itemsHtml}
            </div>
            <div style="border-top: 2px solid #46007b; padding-top: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>TOTAL:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button onclick="SellProductManager.clearCart()" 
                        style="flex: 1; padding: 8px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Clear
                </button>
                <button onclick="SellProductManager.completeSale()" 
                        style="flex: 2; padding: 10px; background: #46007b; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    💰 Complete Sale
                </button>
            </div>
        `;
    },

    updateQuantity(index, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(index);
            return;
        }
        this.cart[index].quantity = newQuantity;
        this.updateCartDisplay();
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartDisplay();
    },

    clearCart() {
        if (this.cart.length === 0) return;
        if (confirm("Clear all items from cart?")) {
            this.cart = [];
            this.updateCartDisplay();
        }
    },

    completeSale() {
        if (this.cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        let successCount = 0;
        let failedItems = [];

        // Process each item
        this.cart.forEach(item => {
            const result = ProductManager.sellProduct(item.id, item.quantity);
            if (result.success) {
                successCount++;
            } else {
                failedItems.push(`${item.name}: ${result.message}`);
            }
        });

        // Show results
        if (failedItems.length === 0) {
            const total = this.cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            this.showReceipt(total);
            this.cart = [];
            this.updateCartDisplay();
        } else {
            alert(`Some items couldn't be sold:\n${failedItems.join('\n')}`);
        }
    },

    showScanFeedback(product, message) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
        `;
        feedback.innerHTML = `<strong>${message}</strong><br>${product.name} - $${product.price.toFixed(2)}`;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    },

    showReceipt(total) {
        const receipt = document.createElement('div');
        receipt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 1001;
            text-align: center;
            min-width: 300px;
        `;

        receipt.innerHTML = `
            <h2 style="color: #46007b;">💰 Sale Complete!</h2>
            <div style="font-size: 18px; margin: 20px 0;">
                <p>Total: <strong>$${total.toFixed(2)}</strong></p>
                <p>Items sold: ${this.cart.length}</p>
            </div>
            <button onclick="this.parentElement.remove()" 
                    style="padding: 10px 30px; background: #46007b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                OK
            </button>
        `;

        document.body.appendChild(receipt);
        document.getElementById('barcode')?.focus();
    }
};

// ==================== 5. DASHBOARD ====================
const DashboardManager = {
    init() {
        this.loadProducts();
    },

    loadProducts() {
        const products = ProductManager.getAllProducts();
        const table = document.querySelector('table');
        if (!table) return;

        // Clear existing rows (keep header)
        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.rows).slice(1);
        rows.forEach(row => row.remove());

        if (products.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = "No products yet";
            cell.style.textAlign = "center";
            cell.style.padding = "20px";
            return;
        }

        products.forEach(product => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>$${product.price?.toFixed(2) || '0.00'}</td>
                <td>${product.barcode || '-'}</td>
                <td>${product.weight || '-'}</td>
            `;
        });
    }
};

// ==================== 6. HOME PAGE ====================
const HomeManager = {
    init() {
        this.loadStats();
    },

    loadStats() {
        const products = ProductManager.getAllProducts();
        const sales = ProductManager.getSales();
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        const lowStock = products.filter(p => p.quantity < 10).length;

        // Create stats display (positioned to NOT overlap text)
        const statsDiv = document.createElement('div');
        statsDiv.id = 'home-stats';
        statsDiv.style.cssText = `
            position: absolute;
            top: 450px;
            right: 50px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 250px;
        `;

        statsDiv.innerHTML = `
            <h3 style="color: #46007b; margin-top: 0;">📊 Quick Stats</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #f0f7ff; padding: 10px; border-radius: 5px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #46007b;">${products.length}</div>
                    <div style="font-size: 12px; color: #666;">Products</div>
                </div>
                <div style="background: #f0fff0; padding: 10px; border-radius: 5px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">$${totalValue.toFixed(2)}</div>
                    <div style="font-size: 12px; color: #666;">Value</div>
                </div>
                <div style="background: #fff8f0; padding: 10px; border-radius: 5px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #FF9800;">${sales.length}</div>
                    <div style="font-size: 12px; color: #666;">Sales</div>
                </div>
                <div style="background: #fff0f0; padding: 10px; border-radius: 5px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #f44336;">${lowStock}</div>
                    <div style="font-size: 12px; color: #666;">Low Stock</div>
                </div>
            </div>
        `;

        // Remove existing stats if any
        const existingStats = document.getElementById('home-stats');
        if (existingStats) existingStats.remove();

        document.body.appendChild(statsDiv);
    }
};

// ==================== 7. MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    console.log('SPOS System Loading...');

    // Initialize based on current page
    const page = window.location.pathname.split('/').pop().toLowerCase();

    // Always initialize Auth first
    AuthManager.init();

    // Only initialize other features if user is logged in (except for login/register pages)
    const user = AuthManager.getCurrentUser();
    const isAuthPage = page === 'login.html' || page === 'register.html';

    if (user || isAuthPage) {
        switch (page) {
            case 'home.html':
                HomeManager.init();
                break;
            case 'dashboard.html':
                DashboardManager.init();
                break;
            case 'addproduct.html':
                AddProductManager.init();
                break;
            case 'sellproduct.html':
                SellProductManager.init();
                break;
        }
    }

    console.log('SPOS System Ready!');
});

// Make functions globally available
window.ProductManager = ProductManager;
window.AuthManager = AuthManager;
window.SellProductManager = SellProductManager;