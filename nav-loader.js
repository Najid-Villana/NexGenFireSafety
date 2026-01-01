// Load navigation module into all pages
async function loadNavigation() {
    try {
        const response = await fetch('navigation.html');
        const navHTML = await response.text();
        
        // Insert navigation at the top of body if not already present
        if (!document.querySelector('nav.glass-effect')) {
            document.body.insertAdjacentHTML('afterbegin', navHTML);
            initializeMobileMenu();
        }
    } catch (error) {
        console.warn('Navigation module not found or could not be loaded');
    }
}

// Load navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    loadNavigation();
}
