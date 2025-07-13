// Google Apps Script Web App URL - Ganti dengan URL Apps Script kamu
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7k2v0ij2vvib7xcJjMy5XV2cgnSeZ13bcK0ZADPCFbNIJwr6wanibFS7fZsrlkePfqg/exec';

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        nama: formData.get('nama').trim(),
        kelas: formData.get('kelas').trim(),
        whatsapp: formData.get('whatsapp').trim(),
        alasan: formData.get('alasan').trim(),
        minat: formData.get('minat')
    };
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    
    try {
        // Send data to Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('registrationForm').reset();
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
});

// Form validation
function validateForm(data) {
    const errors = [];
    
    // Validate nama
    if (!data.nama || data.nama.length < 2) {
        errors.push('Nama lengkap harus diisi minimal 2 karakter');
        highlightError('nama');
    }
    
    // Validate kelas
    if (!data.kelas) {
        errors.push('Kelas harus diisi');
        highlightError('kelas');
    }
    
    // Validate WhatsApp
    if (!data.whatsapp || !isValidWhatsApp(data.whatsapp)) {
        errors.push('Nomor WhatsApp tidak valid');
        highlightError('whatsapp');
    }
    
    // Validate minat
    if (!data.minat) {
        errors.push('Minat utama harus dipilih');
        highlightError('minat');
    }
    
    // Validate alasan
    if (!data.alasan || data.alasan.length < 10) {
        errors.push('Alasan bergabung harus diisi minimal 10 karakter');
        highlightError('alasan');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

// WhatsApp validation
function isValidWhatsApp(number) {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15 && 
           (cleanNumber.startsWith('62') || cleanNumber.startsWith('08'));
}

// Highlight error fields
function highlightError(fieldName) {
    const field = document.getElementById(fieldName);
    field.classList.add('border-red-300', 'focus:border-red-500', 'animate-pulse');
    field.classList.remove('border-gray-200', 'focus:border-green-primary');
    
    setTimeout(() => {
        field.classList.remove('animate-pulse');
    }, 1000);
}

// Show success message
function showSuccessMessage() {
    showModal();
    
    // Add confetti effect
    createConfetti();
}

// Show error message
function showErrorMessage(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
        <div class="flex items-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <p class="font-semibold">Terjadi Kesalahan</p>
                <p class="text-sm opacity-90">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#85C88A', '#A8D5AA', '#8B4513', '#F5F5DC'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '1000';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
        });
        
        animation.onfinish = () => {
            document.body.removeChild(confetti);
        };
    }
}

// Auto-resize textarea
document.getElementById('alasan').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Character counter for alasan
const alasanField = document.getElementById('alasan');
const charCounter = document.createElement('div');
charCounter.className = 'text-sm text-gray-400 text-right mt-2';
charCounter.textContent = '0 karakter';
alasanField.parentNode.appendChild(charCounter);

alasanField.addEventListener('input', function() {
    const length = this.value.length;
    charCounter.textContent = `${length} karakter`;
    
    if (length < 10) {
        charCounter.classList.add('text-red-400');
        charCounter.classList.remove('text-gray-400', 'text-green-500');
    } else if (length >= 10 && length <= 500) {
        charCounter.classList.add('text-green-500');
        charCounter.classList.remove('text-gray-400', 'text-red-400');
    } else {
        charCounter.classList.add('text-red-400');
        charCounter.classList.remove('text-gray-400', 'text-green-500');
    }
});

// Form auto-save to localStorage
function saveFormData() {
    const formData = new FormData(document.getElementById('registrationForm'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('pertanianMilenialForm', JSON.stringify(data));
}

function loadFormData() {
    const savedData = localStorage.getItem('pertanianMilenialForm');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

// Auto-save form data on input
document.getElementById('registrationForm').addEventListener('input', saveFormData);

// Load saved form data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Clear saved data on successful submission
function clearSavedData() {
    localStorage.removeItem('pertanianMilenialForm');
}

// Add to success handler
const originalShowModal = showModal;
showModal = function() {
    originalShowModal();
    clearSavedData();
};
