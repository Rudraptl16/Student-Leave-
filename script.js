// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const loginForm = document.querySelector('.login-form');
const filterButtons = document.querySelectorAll('.filter-btn');
const leaveItems = document.querySelectorAll('.leave-item');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeModal = document.querySelector('.close');
const resetPasswordForm = document.getElementById('resetPasswordForm');

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
        showNotification('Login successful! Welcome back.', 'success');
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
            // Create new leave application
            const newLeave = {
                id: Date.now(), // Unique ID using timestamp
                type: leaveType,
                fromDate: fromDate,
                toDate: toDate,
                reason: reason,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            
            // Add to status section
            addLeaveToStatus(newLeave);
            
            // Show success message
            showNotification('Leave application submitted successfully! It will be reviewed soon.', 'success');
            
            // Reset form
            leaveForm.reset();
            
            // Navigate to status section
            showSection('status');
            updateActiveNavLink('status');
        }
    });
}

// Add new leave application to status section
function addLeaveToStatus(leave) {
    const leaveList = document.querySelector('.leave-list');
    
    // Format dates for display
    const fromDateFormatted = formatDate(leave.fromDate);
    const toDateFormatted = formatDate(leave.toDate);
    
    // Create leave item HTML
    const leaveItem = document.createElement('div');
    leaveItem.className = `leave-item ${leave.status}`;
    leaveItem.dataset.id = leave.id;
    
    leaveItem.innerHTML = `
        <div class="leave-info">
            <h4>${getLeaveTypeDisplay(leave.type)}</h4>
            <p>${fromDateFormatted} - ${toDateFormatted}</p>
            <span class="status-badge ${leave.status}">${leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</span>
        </div>
        <div class="leave-details">
            <p>${leave.reason}</p>
            <small>Submitted: ${formatDateTime(leave.submittedAt)}</small>
        </div>
    `;
    
    // Add animation class
    leaveItem.classList.add('fade-in');
    
    // Add to the beginning of the list (most recent first)
    leaveList.insertBefore(leaveItem, leaveList.firstChild);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        leaveItem.classList.remove('fade-in');
    }, 500);
}

// Format date for display (MMM DD, YYYY)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format date and time for display
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get display name for leave type
function getLeaveTypeDisplay(type) {
    const types = {
        'sick': 'Sick Leave',
        'personal': 'Personal Leave',
        'emergency': 'Emergency Leave',
        'academic': 'Academic Leave'
    };
    return types[type] || type;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

// Remove notification
function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
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
            const loginBtn = document.querySelector('.login-btn');
            const isLoggedIn = loginBtn && loginBtn.textContent.toLowerCase() === 'logout';
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
    // Show profile section by default for testing
    showSection('profile');
    
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

// Forgot Password Modal functionality
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.classList.remove('hidden');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        forgotPasswordModal.classList.add('hidden');
    });
}

// Close modal when clicking outside
if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener('click', (e) => {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.classList.add('hidden');
        }
    });
}

// Reset Password Form Submission
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        if (email) {
            // Simulate sending reset link
            alert('Password reset link has been sent to your email!');
            resetPasswordForm.reset();
            forgotPasswordModal.classList.add('hidden');
        }
    });
}

// Profile Picture Upload Functionality
const avatarUpload = document.getElementById('avatarUpload');
const profileAvatar = document.getElementById('profileAvatar');
const removeAvatarBtn = document.getElementById('removeAvatarBtn');

if (avatarUpload) {
    avatarUpload.addEventListener('change', handleAvatarUpload);
}

if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', removeAvatar);
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Image size should be less than 2MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // Update profile picture
            profileAvatar.src = e.target.result;
            
            // Save to localStorage
            localStorage.setItem('profileAvatar', e.target.result);
            
            showNotification('Profile picture updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function removeAvatar() {
    // Reset to default avatar
    const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-6.627 0-12 5.373-12 12h24c0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E";
    profileAvatar.src = defaultAvatar;
    
    // Remove from localStorage
    localStorage.removeItem('profileAvatar');
    
    showNotification('Profile picture removed.', 'info');
}

