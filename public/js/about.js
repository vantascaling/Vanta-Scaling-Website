// About page functionality

document.addEventListener('DOMContentLoaded', () => {
    // Animate stats on scroll
    const animateStats = () => {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix');
            
            if (target > 0) {
                // Reset to 0 first
                if (suffix === 'M+') {
                    stat.textContent = '$0M+';
                } else if (suffix === '%') {
                    stat.textContent = '0%';
                } else if (suffix === '+') {
                    stat.textContent = '0+';
                } else {
                    stat.textContent = '0';
                }
                
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    if (suffix === 'M+') {
                        stat.textContent = `$${Math.floor(current)}M+`;
                    } else if (suffix === '%') {
                        stat.textContent = Math.floor(current) + '%';
                    } else if (suffix === '+') {
                        stat.textContent = Math.floor(current) + '+';
                    } else {
                        stat.textContent = Math.floor(current);
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
                if (entry.target.classList.contains('founder-stats')) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
                
                // Add visible class for fade-in animations
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = [
        '.founder-content',
        '.founder-stats',
        '.value-card',
        '.process-step',
        '.mission-content'
    ];
    
    elementsToObserve.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    });
    
    // Process timeline animation
    const processSteps = document.querySelectorAll('.process-step');
    const processLines = document.querySelectorAll('.process-line');
    
    processSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', () => {
            // Highlight current step
            step.classList.add('active');
            
            // Animate connecting lines
            if (index > 0 && processLines[index - 1]) {
                processLines[index - 1].style.background = 'var(--accent-blue)';
            }
        });
        
        step.addEventListener('mouseleave', () => {
            step.classList.remove('active');
            
            if (index > 0 && processLines[index - 1]) {
                processLines[index - 1].style.background = 'var(--border-gray)';
            }
        });
    });
    
    // Value cards hover effect
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
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
    
    // Parallax effect for hero
    const aboutHero = document.querySelector('.about-hero');
    if (aboutHero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            
            aboutHero.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Founder badge animation
    const founderBadge = document.querySelector('.founder-badge');
    if (founderBadge) {
        setInterval(() => {
            founderBadge.style.animation = 'pulse 2s ease-out';
            setTimeout(() => {
                founderBadge.style.animation = '';
            }, 2000);
        }, 5000);
    }
    
    // Add hover effect to stat boxes
    const statBoxes = document.querySelectorAll('.stat-box');
    
    statBoxes.forEach(box => {
        box.addEventListener('mouseenter', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            box.style.setProperty('--mouse-x', `${x}px`);
            box.style.setProperty('--mouse-y', `${y}px`);
        });
        
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            box.style.setProperty('--mouse-x', `${x}px`);
            box.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Add additional styles
const aboutStyles = document.createElement('style');
aboutStyles.textContent = `
    /* Visibility animations */
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Process step active state */
    .process-step.active .step-number {
        background: var(--accent-blue);
        color: var(--primary-black);
        transform: scale(1.1);
        box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
    }
    
    /* Glow animation */
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
    
    /* Pulse animation */
    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px 10px rgba(0, 212, 255, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 212, 255, 0);
        }
    }
    
    /* Stat box mouse glow */
    .stat-box::after {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .stat-box:hover::after {
        opacity: 1;
    }
    
    /* Process line animation */
    .process-line {
        transition: background 0.3s ease;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .process-step {
            opacity: 1 !important;
            transform: none !important;
        }
    }
`;
document.head.appendChild(aboutStyles);
