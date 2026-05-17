const MAX_PER_SLOT = 3;

// Global variables
let currentToken = 1000;
let selectedService = '';
let selectedRating = 0;
let users = JSON.parse(localStorage.getItem('users')) || [];

// DOM Elements - FIXED
const tokenForm = document.getElementById('tokenForm');
const tokenResult = document.getElementById('tokenResult');
const serviceCards = document.querySelectorAll('.service-card');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const feedbackModal = document.getElementById('feedbackModal');

// Service Names Mapping (12 Services)
const serviceNames = {
    hospital: 'Hospital OPD',
    saloon: 'Saloon Service', 
    bank: 'Bank Counter',
    govt: 'Government Office',
    passport: 'Passport Office',
    rto: 'RTO/DMV',
    restaurant: 'Restaurant',
    laundry: 'Laundry Service',
    pharmacy: 'Pharmacy',
    gym: 'Gym Session',
    postoffice: 'Post Office',
    electricity: 'Electricity Office'
};

// Navigation Smooth Scroll
 function toggleMenu() {
      document.getElementById('hamburger').classList.toggle('open');
      document.getElementById('navLinks').classList.toggle('open');
      document.getElementById('navOverlay').classList.toggle('open');
    }
 
    function closeMenu() {
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('navOverlay').classList.remove('open');
    }
 
    // Close menu when any nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
 
    // ── Your existing function stubs (replace with real logic) ──
    function openAdmin()         { alert('Admin panel'); }
    function showLogin()         { alert('Login'); }
    function showRegister()      { alert('Register'); }
    function showFeedbackModal() { alert('Feedback'); }
  

 
// Service Selection - FIXED
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove previous selection
        serviceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // ✅ FIRST set service
        selectedService = card.dataset.service;

        // ✅ THEN update slots
        updateSlots();

        // Update service name
        const serviceNameElement = document.getElementById('selectedServiceName');
        if (serviceNameElement) {
            serviceNameElement.textContent = serviceNames[selectedService] || 'Service';
        }

        // ✅ SHOW FORM (main thing)
        if (tokenForm) {
            tokenForm.classList.remove('hidden');
            if (tokenResult) tokenResult.classList.add('hidden');

            tokenForm.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
});
        

// Token Generation - FIXED
const tokenFormElement = document.getElementById('tokenGenerator');
if (tokenFormElement) tokenFormElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const dateInput = document.getElementById('bookingDate');
    const selectedDate = dateInput.value;
    const timeSlot = document.getElementById('timeSlot').value;
    const timeSlotInput = document.getElementById('timeSlot');

    if (timeSlotInput && timeSlotInput.selectedIndex !== -1) {
    const selectedOption = timeSlotInput.options[timeSlotInput.selectedIndex];

    if (selectedOption.disabled) {
        showMessage('This slot is full, choose another', 'error');
        return;
    }
}
    

   if (!name || !phone || !timeSlot || !selectedService || !selectedDate) {
    showMessage('Please fill all fields', 'error');
    return;
}

    let tokens = JSON.parse(localStorage.getItem('tokens')) || [];

    // ✅ calculate queue position
    const sameQueueCount = tokens.filter(t => 
    t.service === selectedService &&
    t.time === timeSlot &&
    t.date === selectedDate
).length;

    const queuePosition = sameQueueCount + 1;

    // generate token
    currentToken++;
    const serviceCode = selectedService.substring(0, 2).toUpperCase();
    const tokenNumber = `Q${serviceCode}${currentToken.toString().padStart(4, '0')}`;
    const dateObj = new Date(selectedDate);
    const today = dateObj.toLocaleDateString('en-GB'); // ✅ DD/MM/YYYY

    // save token
    const tokenData = {
    token: tokenNumber,
    name,
    phone,
    service: selectedService,
    time: timeSlot,
    date: selectedDate,
    timestamp: new Date().toISOString()
};

    tokens.push(tokenData);
    localStorage.setItem('tokens', JSON.stringify(tokens));

    // show data
    document.getElementById('tokenNumber').textContent = tokenNumber;
    document.getElementById('tokenTime').textContent = timeSlot;
    document.getElementById('tokenDate').textContent = today;

    // ✅ queue position display (SAFE)
    const queueElement = document.getElementById('queuePosition');
    if (queueElement) {
        queueElement.textContent = queuePosition;
    }

    document.getElementById('bookingDate').min = new Date().toISOString().split('T')[0];
    document.getElementById('tokenResult').classList.remove('hidden');
});
    
        

