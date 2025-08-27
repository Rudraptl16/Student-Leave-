// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const loginForm = document.querySelector('.login-form');
const filterButtons = document.querySelectorAll('.filter-btn');
const leaveItems = document.querySelectorAll('.leave-item');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (studentId && password) {
        // Simulate successful login
        showSection('dashboard');
        updateNavAfterLogin();
    }
});

// Filter Leave Items
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter leave items
        leaveItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
            } else {
                if (item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// Leave Application Form Submission
const leaveForm = document.querySelector('.leave-form');
if (leaveForm) {
    leaveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const leaveType = document.getElementById('leaveType').value;
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const reason = document.getElementById('reason').value;
        
        if (leaveType && fromDate && toDate && reason) {
            // Simulate successful submission
            alert('Leave application submitted successfully! It will be reviewed soon.');
            leaveForm.reset();
        }
    });
}

// Navigation between sections
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        if (targetId === 'login') {
            showSection('login');
        } else {
            // Check if user is logged in (simplified)
            const isLoggedIn = document.querySelector('.dashboard-section:not(.hidden)');
            if (isLoggedIn) {
                showSection(targetId);
            } else {
                showSection('login');
            }
        }
        
        // Update active navigation link
        updateActiveNavLink(targetId);
    });
});

function updateActiveNavLink(activeSection) {
    // Update active state for all nav links
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('href').substring(1);
        if (linkSection === activeSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Show specific section and hide others
function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// Update navigation after login
function updateNavAfterLogin() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.removeAttribute('href');
        loginBtn.addEventListener('click', handleLogout);
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    showSection('login');
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.setAttribute('href', '#login');
        loginBtn.removeEventListener('click', handleLogout);
    }
}

// Date validation for leave form
const fromDateInput = document.getElementById('fromDate');
const toDateInput = document.getElementById('toDate');

if (fromDateInput && toDateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    fromDateInput.min = today;
    toDateInput.min = today;
    
    fromDateInput.addEventListener('change', () => {
        toDateInput.min = fromDateInput.value;
    });
}

// Form validation styles
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#28a745';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '#667eea';
    });
});

// Smooth scrolling for navigation
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

// Initialize the application
function initApp() {
    // Show login section by default
    showSection('login');
    
    // Add today's date to date inputs
    const today = new Date().toISOString().split('T')[0];
    if (fromDateInput) fromDateInput.value = today;
    if (toDateInput) toDateInput.value = today;
}

// Start the application
document.addEventListener('DOMContentLoaded', initApp);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Responsive design helpers
function checkScreenSize() {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', checkScreenSize);

// Demo data for testing
function loadDemoData() {
    // This would typically come from a backend API
    console.log('Loading demo student leave data...');
}

// Call demo data on page load
window.addEventListener('load', loadDemoData);
