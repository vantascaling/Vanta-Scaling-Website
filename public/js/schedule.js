// Schedule form functionality
document.addEventListener('DOMContentLoaded', () => {
    const scheduleForm = document.getElementById('scheduleForm');
    const successMessage = document.getElementById('successMessage');

    // Set minimum and maximum dates
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }

    // Form submission
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                website: document.getElementById('website').value.trim(),
                preferredDate: document.getElementById('preferredDate').value,
                preferredTime: document.getElementById('preferredTime').value,
                notes: document.getElementById('notes').value.trim()
            };

            if (!validateForm(formData)) return;

            const submitButton = scheduleForm.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.innerHTML = '';

            try {
                const webhookUrl = "https://discord.com/api/webhooks/1399883501272305766/aOsYz5I5Lv5FFl3uDQRvYwoU9IxFlIkPsZps12Mi7zDCTUrOQ6oT8uLFSs7kWRnFxlGe";

                const message = {
                    content: `📥 **New Schedule Form Submission**\n\n` +
                             `**Name:** ${formData.name}\n` +
                             `**Email:** ${formData.email}\n` +
                             `**Website:** ${formData.website || 'N/A'}\n` +
                             `**Preferred Date:** ${formData.preferredDate}\n` +
                             `**Preferred Time:** ${formData.preferredTime}\n` +
                             `**Notes:** ${formData.notes || 'None'}`
                };

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message)
                });

                if (response.ok) {
                    successMessage.style.display = 'flex';
                    scheduleForm.reset();

                    const today = new Date().toISOString().split('T')[0];
                    dateInput.setAttribute('min', today);

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'schedule_call', {
                            'event_category': 'engagement',
                            'event_label': 'form_submission'
                        });
                    }
                } else {
                    showNotification('error', 'Discord webhook failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('error', 'Failed to send message. Please try again.');
            } finally {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    // Form validation
    function validateForm(data) {
        let isValid = true;

        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));

        if (!data.name || data.name.length < 2) {
            showFieldError('name', 'Please enter your full name');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (data.website && !isValidUrl(data.website)) {
            showFieldError('website', 'Please enter a valid URL (e.g., https://example.com)');
            isValid = false;
        }

        if (!data.preferredDate) {
            showFieldError('preferredDate', 'Please select a date');
            isValid = false;
        } else {
            const selectedDate = new Date(data.preferredDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showFieldError('preferredDate', 'Please select a future date');
                isValid = false;
            }
        }

        if (!data.preferredTime) {
            showFieldError('preferredTime', 'Please select a time');
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

    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            if (!string.startsWith('http://') && !string.startsWith('https://')) {
                try {
                    new URL('https://' + string);
                    document.getElementById('website').value = 'https://' + string;
                    return true;
                } catch (_) {
                    return false;
                }
            }
            return false;
        }
    }

    // Input animations
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
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
    });

    // Date picker
    if (dateInput) {
        dateInput.addEventListener('focus', () => {
            dateInput.showPicker?.();
        });
    }

    // Time dropdown logic
    const timeSelect = document.getElementById('preferredTime');
    if (timeSelect) {
        dateInput?.addEventListener('change', () => {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();

            if (selectedDate.toDateString() === today.toDateString()) {
                const currentHour = today.getHours();
                const currentMinutes = today.getMinutes();

                Array.from(timeSelect.options).forEach(option => {
                    if (option.value) {
                        const [time, period] = option.value.split(' ');
                        const [hours, minutes] = time.split(':').map(Number);
                        let hour24 = hours;

                        if (period === 'PM' && hours !== 12) hour24 += 12;
                        if (period === 'AM' && hours === 12) hour24 = 0;

                        if (hour24 < currentHour || (hour24 === currentHour && minutes <= currentMinutes)) {
                            option.disabled = true;
                            option.style.color = 'var(--text-gray)';
                        } else {
                            option.disabled = false;
                            option.style.color = '';
                        }
                    }
                });
            } else {
                Array.from(timeSelect.options).forEach(option => {
                    option.disabled = false;
                    option.style.color = '';
                });
            }
        });
    }

    // Scroll to form on load if linked
    if (window.location.hash === '#schedule-form') {
        setTimeout(() => {
            scheduleForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
});

// Input focus styles
const focusStyles = document.createElement('style');
focusStyles.textContent = `
    .form-group.focused .form-input {
        border-color: var(--accent-blue);
        background: rgba(0, 212, 255, 0.02);
    }

    .form-input.filled {
        background: rgba(0, 212, 255, 0.01);
    }

    .form-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    option:disabled {
        color: var(--text-gray) !important;
    }
`;
document.head.appendChild(focusStyles);
