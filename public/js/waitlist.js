document.addEventListener('DOMContentLoaded', () => {
    const waitlistForm = document.getElementById('waitlist-form');
    if (!waitlistForm) return;
    
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = waitlistForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        
        // Disable form while submitting
        emailInput.disabled = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Joining...';
        
        try {
            // Here we'll use Formspree as a simple backend
            // Sign up for a free account at formspree.io and replace 'YOUR_FORM_ID' with your form ID
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    source: 'Muse Garden Waitlist'
                })
            });
            
            if (response.ok) {
                // Show success message
                waitlistForm.innerHTML = '<p class="success-message">Thanks for joining the waitlist! We\'ll be in touch soon.</p>';
                
                // Also store in localStorage to remember this user joined
                const waitlistEmails = JSON.parse(localStorage.getItem('muse-garden-waitlist') || '[]');
                waitlistEmails.push(email);
                localStorage.setItem('muse-garden-waitlist', JSON.stringify(waitlistEmails));
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    const modal = document.getElementById('waitlist-modal');
                    if (modal) modal.classList.add('hidden');
                    
                    // Reset form for next time
                    setTimeout(() => {
                        waitlistForm.innerHTML = `
                            <input type="email" placeholder="Your email" required>
                            <button type="submit" class="cta-button primary">Join Waitlist</button>
                        `;
                    }, 500);
                }, 3000);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error message
            waitlistForm.innerHTML += '<p class="error-message">Something went wrong. Please try again.</p>';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Join Waitlist';
                waitlistForm.querySelector('.error-message')?.remove();
            }, 3000);
        }
    });
});