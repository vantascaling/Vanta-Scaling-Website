// Success page functionality

document.addEventListener('DOMContentLoaded', () => {
    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#00d4ff', '#0099cc', '#ffffff', '#00ffff'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
                
                // Random shape
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%';
                }
                
                document.body.appendChild(confetti);
                
                // Remove after animation
                setTimeout(() => confetti.remove(), 5000);
            }, i * 30);
        }
    }
    
    // Trigger confetti after checkmark animation
    setTimeout(createConfetti, 1000);
    
    // Add celebration sound (optional)
    const celebrationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    
    // Animate success message
    const successTitle = document.querySelector('.success-title');
    const successMessage = document.querySelector('.success-message');
    
    // Add typing effect to title
    if (successTitle) {
        const text = successTitle.textContent;
        successTitle.textContent = '';
        successTitle.style.opacity = '1';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                successTitle.textContent += text[index];
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
    
    // Track successful purchase
    if (sessionId && typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            'transaction_id': sessionId,
            'value': 197.00,
            'currency': 'USD',
            'items': [{
                'id': 'trial-surge',
                'name': 'Trial Surge Package',
                'category': 'Service',
                'quantity': 1,
                'price': 197.00
            }]
        });
    }
    
    // Add hover effects to detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
                width: 100px;
                height: 100px;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: rippleEffect 0.6s ease-out forwards;
            `;
            
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            from {
                width: 0;
                height: 0;
                opacity: 1;
            }
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll to package details
    setTimeout(() => {
        const packageSection = document.querySelector('.success-package');
        if (packageSection) {
            packageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 3000);
    
    // Add loading state if payment is still processing
    if (!sessionId) {
        const container = document.querySelector('.success-container');
        if (container) {
            container.innerHTML = `
                <div class="loading-spinner"></div>
                <p class="loading-message">Processing your payment...</p>
            `;
            
            // Redirect to home after timeout
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 5000);
        }
    }
});

// Add confetti styles
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--accent-blue);
        z-index: 9999;
        animation: confetti-fall linear forwards;
    }
    
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyles);
