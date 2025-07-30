// Main JavaScript for Vanta Scaling

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(30px)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const countAttr = stat.getAttribute('data-count');
        const percentAttr = stat.getAttribute('data-percent');
        const currencyAttr = stat.getAttribute('data-currency');
        
        let target = 0;
        let isPercent = false;
        let isCurrency = false;
        
        if (countAttr) {
            target = parseInt(countAttr);
        } else if (percentAttr) {
            target = parseInt(percentAttr);
            isPercent = true;
        } else if (currencyAttr) {
            target = parseInt(currencyAttr);
            isCurrency = true;
        }
        
        if (target > 0) {
            // Reset to 0 first
            if (isPercent) {
                stat.textContent = '0%';
            } else if (isCurrency) {
                stat.textContent = '$0M+';
            } else {
                stat.textContent = '0+';
            }
            
            let current = 0;
            const increment = target / 50; // Slower animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (isPercent) {
                    stat.textContent = Math.floor(current) + '%';
                } else if (isCurrency) {
                    stat.textContent = '$' + Math.floor(current) + 'M+';
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
            }, 30);
        }
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger stats animation
            if (entry.target.classList.contains('stats')) {
                animateStats();
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.stat-card, .feature-card, .stats').forEach(el => {
    observer.observe(el);
});

// Add animation classes to CSS
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .stat-card {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .stat-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    
    .feature-card {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .feature-card.animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s ease-out;
    }
    
    .feature-card:nth-child(1) { transition-delay: 0.1s; }
    .feature-card:nth-child(2) { transition-delay: 0.2s; }
    .feature-card:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);

// Removed parallax effect for smoother, more cohesive scrolling

// Form handling functions (to be used by other pages)
const API_URL = window.location.origin + '/api';

// Show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background-color: ${type === 'success' ? '#00d4ff' : '#ff4444'};
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Removed custom cursor for better performance
