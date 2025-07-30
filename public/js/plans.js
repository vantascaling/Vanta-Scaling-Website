// Plans page functionality with Stripe integration

// Initialize Stripe (replace with your publishable key)
const stripe = Stripe('pk_test_your_stripe_publishable_key_here');

// Handle Trial Surge purchase
const checkoutButton = document.getElementById('checkout-trial');

if (checkoutButton) {
    checkoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Add loading state
        checkoutButton.classList.add('btn-loading');
        checkoutButton.disabled = true;
        const originalText = checkoutButton.textContent;
        checkoutButton.textContent = '';

        try {
            // Create checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { sessionId } = await response.json();

            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                showNotification('error', result.error.message);
                checkoutButton.classList.remove('btn-loading');
                checkoutButton.disabled = false;
                checkoutButton.textContent = originalText;
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Something went wrong. Please try again.');
            checkoutButton.classList.remove('btn-loading');
            checkoutButton.disabled = false;
            checkoutButton.textContent = originalText;
        }
    });
}

// Animate pricing cards on scroll
const pricingCards = document.querySelectorAll('.pricing-card');
const addOnCards = document.querySelectorAll('.addon-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Set initial state for cards
pricingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    cardObserver.observe(card);
});

addOnCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    cardObserver.observe(card);
});

// Add hover effect to pricing cards
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        // Add glow effect
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: glowExpand 0.5s ease-out forwards;
        `;
        
        card.appendChild(glow);
        
        setTimeout(() => glow.remove(), 500);
    });
});

// Add glow animation
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    @keyframes glowExpand {
        from {
            width: 100px;
            height: 100px;
            opacity: 1;
        }
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(glowStyle);

// Smooth scroll to sections when clicking nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offset = 100; // Account for fixed navbar
            const targetPosition = targetElement.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add parallax effect to hero section
const plansHero = document.querySelector('.plans-hero');
if (plansHero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        
        plansHero.style.transform = `translateY(${parallax}px)`;
    });
}

// Add number animation for pricing
const animatePrices = () => {
    const priceElements = document.querySelectorAll('.amount');
    
    priceElements.forEach(element => {
        const text = element.textContent;
        const isRange = text.includes('-');
        
        if (!isRange && !text.includes('K')) {
            const target = parseInt(text);
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 20);
        }
    });
};

// Trigger price animation when cards are visible
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animatePrices();
            priceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const pricingSection = document.querySelector('.pricing-section');
if (pricingSection) {
    priceObserver.observe(pricingSection);
}

// Mobile menu functionality for plans page
const mobileMenuToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Add mobile menu styles if not already present
        if (!document.querySelector('#mobile-menu-styles')) {
            const mobileStyles = document.createElement('style');
            mobileStyles.id = 'mobile-menu-styles';
            mobileStyles.textContent = `
                @media (max-width: 768px) {
                    .nav-menu.active {
                        display: flex;
                        position: fixed;
                        top: 80px;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, 0.98);
                        flex-direction: column;
                        padding: 2rem;
                        gap: 1.5rem;
                        border-bottom: 1px solid var(--border-gray);
                        animation: slideDown 0.3s ease-out;
                    }
                    
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .nav-toggle.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    
                    .nav-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .nav-toggle.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -6px);
                    }
                }
            `;
            document.head.appendChild(mobileStyles);
        }
    });
}
