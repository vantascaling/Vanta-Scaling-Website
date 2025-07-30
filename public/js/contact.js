// Contact form functionality

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.innerHTML = '';
            
            try {
                // Send to server
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Show success message
                    successMessage.style.display = 'flex';
                    contactForm.reset();
                    
                    // Track conversion
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'contact_form', {
                            'event_category': 'engagement',
                            'event_label': 'form_submission'
                        });
                    }
                } else {
                    showNotification('error', data.error || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('error', 'Failed to send message. Please try again or email us directly.');
            } finally {
                // Reset button
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
    
    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
        
        // Validate name
        if (!data.name || data.name.length < 2) {
            showFieldError('name', 'Please enter your name');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!data.message || data.message.length < 10) {
            showFieldError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            field.parentElement.appendChild(errorDiv);
        }
    }
    
    // Character counter for message
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        
        // Create character counter
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        counterDiv.textContent = `0 / ${maxLength}`;
        messageField.parentElement.appendChild(counterDiv);
        
        // Update counter on input
        messageField.addEventListener('input', () => {
            const length = messageField.value.length;
            counterDiv.textContent = `${length} / ${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counterDiv.style.color = 'var(--accent-blue)';
            } else {
                counterDiv.style.color = 'var(--text-gray)';
            }
        });
        
        // Limit input
        messageField.setAttribute('maxlength', maxLength);
    }
    
    // Add input animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Add filled state
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const title = item.querySelector('h3');
        const content = item.querySelector('p');
        
        // Add click handler
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                }
            });
            
            // Toggle current item
            item.classList.toggle('open');
        });
    });
    
    // Contact item hover effects
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Add styles for character counter and FAQ
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .character-counter {
        font-size: 0.875rem;
        color: var(--text-gray);
        text-align: right;
        margin-top: 0.5rem;
        transition: color 0.3s ease;
    }
    
    /* FAQ Styles */
    .faq-section {
        padding: 6rem 0;
        background: var(--primary-black);
        border-top: 1px solid var(--border-gray);
    }
    
    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }
    
    .faq-item {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-gray);
        border-radius: 16px;
        padding: 2rem;
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .faq-item:hover {
        border-color: var(--accent-blue);
        background: rgba(0, 212, 255, 0.02);
    }
    
    .faq-item h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: var(--text-white);
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    }
    
    .faq-item h3::after {
        content: '+';
        font-size: 1.5rem;
        color: var(--accent-blue);
        transition: transform 0.3s ease;
    }
    
    .faq-item.open h3::after {
        transform: rotate(45deg);
    }
    
    .faq-item p {
        color: var(--text-light-gray);
        line-height: 1.8;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
    }
    
    .faq-item.open p {
        max-height: 200px;
        padding-top: 1rem;
    }
    
    /* Contact item glow effect */
    .contact-item::before {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .contact-item:hover::before {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .faq-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(additionalStyles);