// Print Token - FIXED
function printToken() {
    const tokenNumberElement = document.getElementById('tokenNumber');
    const tokenTimeElement = document.getElementById('tokenTime');
    const tokenDateElement = document.getElementById('tokenDate');
    
    if (!tokenNumberElement || !tokenTimeElement || !tokenDateElement) return;
    
    const tokenNumber = tokenNumberElement.textContent;
    const tokenTime = tokenTimeElement.textContent;
    const tokenDate = tokenDateElement.textContent;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>QueueZero Token - ${tokenNumber}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f7fa; margin: 0; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 20px; margin-bottom: 30px; }
                .token-box { background: linear-gradient(45deg, #ffd700, #ffed4e); color: #333; padding: 40px; border-radius: 20px; margin: 30px auto; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
                .token-number { font-size: 4rem; font-weight: bold; font-family: 'Courier New', monospace; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
                .details { font-size: 1.3rem; margin: 15px 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .print-btn { background: #2ed573; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.2rem; cursor: pointer; margin-top: 20px; }
                @media print { .print-btn { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="margin: 0; font-size: 2.5rem;"><i class="fas fa-clock"></i> QueueZero</h1>
                <p style="margin: 10px 0 0 0; font-size: 1.2rem;">Digital Queue Management</p>
            </div>
            <div class="token-box">
                <div class="token-number">${tokenNumber}</div>
                <div class="details"><i class="fas fa-clock"></i> Reach between: ${tokenTime}</div>
                <div class="details"><i class="fas fa-calendar"></i> Date: ${tokenDate}</div>
                <p style="font-size: 1.1rem; margin-top: 20px; color: #666;">Please arrive 10 minutes before your slot</p>
            </div>
            <button class="print-btn" onclick="window.print()">🖨️ Print Token</button>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Modal Functions
function showLogin() { 
    if (loginModal) { loginModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; } 
}
function showRegister() { 
    if (registerModal) { registerModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; } 
}
function closeLogin() { 
    if (loginModal) loginModal.classList.add('hidden'); 
    document.body.style.overflow = 'auto'; 
    clearLoginErrors(); 
}
function closeRegister() { 
    if (registerModal) registerModal.classList.add('hidden'); 
    document.body.style.overflow = 'auto'; 
    clearRegisterErrors(); 
}
function closeFeedback() { 
    if (feedbackModal) feedbackModal.classList.add('hidden'); 
    document.body.style.overflow = 'auto'; 
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
}

// Password Strength
function checkPasswordStrength(password, strengthElement) {
    if (!strengthElement) return;
    const strength = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) ? 'strong' :
                    password.length >= 6 ? 'medium' : 'weak';
    
    strengthElement.innerHTML = '';
    const bar = document.createElement('div');
    bar.className = `strength-${strength}`;
    strengthElement.appendChild(bar);
    return strength;
}

// Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearLoginErrors() {
    const errors = ['loginEmailError', 'loginPasswordError'];
    errors.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = '';
    });
}

function clearRegisterErrors() {
    const errors = ['regNameError', 'regEmailError', 'regPhoneError', 'regPasswordError'];
    errors.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = '';
    });
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = message;
}

// Register Form - FIXED
const regPassword = document.getElementById('regPassword');
if (regPassword) {
    regPassword.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value, document.getElementById('regPasswordStrength'));
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearRegisterErrors();
        let isValid = true;
        
        const name = document.getElementById('regName')?.value.trim() || '';
        const email = document.getElementById('regEmail')?.value.trim() || '';
        const phone = document.getElementById('regPhone')?.value.trim() || '';
        const password = document.getElementById('regPassword')?.value || '';
        
        if (name.length < 2) { showError('regNameError', 'Name must be at least 2 characters'); isValid = false; }
        if (!validateEmail(email)) { showError('regEmailError', 'Enter valid email'); isValid = false; }
        else if (users.find(user => user.email === email)) { showError('regEmailError', 'Email already registered'); isValid = false; }
        if (phone.length !== 10 || isNaN(phone)) { showError('regPhoneError', 'Enter valid 10-digit phone'); isValid = false; }
        if (password.length < 6) { showError('regPasswordError', 'Password must be minimum 6 characters'); isValid = false; }
        
        if (isValid) {
            users.push({ name, email, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            showMessage('Registration successful! Please login.', 'success');
            closeRegister();
            showLogin();
        }
    });
}

// Login Form - FIXED
const loginPassword = document.getElementById('loginPassword');
if (loginPassword) {
    loginPassword.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value, document.getElementById('passwordStrength'));
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearLoginErrors();
        
        const email = document.getElementById('loginEmail')?.value.trim() || '';
        const password = document.getElementById('loginPassword')?.value || '';
        
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            showError('loginEmailError', 'Invalid email or password');
            return;
        }
        
        showMessage('Login successful! Welcome back!', 'success');
        closeLogin();
    });
}

// Feedback System - FIXED
const stars = document.querySelectorAll('.stars i');
stars.forEach(star => {
    star.addEventListener('click', (e) => {
        selectedRating = parseInt(e.target.dataset.rating);
        stars.forEach(s => {
            s.classList.remove('active');
            if (parseInt(s.dataset.rating) <= selectedRating) s.classList.add('active');
        });
        const ratingText = document.getElementById('selectedRating');
        if (ratingText) ratingText.textContent = selectedRating;
    });
});

const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (selectedRating === 0) { 
            alert('Please select a rating'); 
            return; 
        }
        
        const comment = document.getElementById('feedbackComment')?.value || '';
        const feedbackData = { rating: selectedRating, comment, date: new Date().toLocaleString() };
        
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.push(feedbackData);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        
        showMessage('Thank you for your feedback!', 'success');
        closeFeedback();
        if (feedbackForm) feedbackForm.reset();
        selectedRating = 0;
    });
}

