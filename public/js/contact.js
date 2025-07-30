document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            if (!validateForm(formData)) return;

            const submitButton = contactForm.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.innerHTML = '';

            try {
                const webhookBody = {
                    embeds: [
                        {
                            title: '📬 New Contact Form Submission!',
                            color: 5814783,
                            fields: [
                                { name: 'Name', value: formData.name, inline: true },
                                { name: 'Email', value: formData.email, inline: true },
                                { name: 'Message', value: formData.message }
                            ],
                            footer: { text: 'Sent from your website 💻' },
                            timestamp: new Date().toISOString()
                        }
                    ]
                };

                const response = await fetch('https://discord.com/api/webhooks/1399883501272305766/aOsYz5I5Lv5FFl3uDQRvYwoU9IxFlIkPsZps12Mi7zDCTUrOQ6oT8uLFSs7kWRnFxlGe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(webhookBody)
                });

                if (response.ok) {
                    successMessage.style.display = 'flex';
                    contactForm.reset();
                } else {
                    showNotification('error', 'Something went wrong sending your message. Try again later.');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('error', 'Failed to send message. Try again or email us directly.');
            } finally {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    function validateForm(data) {
        let isValid = true;
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));

        if (!data.name || data.name.length < 2) {
            showFieldError('name', 'Please enter your name');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!data.message || data.message.length < 10) {
            showFieldError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }

        return isValid;
    }

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

    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        counterDiv.textContent = `0 / ${maxLength}`;
        messageField.parentElement.appendChild(counterDiv);

        messageField.addEventListener('input', () => {
            const length = messageField.value.length;
            counterDiv.textContent = `${length} / ${maxLength}`;
            counterDiv.style.color = length > maxLength * 0.9 ? 'var(--accent-blue)' : 'var(--text-gray)';
        });

        messageField.setAttribute('maxlength', maxLength);
    }

    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        input.addEventListener('input', () => {
            input.classList.toggle('filled', !!input.value);
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const title = item.querySelector('h3');
        const content = item.querySelector('p');
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            faqItems.forEach(otherItem => otherItem !== item && otherItem.classList.remove('open'));
            item.classList.toggle('open');
        });
    });

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

// Add character counter + FAQ styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
.character-counter {
    font-size: 0.875rem;
    color: var(--text-gray);
    text-align: right;
    margin-top: 0.5rem;
    transition: color 0.3s ease;
}

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
