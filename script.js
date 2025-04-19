document.addEventListener('DOMContentLoaded', () => {
    console.log("APP: R.A.M SHOP Initializing...");

    // --- State Variables ---
    let allProducts = [];
    let cartItems = [];
    let wishlistItems = [];
    let currentCategory = 'Featured';
    let currentSearchTerm = '';
    let isProfileMenuOpen = false;

    // --- Element Selectors ---
    const bodyElement = document.body;
    const productGrid = document.getElementById('product-grid');
    const productsHeading = document.getElementById('products-heading');
    const noProductsMessage = document.getElementById('no-products-message');
    const categoryNavInner = document.querySelector('.category-nav-inner');
    const locationBtn = document.querySelector('.location-btn');
    const searchIconBtn = document.querySelector('.search-icon-btn');
    // User icon button is now a profile menu toggle
    // const userIconBtn = document.querySelector('.user-icon-btn');
    const cartIconBtn = document.querySelector('.cart-icon-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const wishlistIconBtn = document.querySelector('.wishlist-icon-btn');
    const searchFormMobile = document.querySelector('.search-form-mobile');
    const searchInputMobile = document.getElementById('search-input-mobile');
    const searchClearBtn = document.querySelector('.search-clear-btn');
    const heroCtaButton = document.querySelector('.hero-cta-button');
    const promoBlocks = document.querySelectorAll('.promo-block');
    const quickLinkItems = document.querySelectorAll('.quick-link-item');
    const registerBtn = document.querySelector('.register-button');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const footerYearSpan = document.getElementById('footer-year');
    const currentTimeSpan = document.getElementById('current-time');

    // Modal Elements
    const modalOverlay = document.getElementById('alert-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Profile Menu Elements
    const profileMenuToggles = document.querySelectorAll('.profile-menu-toggle'); // Get both header and footer toggles
    const profileMenu = document.getElementById('profile-menu');
    const profileMenuOverlay = document.getElementById('profile-menu-overlay');
    const profileMenuCloseBtn = document.getElementById('profile-menu-close-btn');
    const profileMenuLinks = document.querySelectorAll('.profile-menu-link');
    const profileMenuLogoutBtn = document.querySelector('.profile-menu-logout-btn');

    // --- Config ---
    const categories = [
        // ... (categories remain the same) ...
        { name: 'Featured', keywords: 'gift,present,unique', isFeatured: true },
        { name: 'New In', keywords: 'new,latest,innovative', isNew: true },
        { name: 'Gifts', keywords: 'gift,present,box,mug,keepsake', category: 'Gifts' },
        { name: 'Flowers bouquet', keywords: 'flowers,bouquet,floral,bloom', category: 'Flowers' },
        { name: 'School Supplies', keywords: 'school,stationery,notebook,pen', category: 'School' },
        { name: 'Accessories', keywords: 'accessory,jewelry,bag,scarf,decor', category: 'Accessories' },
        { name: 'Apparel', keywords: 'tshirt,clothing,fashion,style', category: 'Apparel' },
        { name: 'Trending', keywords: 'trending,popular,hot,viral', isTrending: true },
        { name: 'Sale', keywords: 'sale,discount,deal,offer', isOnSale: true }
    ];

    // --- Utility Functions ---
    function debounce(func, wait) {
        // ... (debounce function remains the same) ...
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function updateTime() {
        if (currentTimeSpan) {
             // Get current time in Philippines (approximate using UTC+8)
             const now = new Date();
             const options = { timeZone: 'Asia/Manila', hour: 'numeric', minute: 'numeric', hour12: true };
             try {
                currentTimeSpan.textContent = now.toLocaleTimeString('en-US', options);
             } catch (e) {
                 console.warn("Could not format time for Asia/Manila, using local time.", e);
                 currentTimeSpan.textContent = now.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
             }
        }
    }

    // --- Modal Functions ---
    function showModal(message) {
        if (modalOverlay && modalMessage) {
            modalMessage.textContent = message;
            // Use class for visibility control with transitions
            modalOverlay.classList.add('visible');
            // modalOverlay.style.display = 'flex'; // Fallback if class doesn't work
            bodyElement.classList.add('no-scroll'); // Prevent body scroll
        } else {
            alert(message); // Fallback
        }
    }

    function hideModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('visible');
            // modalOverlay.style.display = 'none'; // Fallback
            // Only remove no-scroll if profile menu isn't also open
            if (!isProfileMenuOpen) {
                bodyElement.classList.remove('no-scroll');
            }
        }
    }

    // --- Profile Menu Functions ---
    function openProfileMenu() {
        if (profileMenu && profileMenuOverlay) {
            profileMenu.classList.add('open');
            profileMenuOverlay.classList.add('visible');
            profileMenu.setAttribute('aria-hidden', 'false');
            profileMenuOverlay.setAttribute('aria-hidden', 'false');
            bodyElement.classList.add('no-scroll'); // Prevent body scroll
            isProfileMenuOpen = true;
            // Optional: Focus the first focusable element in the menu (e.g., close button)
            profileMenuCloseBtn?.focus();
        }
    }

    function closeProfileMenu() {
        if (profileMenu && profileMenuOverlay) {
            profileMenu.classList.remove('open');
            profileMenuOverlay.classList.remove('visible');
            profileMenu.setAttribute('aria-hidden', 'true');
            profileMenuOverlay.setAttribute('aria-hidden', 'true');
            bodyElement.classList.remove('no-scroll'); // Allow scroll again
            isProfileMenuOpen = false;
            // Optional: Return focus to the button that opened the menu
            // This requires storing the trigger element, more complex
        }
    }

    function handleProfileMenuLinkClick(event) {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;
        console.log(`PROFILE MENU: Clicked action "${action}"`);

        switch(action) {
            case 'my-account':
                showModal("My Account / Edit Profile screen would appear here.");
                break;
            case 'my-orders':
                showModal("My Orders history would be displayed here.");
                break;
            case 'my-wishlist':
                displayWishlist(); // Use existing function, but show in modal
                break;
            case 'settings':
                showModal("Settings options (Notifications, Language, etc.) would appear here.");
                break;
            case 'location':
                showModal('Location / Address management screen would appear here.\nCurrent Location: PH (Aroroy, Bicol)');
                break;
             case 'help':
                 showModal('Help Center / FAQ / Contact Us screen would appear here.');
                 break;
            case 'logout':
                showModal("Logout action simulated. You would be logged out.");
                // In real app: Clear session/token, redirect to login page
                break;
            default:
                showModal(`Action "${action}" not fully implemented.`);
        }
        // Close menu after action (unless modal is shown, modal handles closing)
        // If showModal is used, it prevents body scroll, so let modal handle un-scrolling
        if (!action || action === 'my-wishlist') { // Close immediately if no modal or wishlist (handled by modal)
             closeProfileMenu();
        }
    }

    // --- Data Generation ---
    function generateDummyProducts(config) {
        // ... (generateDummyProducts function remains the same) ...
        console.log("Generating dummy products...");
        const generatedProducts = [];
        const brands = ['Artisan Gifts', 'Home Decor Co.', 'Style Threads', 'Bloom & Bud', 'RAM Basics', 'Edu Essentials', null];
        const prefixes = ['Elegant', 'Custom', 'Graphic Print', 'Unique', 'Handmade', 'Artisan', 'Modern', 'Classic', 'Essential', 'Premium'];
        let productIdCounter = 1;

        config.categories.forEach(cat => {
            const count = cat.isFeatured ? 12 : (cat.isTrending || cat.isNew ? 8 : 10);
            for (let i = 1; i <= count; i++) {
                const originalPrice = parseFloat((Math.random() * 80 + 15).toFixed(2));
                const discount = (Math.random() * 0.5 + 0.1);
                const isOnSale = cat.isOnSale || (!cat.isFeatured && !cat.isNew && Math.random() < 0.3);
                const salePrice = isOnSale ? parseFloat((originalPrice * (1 - discount)).toFixed(2)) : originalPrice;
                const productId = productIdCounter++;
                const productKeywords = cat.keywords.split(',');
                if(cat.category) productKeywords.push(cat.category.toLowerCase());

                generatedProducts.push({
                    id: productId,
                    name: `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${cat.keywords.split(',')[0]} #${productId}`,
                    brand: brands[Math.floor(Math.random() * brands.length)],
                    price: salePrice,
                    originalPrice: isOnSale ? originalPrice : null,
                    discountPercent: isOnSale ? Math.round(discount * 100) : null,
                    imageUrl: `https://source.unsplash.com/random/300x400/?${cat.keywords}&sig=${productId}`,
                    category: cat.category || cat.name,
                    keywords: productKeywords,
                    isFeatured: cat.isFeatured || false,
                    isNew: cat.isNew || false,
                    isTrending: cat.isTrending || false,
                    isOnSale: isOnSale,
                });
            }
        });
        const uniqueProducts = Array.from(new Map(generatedProducts.map(p => [p.name, p])).values());
        console.log(`Generated ${uniqueProducts.length} unique dummy products.`);
        return uniqueProducts;
    }

    // --- Rendering Functions ---
    function renderCategories() {
        // ... (renderCategories function remains the same) ...
         if (!categoryNavInner) return;
        const loadingPlaceholder = categoryNavInner.querySelector('.loading-placeholder');
        if(loadingPlaceholder) loadingPlaceholder.remove();
        categoryNavInner.innerHTML = '';
        categories.forEach(cat => {
            const link = document.createElement('button');
            link.classList.add('category-link');
            link.dataset.category = cat.name;
            link.textContent = cat.name;
            if (cat.name === 'Sale') link.classList.add('sale-link');
            if (cat.name === currentCategory) link.classList.add('active');
            link.addEventListener('click', handleCategoryClick);
            categoryNavInner.appendChild(link);
        });
    }

    function renderProducts(productsToRender) {
       // ... (renderProducts function remains the same) ...
       if (!productGrid || !noProductsMessage) { console.error("Product grid or message element not found!"); return; }
       const loadingPlaceholder = productGrid.querySelector('.loading-placeholder');
       if (loadingPlaceholder) loadingPlaceholder.remove();
       productGrid.innerHTML = '';
       if (productsToRender.length === 0) {
           noProductsMessage.style.display = 'block';
       } else {
           noProductsMessage.style.display = 'none';
           productsToRender.forEach(product => {
               const cardElement = createProductCardMobile(product);
               productGrid.appendChild(cardElement);
           });
       }
       if (productsHeading) {
           if (currentSearchTerm) {
                productsHeading.textContent = `Search Results for "${currentSearchTerm}"`;
           } else {
                productsHeading.textContent = `${currentCategory} Products`;
           }
       }
    }

    function createProductCardMobile(product) {
        // ... (createProductCardMobile function remains the same) ...
         const card = document.createElement('div');
        card.classList.add('product-card-mobile');
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-product-name', product.name);
        card.setAttribute('tabindex', '0');

        let priceHtml = `<span class="current-price">₱${product.price.toFixed(2)}</span>`;
        if (product.originalPrice) { priceHtml += ` <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>`; }
        if (product.discountPercent && product.discountPercent > 5) { priceHtml += ` <span class="discount-percent">-${product.discountPercent}%</span>`; }
        const brandHtml = product.brand ? `<div class="product-brand-mobile">${product.brand}</div>` : '';
        const isInWishlist = wishlistItems.includes(product.id);

        card.innerHTML = `
            <div class="product-image-container-mobile">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image-mobile" loading="lazy">
                <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" aria-label="Add to Wishlist" data-product-id="${product.id}">
                    <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info-mobile">
                ${brandHtml}
                <h3 class="product-name-mobile">${product.name}</h3>
                <div class="product-price-mobile"> ${priceHtml} </div>
                <button class="quick-add-btn" aria-label="Quick Add to Cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
                     <i class="fas fa-shopping-bag"></i>
                 </button>
            </div>
        `;
        card.querySelector('.wishlist-btn').addEventListener('click', handleWishlistClick);
        card.querySelector('.quick-add-btn').addEventListener('click', handleQuickAddClick);
        card.addEventListener('click', (e) => { if (!e.target.closest('button')) handleProductCardClick(e); });
        card.addEventListener('keypress', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) handleProductCardClick(e); });
        return card;
    }

    // --- State Update & Filtering ---
    function filterAndRenderProducts() {
        // ... (filterAndRenderProducts function remains the same) ...
        console.log(`Filtering for Category: ${currentCategory}, Search: "${currentSearchTerm}"`);
        let filtered = [...allProducts];
        if (currentCategory !== 'All') {
            const categoryConfig = categories.find(c => c.name === currentCategory);
            if (categoryConfig) {
                 if (categoryConfig.isFeatured) filtered = filtered.filter(p => p.isFeatured);
                 else if (categoryConfig.isNew) filtered = filtered.filter(p => p.isNew);
                 else if (categoryConfig.isTrending) filtered = filtered.filter(p => p.isTrending);
                 else if (categoryConfig.isOnSale) filtered = filtered.filter(p => p.isOnSale);
                 else if (categoryConfig.category) {
                     const catLower = categoryConfig.category.toLowerCase();
                     const keyLower = categoryConfig.keywords.toLowerCase().split(',');
                     filtered = filtered.filter(p => p.category.toLowerCase() === catLower || (p.keywords && p.keywords.some(k => keyLower.includes(k.toLowerCase()))));
                 } else {
                      const keyLower = categoryConfig.keywords.toLowerCase().split(',');
                      filtered = filtered.filter(p => p.keywords && p.keywords.some(k => keyLower.includes(k.toLowerCase())));
                 }
            }
        }
        if (currentSearchTerm) {
            const termLower = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(termLower) || (p.brand && p.brand.toLowerCase().includes(termLower)) || (p.keywords && p.keywords.some(k => k.toLowerCase().includes(termLower))));
        }
        renderProducts(filtered);
    }

    function setActiveCategory(categoryName) {
        // ... (setActiveCategory function remains largely the same, ensures search is cleared) ...
         currentCategory = categoryName;
        currentSearchTerm = '';
        if(searchInputMobile) searchInputMobile.value = '';
        if(searchClearBtn) searchClearBtn.style.display = 'none';
        document.querySelectorAll('.category-nav .category-link').forEach(link => link.classList.toggle('active', link.dataset.category === categoryName));
        bottomNavItems.forEach(item => item.classList.toggle('active', item.dataset.category === categoryName));
        filterAndRenderProducts();
    }

    function setActiveBottomNav(target) {
        // ... (setActiveBottomNav function remains the same) ...
        bottomNavItems.forEach(i => i.classList.remove('active'));
        const targetItem = Array.from(bottomNavItems).find(item => item.dataset.category === target || item.dataset.show === target);
        if (targetItem) targetItem.classList.add('active');
    }

    // --- Cart & Wishlist Logic ---
    function updateCartBadge() {
        // ... (updateCartBadge function remains the same) ...
         const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalQuantity;
            cartBadge.classList.toggle('visible', totalQuantity > 0);
        }
        console.log("CART:", cartItems);
    }

    function addToCart(productId, productName, productPrice) {
        // ... (addToCart function remains the same) ...
         const existingItemIndex = cartItems.findIndex(item => item.id === productId);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({ id: productId, name: productName, price: parseFloat(productPrice), quantity: 1 });
        }
        updateCartBadge();
        showModal(`${productName} added to cart!`);
    }

    function toggleWishlist(productId) {
        // ... (toggleWishlist function remains the same) ...
        const index = wishlistItems.indexOf(productId);
        if (index > -1) {
            wishlistItems.splice(index, 1);
            console.log(`WISHLIST: Removed Product ID ${productId}`);
            return false;
        } else {
            wishlistItems.push(productId);
            console.log(`WISHLIST: Added Product ID ${productId}`);
            return true;
        }
    }

    function updateWishlistIcons(productId) {
        // ... (updateWishlistIcons function remains the same) ...
         document.querySelectorAll(`.wishlist-btn[data-product-id="${productId}"]`).forEach(button => {
            const icon = button.querySelector('i');
            const isActive = wishlistItems.includes(productId);
            button.classList.toggle('active', isActive);
            if (icon) { icon.classList.toggle('fas', isActive);
                icon.classList.toggle('far', !isActive);
            }
        });
        console.log("WISHLIST:", wishlistItems);
    }

    // --- Event Handlers ---
    function handleCategoryClick(event) {
        // ... (handleCategoryClick function remains the same) ...
        const categoryName = event.currentTarget.dataset.category;
        setActiveCategory(categoryName);
        setActiveBottomNav(categoryName);
    }

    function handleBottomNavClick(event) {
        event.preventDefault();
        const targetCategory = event.currentTarget.dataset.category;
        const targetView = event.currentTarget.dataset.show;

        if (targetCategory) {
            setActiveCategory(targetCategory);
            setActiveBottomNav(targetCategory);
            // Ensure product grid is visible if switching to category view
             productGrid.style.display = 'grid';
             noProductsMessage.style.display = 'none'; // Hide message initially
        } else if (targetView) {
            setActiveBottomNav(targetView); // Keep nav item active

            if (targetView === 'Cart') {
                displayCart();
            } else if (targetView === 'Me') {
                // Open Profile Menu instead of modal
                openProfileMenu();
            } else {
                // Handle other potential views if added
                console.log(`BOTTOM NAV: Clicked "${targetView}". Action: Show ${targetView} view/modal.`);
                showModal(`Simulating navigation to: ${targetView}`);
            }

            // Deselect category in top nav for non-category views
            document.querySelectorAll('.category-nav .category-link').forEach(link => link.classList.remove('active'));

             // Optionally hide product grid for views like Cart/Me if they don't show products
            if (targetView === 'Cart' || targetView === 'Me') {
                 if (productsHeading) productsHeading.textContent = targetView; // Update title
                 productGrid.innerHTML = ''; // Clear products
                 productGrid.style.display = 'none'; // Hide grid
                 noProductsMessage.style.display = 'none'; // Hide message
            }
        }
    }

    function handleWishlistClick(event) {
        // ... (handleWishlistClick function remains the same) ...
        event.stopPropagation();
        const button = event.currentTarget;
        const productId = parseInt(button.dataset.productId);
        toggleWishlist(productId);
        updateWishlistIcons(productId);
    }

    function handleQuickAddClick(event) {
       // ... (handleQuickAddClick function remains the same) ...
       event.stopPropagation();
       const button = event.currentTarget;
       const productId = parseInt(button.dataset.productId);
       const productName = button.dataset.productName;
       const productPrice = button.dataset.productPrice;
       addToCart(productId, productName, productPrice);
    }
    function handleProductCardClick(event) {
        // ... (handleProductCardClick function remains the same) ...
        const card = event.currentTarget;
        const productId = card.dataset.productId;
        const productName = card.dataset.productName;
        console.log(`PRODUCT CARD: Clicked - ID ${productId} (${productName}). Action: Navigate to product details page (Simulated).`);
        showModal(`Showing details for: ${productName} (ID: ${productId})`);
    }

    const handleSearchInput = debounce(() => {
        // ... (handleSearchInput function remains the same) ...
        currentSearchTerm = searchInputMobile.value.trim();
        if (currentSearchTerm) {
            searchClearBtn.style.display = 'inline-block';
            filterAndRenderProducts();
        } else {
            searchClearBtn.style.display = 'none';
            filterAndRenderProducts();
        }
    }, 300);

    function handleSearchSubmit(event) {
        // ... (handleSearchSubmit function remains the same) ...
         event.preventDefault();
         handleSearchInput();
         searchInputMobile.blur();
    }

    function handleSearchClear(event) {
        // ... (handleSearchClear function remains the same) ...
         event.preventDefault();
         searchInputMobile.value = '';
         currentSearchTerm = '';
         searchClearBtn.style.display = 'none';
         filterAndRenderProducts();
         searchInputMobile.focus();
    }

    function displayCart() {
        // ... (displayCart function remains the same, uses showModal) ...
         let cartContent = "Your Cart:\n";
        if (cartItems.length === 0) {
            cartContent += "\n- Is currently empty.";
        } else {
            let total = 0;
            cartItems.forEach(item => {
                const itemTotal = item.price * item.quantity;
                cartContent += `\n- ${item.name} | ${item.quantity} x ₱${item.price.toFixed(2)} = ₱${itemTotal.toFixed(2)}`;
                total += itemTotal;
            });
            cartContent += `\n\nTotal: ₱${total.toFixed(2)}`;
        }
        cartContent += "\n\n(Checkout functionality not implemented)";
        showModal(cartContent);
    }

    function displayWishlist() {
        // ... (displayWishlist function remains the same, uses showModal) ...
          let wishlistContent = "Your Wishlist:\n";
         if (wishlistItems.length === 0) {
             wishlistContent += "\n- Is currently empty.";
         } else {
             wishlistItems.forEach(itemId => {
                 const product = allProducts.find(p => p.id === itemId);
                 wishlistContent += `\n- ${product ? product.name : `Product ID ${itemId}`}`;
             });
         }
         showModal(wishlistContent);
    }
    // --- Initial Setup ---
    function initializeApp() {
        if (footerYearSpan) footerYearSpan.textContent = new Date().getFullYear();
        updateTime(); // Initial time update
        setInterval(updateTime, 60000); // Update time every minute

        allProducts = generateDummyProducts({ categories });
        renderCategories();
        setActiveCategory('Featured');
        attachEventListeners();
        updateCartBadge();
        console.log("APP: R.A.M SHOP Initialized and Ready.");
    }

    function attachEventListeners() {
        // Top Bar
        if (locationBtn) locationBtn.addEventListener('click', () => showModal('Location: PH (Aroroy, Bicol). Location selection not implemented.'));
        if (searchIconBtn) searchIconBtn.addEventListener('click', () => { searchInputMobile?.focus(); console.log('HEADER: Search icon clicked.'); });
        if (wishlistIconBtn) wishlistIconBtn.addEventListener('click', displayWishlist);
        // User Icon Toggle handled below with profileMenuToggles
        if (cartIconBtn) cartIconBtn.addEventListener('click', displayCart);

        // Search Form
        if (searchFormMobile) searchFormMobile.addEventListener('submit', handleSearchSubmit);
        if (searchInputMobile) searchInputMobile.addEventListener('input', handleSearchInput);
        if (searchClearBtn) searchClearBtn.addEventListener('click', handleSearchClear);

        // Hero CTA Button
        if (heroCtaButton) heroCtaButton.addEventListener('click', (event) => {
             event.preventDefault();
             const targetCategory = event.currentTarget.dataset.category;
             if(targetCategory) {
                setActiveCategory(targetCategory);
                setActiveBottomNav(targetCategory);
                productsHeading?.scrollIntoView({ behavior: 'smooth' });
             }
             console.log('HERO CTA: Clicked.');
        });

        // Promo Blocks
        promoBlocks.forEach(block => block.addEventListener('click', () => {
            const promoId = block.dataset.promoId || 'Unknown Promo';
            if (promoId === 'wifi-tickets') showModal('Wifi Tickets: Connect & Buy Now! (Purchase flow not implemented)');
            else showModal(`Promo: ${block.querySelector('span')?.textContent || promoId}. (Details page not implemented)`);
            console.log(`PROMO BLOCK: Clicked "${promoId}".`);
        }));

        // Quick Links
        quickLinkItems.forEach(item => item.addEventListener('click', (event) => {
            event.preventDefault();
            const targetCategory = item.dataset.category;
            const linkText = item.querySelector('span')?.textContent.trim() || 'Quick Link';
            if (targetCategory && categories.some(c => c.name === targetCategory)) {
                setActiveCategory(targetCategory);
                setActiveBottomNav(targetCategory);
                productsHeading?.scrollIntoView({ behavior: 'smooth' });
            } else {
                 showModal(`Quick Link: ${linkText} clicked. (Target category "${targetCategory}" not configured or linked)`);
            }
            console.log(`QUICK LINK: Clicked "${linkText}". Target: ${targetCategory}`);
        }));

        // Register Button
        if(registerBtn) registerBtn.addEventListener('click', () => showModal('Registration form/modal would appear here.'));

        // Bottom Navigation (User/Me button handled by profileMenuToggles)
         bottomNavItems.forEach(item => {
            if (!item.classList.contains('profile-menu-toggle')) { // Add listener only if not a profile menu toggle
                 item.addEventListener('click', handleBottomNavClick);
             }
         });
         
         // Register Button
        if(registerBtn) registerBtn.addEventListener('click', () => showModal('Registration form/modal would appear here.'));

        // Bottom Navigation (User/Me button handled by profileMenuToggles)
         bottomNavItems.forEach(item => {
            if (!item.classList.contains('profile-menu-toggle')) { // Add listener only if not a profile menu toggle
                 item.addEventListener('click', handleBottomNavClick);
             }
         });

        // Footer Links
        document.querySelectorAll('.footer-links a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const linkText = link.textContent.trim();
                showModal(`Navigating to: ${linkText} (Page not implemented).`);
                console.log(`FOOTER LINK: Clicked "${linkText}".`);
            });
        });

        // Modal Close Button & Overlay Click
        if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideModal(); });
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);

        // ++ Profile Menu Event Listeners ++
        profileMenuToggles.forEach(toggle => toggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (isProfileMenuOpen) closeProfileMenu();
            else openProfileMenu();
        }));
        if (profileMenuCloseBtn) profileMenuCloseBtn.addEventListener('click', closeProfileMenu);
        if (profileMenuOverlay) profileMenuOverlay.addEventListener('click', closeProfileMenu);
        // Add Escape key listener to close menu/modal
        document.addEventListener('keydown', (e) => {
             if (e.key === 'Escape') {
                 if (isProfileMenuOpen) closeProfileMenu();
                 else if (modalOverlay?.classList.contains('visible')) hideModal();
             }
        });
        profileMenuLinks.forEach(link => link.addEventListener('click', handleProfileMenuLinkClick));
        if (profileMenuLogoutBtn) profileMenuLogoutBtn.addEventListener('click', handleProfileMenuLinkClick); // Reuse handler

        console.log("APP: Event listeners attached.");
    }

    // --- Start the application ---
    initializeApp();

}); // End DOMContentLoaded

 