function showFeedbackModal() {
    if (feedbackModal) {
        feedbackModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Utility Functions
function showMessage(message, type) {
    const existingMsg = document.querySelector('.success, .error-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = type === 'success' ? 'success' : 'error-message';
    msgDiv.textContent = message;
    msgDiv.style.cssText = 'display: block; padding: 1.2rem; border-radius: 15px; margin: 1.5rem 0; text-align: center; font-weight: 500;';
    
    if (type === 'success') {
        msgDiv.style.background = 'linear-gradient(135deg, #2ed573 0%, #27ae60 100%)';
        msgDiv.style.color = 'white';
    } else {
        msgDiv.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%)';
        msgDiv.style.color = 'white';
    }
    
    const container = document.querySelector('.token-form, .modal-content, body');
    if (container) {
        container.parentNode.insertBefore(msgDiv, container.nextSibling);
    }
    
    setTimeout(() => { if (msgDiv.parentNode) msgDiv.remove(); }, 5000);
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLogin();
    if (e.target === registerModal) closeRegister();
    if (e.target === feedbackModal) closeFeedback();
});

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    const tokens = JSON.parse(localStorage.getItem('tokens')) || [];
    if (tokens.length > 0) {
        const lastToken = tokens[tokens.length - 1].token;
        const match = lastToken.match(/(\d+)$/);
        if (match) currentToken = parseInt(match[1]) || 1000;
        const dateInput = document.getElementById('bookingDate');
if (dateInput) {
    dateInput.addEventListener('change', updateSlots);
}
    }
});

// SMS/WhatsApp Sender - FREE
function sendTokenSMS(phone, tokenNumber, service, timeSlot) {
    const countryCode = '+91'; // India
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullNumber = countryCode + cleanPhone;
    
    const message = `🎫 *QueueZero Token Generated!*

*Token:* ${tokenNumber}
*Service:* ${serviceNames[service] || service}
*Time Slot:* ${timeSlot}
*Date:* ${new Date().toLocaleDateString('en-IN')}

✅ Reach 10 mins early
Powered by QueueZero`;

    // WhatsApp Web (Works on mobile too!)
    const whatsappURL = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Fallback SMS (for Android)
    const smsURL = `sms:${fullNumber}?body=${encodeURIComponent(message)}`;
    console.log('SMS URL:', smsURL);
}

// SMS/WhatsApp Sender - FREE
function sendTokenSMS(phone, tokenNumber, service, timeSlot) {
    const countryCode = '+91'; // India
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullNumber = countryCode + cleanPhone;
    
    const message = `🎫 *QueueZero Token Generated!*

*Token:* ${tokenNumber}
*Service:* ${serviceNames[service] || service}
*Time Slot:* ${timeSlot}
*Date:* ${new Date().toLocaleDateString('en-IN')}

✅ Reach 10 mins early
Powered by QueueZero`;

    // WhatsApp Web (Works on mobile too!)
    const whatsappURL = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Fallback SMS (for Android)
    const smsURL = `sms:${fullNumber}?body=${encodeURIComponent(message)}`;
    console.log('SMS URL:', smsURL);
}

const toggleBtn = document.getElementById('themeToggle');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = '🌙';
    }
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1500);
});

function openAdmin() {
    document.getElementById('adminPanel').classList.remove('hidden');
    loadAdminData();
}

function closeAdmin() {
    document.getElementById('adminPanel').classList.add('hidden');
}

function loadAdminData() {
    const dataDiv = document.getElementById('adminData');
    let tokens = JSON.parse(localStorage.getItem('tokens')) || [];

    if (tokens.length === 0) {
        dataDiv.innerHTML = "<p>No bookings yet</p>";
        return;
    }

    let html = "<table border='1' style='width:100%; text-align:center'>";
    html += "<tr><th>Token</th><th>Name</th><th>Service</th><th>Time</th></tr>";

    tokens.forEach(t => {
        html += `<tr>
            <td>${t.token}</td>
            <td>${t.name}</td>
            <td>${t.service}</td>
            <td>${t.time}</td>
        </tr>`;
    });

    html += "</table>";
    dataDiv.innerHTML = html;
}

function updateSlots() {
    const selectedDate = document.getElementById('bookingDate').value;
    const tokens = JSON.parse(localStorage.getItem('tokens')) || [];
    const timeSelect = document.getElementById('timeSlot');

    if (!selectedDate || !timeSelect) return;

    const options = timeSelect.querySelectorAll('option');

    options.forEach(option => {
        if (!option.value) return;

        const count = tokens.filter(t =>
            t.date === selectedDate &&
            t.time === option.value &&
            t.service === selectedService
        ).length;

        if (count >= MAX_PER_SLOT) {
            option.disabled = true;
            option.textContent = option.value + " (Full)";
        } else {
            option.disabled = false;
            option.textContent = option.value;
        }
    });
}