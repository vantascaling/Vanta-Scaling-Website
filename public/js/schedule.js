// Schedule form functionality

document.addEventListener('DOMContentLoaded', () => {
    const scheduleForm = document.getElementById('scheduleForm');
    const successMessage = document.getElementById('successMessage');
    
    // Set minimum date to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Set max date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
    
    // Form submission
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                website: document.getElementById('website').value.trim(),
                preferredDate: document.getElementById('preferredDate').value,
                preferredTime: document.getElementById('preferredTime').value,
                notes: document.getElementById('notes').value.trim()
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitButton = scheduleForm.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.innerHTML = '';
            
            try {
                // Send to server
                const response = await fetch('/api/schedule', {
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
                    scheduleForm.reset();
                    
                    // Reset date input min
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.setAttribute('min', today);
                    
                    // Track conversion
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'schedule_call', {
                            'event_category': 'engagement',
                            'event_label': 'form_submission'
                        });
                    }
                } else {
                    showNotification('error', data.error || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('error', 'Failed to schedule call. Please try again or contact us directly.');
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
            showFieldError('name', 'Please enter your full name');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate website (if provided)
        if (data.website && !isValidUrl(data.website)) {
            showFieldError('website', 'Please enter a valid URL (e.g., https://example.com)');
            isValid = false;
        }
        
        // Validate date
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
        
        // Validate time
        if (!data.preferredTime) {
            showFieldError('preferredTime', 'Please select a time');
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
    
    // Validate URL
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            // Try adding https:// if no protocol
            if (!string.startsWith('http://') && !string.startsWith('https://')) {
                try {
                    new URL('https://' + string);
                    // Update the input value with https://
                    document.getElementById('website').value = 'https://' + string;
                    return true;
                } catch (_) {
                    return false;
                }
            }
            return false;
        }
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
    
    // Add date picker enhancement
    if (dateInput) {
        dateInput.addEventListener('focus', () => {
            dateInput.showPicker?.();
        });
    }
    
    // Add time dropdown enhancement
    const timeSelect = document.getElementById('preferredTime');
    if (timeSelect) {
        // Disable past times for today
        dateInput?.addEventListener('change', () => {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            
            if (selectedDate.toDateString() === today.toDateString()) {
                const currentHour = today.getHours();
                const currentMinutes = today.getMinutes();
                
                // Disable past time options
                Array.from(timeSelect.options).forEach(option => {
                    if (option.value) {
                        const [time, period] = option.value.split(' ');
                        const [hours, minutes] = time.split(':').map(Number);
                        let hour24 = hours;
                        
                        if (period === 'PM' && hours !== 12) {
                            hour24 += 12;
                        } else if (period === 'AM' && hours === 12) {
                            hour24 = 0;
                        }
                        
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
                // Enable all options for future dates
                Array.from(timeSelect.options).forEach(option => {
                    option.disabled = false;
                    option.style.color = '';
                });
            }
        });
    }
    
    // Add smooth scroll to form on page load if coming from another page
    if (window.location.hash === '#schedule-form') {
        setTimeout(() => {
            scheduleForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
});

// Add input focus styles
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
