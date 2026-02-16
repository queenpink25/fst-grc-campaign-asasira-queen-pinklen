// Feedback Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('formMessage');
    const anonymousCheckbox = document.getElementById('anonymous');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const feedbackCountElement = document.getElementById('feedbackCount');
    
    // BASELINE COUNT - This is your starting number from HTML
    const BASELINE_COUNT = 478;
    
    // Initialize feedback count
    updateFeedbackCount();
    
    // Listen for storage changes (updates across tabs/windows)
    window.addEventListener('storage', function(e) {
        if (e.key === 'grcFeedback') {
            updateFeedbackCount();
        }
    });
    
    // REAL-TIME UPDATE: Check for new submissions every 2 seconds
    setInterval(function() {
        updateFeedbackCount();
    }, 2000);
    
    // Toggle name/email fields based on anonymous checkbox
    if (anonymousCheckbox && nameInput && emailInput) {
        anonymousCheckbox.addEventListener('change', function() {
            if (this.checked) {
                nameInput.disabled = true;
                emailInput.disabled = true;
                nameInput.value = '';
                emailInput.value = '';
                nameInput.placeholder = 'Anonymous submission';
                emailInput.placeholder = 'Anonymous submission';
            } else {
                nameInput.disabled = false;
                emailInput.disabled = false;
                nameInput.placeholder = 'Your name';
                emailInput.placeholder = 'Your email';
            }
        });
    }
    
    // Handle form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                year: document.getElementById('year').value,
                message: document.getElementById('message').value,
                anonymous: document.getElementById('anonymous').checked,
                contactPermission: document.getElementById('contact-permission').checked,
                issues: Array.from(document.querySelectorAll('input[name="issues[]"]:checked')).map(cb => cb.value),
                timestamp: new Date().toISOString()
            };
            
            // Validate message
            if (!formData.message.trim()) {
                showMessage('Please describe your issue in the message field.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Save to localStorage
                saveFeedback(formData);
                
                // Show success message
                showMessage('Thank you for your feedback! Your concerns have been recorded and will inform my GRC agenda.', 'success');
                
                // Reset form
                feedbackForm.reset();
                if (anonymousCheckbox) anonymousCheckbox.checked = false;
                if (nameInput && emailInput) {
                    nameInput.disabled = false;
                    emailInput.disabled = false;
                    nameInput.placeholder = 'Your name';
                    emailInput.placeholder = 'Your email';
                }
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Update feedback stats
                updateFeedbackCount();
            }, 1500);
        });
    }
    
    function saveFeedback(feedback) {
        try {
            // Get existing feedback from localStorage
            let allFeedback = JSON.parse(localStorage.getItem('grcFeedback')) || [];
            
            // Add new feedback
            allFeedback.push(feedback);
            
            // Save back to localStorage (limit to 1000 entries)
            if (allFeedback.length > 1000) {
                allFeedback = allFeedback.slice(-1000);
            }
            localStorage.setItem('grcFeedback', JSON.stringify(allFeedback));
            
            console.log('Feedback saved successfully. Total submissions:', allFeedback.length);
            
            // Trigger storage event for other tabs
            window.dispatchEvent(new Event('storage'));
            
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    }
    
    function showMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function updateFeedbackCount() {
        try {
            // Get new submissions from localStorage
            const allFeedback = JSON.parse(localStorage.getItem('grcFeedback')) || [];
            
            if (feedbackCountElement) {
                // Calculate total: BASELINE (278) + new submissions
                const totalCount = BASELINE_COUNT + allFeedback.length;
                
                // Get current displayed value
                const currentDisplay = parseInt(feedbackCountElement.textContent) || 0;
                
                // Update the display
                feedbackCountElement.textContent = totalCount;
                
                // Add animation if count changed
                if (currentDisplay !== totalCount) {
                    // Add pulse animation
                    feedbackCountElement.style.transition = 'transform 0.3s ease';
                    feedbackCountElement.style.transform = 'scale(1.2)';
                    
                    setTimeout(() => {
                        feedbackCountElement.style.transform = 'scale(1)';
                    }, 300);
                    
                    // Show mini notification
                    showFloatingNotification(`+${totalCount - currentDisplay} new`);
                }
                
                // Add a title to show breakdown on hover
                feedbackCountElement.title = `${BASELINE_COUNT} baseline + ${allFeedback.length} new submissions`;
            }
        } catch (error) {
            console.error('Error updating feedback count:', error);
        }
    }
    
    // Floating notification for real-time updates
    function showFloatingNotification(message) {
        // Check if notification already exists
        let notification = document.getElementById('realTimeNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'realTimeNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                color: white;
                padding: 12px 20px;
                border-radius: 50px;
                font-weight: 600;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideIn 0.5s ease;
                border-left: 4px solid #ffd700;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = `📢 ${message} concern${message.includes('1') ? '' : 's'} received!`;
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }, 3000);
    }
    
    // Add animation styles if they don't exist
    if (!document.getElementById('realTimeStyles')) {
        const style = document.createElement('style');
        style.id = 'realTimeStyles';
        style.textContent = `
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
            
            .stat-number {
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
});