// Load saved profile picture on page load
function loadProfilePicture() {
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
        profileAvatar.src = savedAvatar;
    }
}

// Enhanced Profile Section Functionality
const profileTabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Profile Tab Switching
if (profileTabButtons.length > 0) {
    profileTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons
            profileTabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Show the selected tab pane
            const targetPane = document.getElementById(tabId + '-tab');
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Student Profile Data (Demo Data)
const studentProfile = {
    personalInfo: {
        fullName: "Rudra Patel",
        studentId: "STU2024001",
        email: "rudra.patel@student.edu",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "2000-05-15",
        gender: "Male",
        bloodGroup: "O+"
    },
    academicInfo: {
        department: "Computer Science",
        program: "Bachelor of Technology",
        semester: "6th Semester",
        enrollmentDate: "2022-08-15",
        expectedGraduation: "2026-05-30",
        cgpa: "8.7",
        creditsCompleted: "120",
        advisor: "Dr. Sarah Johnson"
    },
    contactInfo: {
        address: "123 College Street, Tech City, TC 12345",
        emergencyContact: "Rajesh Patel (Father)",
        emergencyPhone: "+1 (555) 987-6543",
        parentEmail: "parent@example.com"
    },
    attendanceStats: {
        overall: "92%",
        thisSemester: "95%",
        lastSemester: "89%"
    },
    leaveStats: {
        totalApplied: 8,
        approved: 6,
        pending: 1,
        rejected: 1
    }
};

// Populate Profile Data
function populateProfileData() {
    // Personal Information
    const profileNameEl = document.getElementById('profileName');
    if (profileNameEl) profileNameEl.value = studentProfile.personalInfo.fullName;
    
    const studentIdEl = document.getElementById('studentId');
    if (studentIdEl) studentIdEl.value = studentProfile.personalInfo.studentId;
    
    const studentEmailEl = document.getElementById('studentEmail');
    if (studentEmailEl) studentEmailEl.value = studentProfile.personalInfo.email;
    
    const studentPhoneEl = document.getElementById('studentPhone');
    if (studentPhoneEl) studentPhoneEl.value = studentProfile.personalInfo.phone;
    
    const studentDOBEl = document.getElementById('studentDOB');
    if (studentDOBEl) studentDOBEl.value = studentProfile.personalInfo.dateOfBirth;
    
    const studentGenderEl = document.getElementById('studentGender');
    if (studentGenderEl) studentGenderEl.value = studentProfile.personalInfo.gender;
    
    const studentBloodGroupEl = document.getElementById('studentBloodGroup');
    if (studentBloodGroupEl) studentBloodGroupEl.value = studentProfile.personalInfo.bloodGroup;

    // Academic Information
    const studentDepartmentEl = document.getElementById('studentDepartment');
    if (studentDepartmentEl) studentDepartmentEl.value = studentProfile.academicInfo.department;
    
    const studentProgramEl = document.getElementById('studentProgram');
    if (studentProgramEl) studentProgramEl.value = studentProfile.academicInfo.program;
    
    const studentSemesterEl = document.getElementById('studentSemester');
    if (studentSemesterEl) studentSemesterEl.value = studentProfile.academicInfo.semester;
    
    const enrollmentDateEl = document.getElementById('enrollmentDate');
    if (enrollmentDateEl) enrollmentDateEl.value = studentProfile.academicInfo.enrollmentDate;
    
    const graduationDateEl = document.getElementById('graduationDate');
    if (graduationDateEl) graduationDateEl.value = studentProfile.academicInfo.expectedGraduation;
    
    const studentCGPAEl = document.getElementById('studentCGPA');
    if (studentCGPAEl) studentCGPAEl.value = studentProfile.academicInfo.cgpa;
    
    const creditsCompletedEl = document.getElementById('creditsCompleted');
    if (creditsCompletedEl) creditsCompletedEl.value = studentProfile.academicInfo.creditsCompleted;
    
    const academicAdvisorEl = document.getElementById('academicAdvisor');
    if (academicAdvisorEl) academicAdvisorEl.value = studentProfile.academicInfo.advisor;

    // Contact Information
    const studentAddressEl = document.getElementById('studentAddress');
    if (studentAddressEl) studentAddressEl.value = studentProfile.contactInfo.address;
    
    const emergencyContactEl = document.getElementById('emergencyContact');
    if (emergencyContactEl) emergencyContactEl.value = studentProfile.contactInfo.emergencyContact;
    
    const emergencyPhoneEl = document.getElementById('emergencyPhone');
    if (emergencyPhoneEl) emergencyPhoneEl.value = studentProfile.contactInfo.emergencyPhone;
    
    const parentEmailEl = document.getElementById('parentEmail');
    if (parentEmailEl) parentEmailEl.value = studentProfile.contactInfo.parentEmail;

    // Update stats in the sidebar
    const attendanceStatEl = document.getElementById('attendanceStat');
    if (attendanceStatEl) attendanceStatEl.textContent = studentProfile.attendanceStats.overall;
    
    const leaveAppliedStatEl = document.getElementById('leaveAppliedStat');
    if (leaveAppliedStatEl) leaveAppliedStatEl.textContent = studentProfile.leaveStats.totalApplied;
    
    const leaveApprovedStatEl = document.getElementById('leaveApprovedStat');
    if (leaveApprovedStatEl) leaveApprovedStatEl.textContent = studentProfile.leaveStats.approved;
    
    const cgpaStatEl = document.getElementById('cgpaStat');
    if (cgpaStatEl) cgpaStatEl.textContent = studentProfile.academicInfo.cgpa;
}

// Export Profile Data
function exportProfileData() {
    const dataStr = JSON.stringify(studentProfile, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${studentProfile.personalInfo.studentId}_profile.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Profile data exported successfully!', 'success');
}

// Print Profile
function printProfile() {
    const printContent = document.querySelector('.profile-main-card').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; margin-bottom: 20px;">Student Profile - ${studentProfile.personalInfo.fullName}</h1>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    
    // Re-initialize event listeners
    initProfileEventListeners();
    showNotification('Profile printed successfully!', 'success');
}

// Initialize Profile Event Listeners
function initProfileEventListeners() {
    const exportBtn = document.getElementById('exportProfileBtn');
    const printBtn = document.getElementById('printProfileBtn');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const downloadProfileBtn = document.querySelector('.download-profile-btn');
    const printProfileBtn = document.querySelector('.print-profile-btn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportProfileData);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printProfile);
    }
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', toggleEditMode);
    }
    
    if (downloadProfileBtn) {
        downloadProfileBtn.addEventListener('click', exportProfileData);
    }
    
    if (printProfileBtn) {
        printProfileBtn.addEventListener('click', printProfile);
    }
}

// Toggle Edit Mode for Profile
function toggleEditMode() {
    const profileForm = document.getElementById('profileForm');
    const inputs = profileForm.querySelectorAll('input');
    const isEditing = profileForm.classList.contains('editing');
    
    if (isEditing) {
        // Save changes and exit edit mode
        profileForm.classList.remove('editing');
        this.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        
        // Save the changes (in a real app, this would send to server)
        const fullName = document.getElementById('fullName').value;
        const department = document.getElementById('department').value;
        
        // Update the displayed values in other sections if needed
        const studentNameElements = document.querySelectorAll('.student-name');
        studentNameElements.forEach(el => {
            el.textContent = fullName;
        });
        
        showNotification('Profile updated successfully!', 'success');
    } else {
        // Enter edit mode
        profileForm.classList.add('editing');
        this.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        
        // Make inputs editable
        inputs.forEach(input => {
            if (!input.hasAttribute('readonly')) {
                input.removeAttribute('readonly');
                input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                input.style.border = '2px solid #4facfe';
            }
        });
    }
}

// Call demo data on page load
window.addEventListener('load', function() {
    loadDemoData();
    loadProfilePicture();
    populateProfileData();
    initProfileEventListeners();
    
    // Activate first tab by default
    if (profileTabButtons.length > 0) {
        profileTabButtons[0].click();
    }
});
