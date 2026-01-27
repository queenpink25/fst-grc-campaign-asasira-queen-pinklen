// Countdown timer for February 17, 2026
function updateCountdown() {
    const electionDate = new Date('February 17, 2026 23:59:59').getTime();
    const now = new Date().getTime();
    const timeLeft = electionDate - now;
    
    if (timeLeft < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Animate commitment cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe commitment cards and reason boxes
document.querySelectorAll('.commitment-card, .reason-box').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Add simple counter animation to reason numbers
document.querySelectorAll('.reason-number').forEach(number => {
    const originalText = number.textContent;
    number.textContent = '0';
    
    const animateNumber = () => {
        let current = 0;
        const target = parseInt(originalText);
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current).toString().padStart(2, '0');
        }, 30);
    };
    
    // Animate when the element comes into view
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber();
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    numberObserver.observe(number);
});

// Redirect all vote buttons to vu.ac.ug
document.addEventListener('DOMContentLoaded', function() {
    const voteButtons = document.querySelectorAll('.vote-button, .cta-big-button, .btn-secondary');
    voteButtons.forEach(button => {
        if (!button.getAttribute('href') || button.getAttribute('href') === '#vote') {
            button.setAttribute('href', 'https://vu.ac.ug');
            button.setAttribute('target', '_blank');
        }
    });
    
    // Add animation for feedback form elements
    const feedbackObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe feedback form elements
    document.querySelectorAll('.feedback-form-container, .issue-item, .feedback-stats, .privacy-note').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        feedbackObserver.observe(element);
    });
});
function sendToGmail() {
    // Get form values
    const name = document.getElementById('name').value || 'Anonymous';
    const email = document.getElementById('email').value || '';
    const department = document.getElementById('department').value || '';
    const message = document.getElementById('message').value;
    const issues = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                      .map(cb => cb.nextElementSibling.textContent)
                      .join(', ');
    
    if (!message.trim()) {
        alert('Please describe your issue');
        return;
    }
    
    // Create email content
    const subject = `GRC Feedback from ${name}`;
    const body = `
Student Name: ${name}
Email: ${email}
Department: ${department}
Issues: ${issues}

Message:
${message}

Submitted via GRC Campaign Website
    `.trim();
    
    // Encode for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Open Gmail compose window
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=queenpink25@gmail.com&su=${encodedSubject}&body=${encodedBody}`, '_blank');
    
    // Save locally too
    saveFeedbackLocally({name, email, department, message, issues});
}