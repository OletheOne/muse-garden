// Authentication Module
class AuthManager {
    constructor() {
      this.auth = firebase.auth();
      this.initUI();
      this.setupEventListeners();
    }
    
    initUI() {
      // Create auth modals if they don't exist
      this.createAuthModals();
      
      // Update UI based on auth state
      this.auth.onAuthStateChanged(user => {
        this.updateAuthUI(user);
      });
    }
    
    createAuthModals() {
      // Login modal
      if (!document.getElementById('login-modal')) {
        const loginModal = document.createElement('div');
        loginModal.id = 'login-modal';
        loginModal.className = 'modal hidden';
        loginModal.innerHTML = `
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Sign In</h2>
            <form id="login-form">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" required>
              </div>
              <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" required>
              </div>
              <div class="form-error hidden"></div>
              <button type="submit" class="btn primary">Sign In</button>
            </form>
            <div class="auth-links">
              <a href="#" id="forgot-password-link">Forgot password?</a>
              <a href="#" id="signup-link">Need an account? Sign up</a>
            </div>
          </div>
        `;
        document.body.appendChild(loginModal);
      }
      
      // Signup modal
      if (!document.getElementById('signup-modal')) {
        const signupModal = document.createElement('div');
        signupModal.id = 'signup-modal';
        signupModal.className = 'modal hidden';
        signupModal.innerHTML = `
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Create Account</h2>
            <form id="signup-form">
              <div class="form-group">
                <label for="signup-name">Name</label>
                <input type="text" id="signup-name" required>
              </div>
              <div class="form-group">
                <label for="signup-email">Email</label>
                <input type="email" id="signup-email" required>
              </div>
              <div class="form-group">
                <label for="signup-password">Password</label>
                <input type="password" id="signup-password" required minlength="6">
                <small>Password must be at least 6 characters</small>
              </div>
              <div class="form-error hidden"></div>
              <button type="submit" class="btn primary">Create Account</button>
            </form>
            <div class="auth-links">
              <a href="#" id="login-link">Already have an account? Sign in</a>
            </div>
          </div>
        `;
        document.body.appendChild(signupModal);
      }
      
      // Reset password modal
      if (!document.getElementById('reset-password-modal')) {
        const resetModal = document.createElement('div');
        resetModal.id = 'reset-password-modal';
        resetModal.className = 'modal hidden';
        resetModal.innerHTML = `
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Reset Password</h2>
            <form id="reset-password-form">
              <div class="form-group">
                <label for="reset-email">Email</label>
                <input type="email" id="reset-email" required>
              </div>
              <div class="form-message hidden"></div>
              <button type="submit" class="btn primary">Send Reset Link</button>
            </form>
            <div class="auth-links">
              <a href="#" id="back-to-login-link">Back to sign in</a>
            </div>
          </div>
        `;
        document.body.appendChild(resetModal);
      }
    }
    
    setupEventListeners() {
      // Sign in form submission
      document.getElementById('login-form')?.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.querySelector('#login-form .form-error');
        
        this.auth.signInWithEmailAndPassword(email, password)
          .then(() => {
            // Close modal on success
            document.getElementById('login-modal').classList.add('hidden');
          })
          .catch(error => {
            // Display error message
            errorElement.textContent = error.message;
            errorElement.classList.remove('hidden');
          });
      });
      
      // Sign up form submission
      document.getElementById('signup-form')?.addEventListener('submit', e => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorElement = document.querySelector('#signup-form .form-error');
        
        this.auth.createUserWithEmailAndPassword(email, password)
          .then(userCredential => {
            // Update user profile
            return userCredential.user.updateProfile({
              displayName: name
            });
          })
          .then(() => {
            // Close modal on success
            document.getElementById('signup-modal').classList.add('hidden');
            
            // Initialize user document in Firestore
            const user = this.auth.currentUser;
            return firebase.firestore().collection('users').doc(user.uid).set({
              name: name,
              email: email,
              subscription: { type: 'free' },
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          })
          .catch(error => {
            // Display error message
            errorElement.textContent = error.message;
            errorElement.classList.remove('hidden');
          });
      });
      
      // Reset password form submission
      document.getElementById('reset-password-form')?.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = document.getElementById('reset-email').value;
        const messageElement = document.querySelector('#reset-password-form .form-message');
        
        this.auth.sendPasswordResetEmail(email)
          .then(() => {
            // Show success message
            messageElement.textContent = 'Password reset email sent. Check your inbox.';
            messageElement.className = 'form-message success';
            messageElement.classList.remove('hidden');
          })
          .catch(error => {
            // Display error message
            messageElement.textContent = error.message;
            messageElement.className = 'form-message error';
            messageElement.classList.remove('hidden');
          });
      });
      
      // Modal navigation links
      document.getElementById('signup-link')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('signup-modal').classList.remove('hidden');
      });
      
      document.getElementById('login-link')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('signup-modal').classList.add('hidden');
        document.getElementById('login-modal').classList.remove('hidden');
      });
      
      document.getElementById('forgot-password-link')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('reset-password-modal').classList.remove('hidden');
      });
      
      document.getElementById('back-to-login-link')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('reset-password-modal').classList.add('hidden');
        document.getElementById('login-modal').classList.remove('hidden');
      });
      
      // Close modals
      document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
          document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
          });
        });
      });
      
      // Global click handler for auth actions
      document.addEventListener('click', e => {
        // Sign in button clicked
        if (e.target.matches('.sign-in-btn')) {
          e.preventDefault();
          document.getElementById('login-modal').classList.remove('hidden');
        }
        
        // Sign up button clicked
        if (e.target.matches('.sign-up-btn')) {
          e.preventDefault();
          document.getElementById('signup-modal').classList.remove('hidden');
        }
        
        // Sign out button clicked
        if (e.target.matches('.sign-out-btn')) {
          e.preventDefault();
          this.auth.signOut();
        }
      });
    }
    
    updateAuthUI(user) {
      const authButtons = document.querySelector('.auth-buttons');
      
      if (!authButtons) {
        // Create auth buttons container if it doesn't exist
        this.createAuthButtons();
      }
      
      if (user) {
        // User is signed in
        document.querySelectorAll('.auth-buttons').forEach(container => {
          container.innerHTML = `
            <div class="user-info">
              <span class="user-display">${user.displayName || user.email}</span>
              <button class="sign-out-btn">Sign Out</button>
            </div>
          `;
        });
        
        // Update page elements that should only be visible to signed-in users
        document.querySelectorAll('.auth-required').forEach(el => {
          el.classList.remove('hidden');
        });
        
        // Update page elements that should only be visible to signed-out users
        document.querySelectorAll('.auth-not-required').forEach(el => {
          el.classList.add('hidden');
        });
      } else {
        // User is signed out
        document.querySelectorAll('.auth-buttons').forEach(container => {
          container.innerHTML = `
            <button class="sign-in-btn">Sign In</button>
            <button class="sign-up-btn btn primary">Sign Up</button>
          `;
        });
        
        // Update page elements that should only be visible to signed-in users
        document.querySelectorAll('.auth-required').forEach(el => {
          el.classList.add('hidden');
        });
        
        // Update page elements that should only be visible to signed-out users
        document.querySelectorAll('.auth-not-required').forEach(el => {
          el.classList.remove('hidden');
        });
      }
    }
    
    createAuthButtons() {
      // Add auth buttons to header in each HTML file
      const headerElements = document.querySelectorAll('header');
      
      headerElements.forEach(header => {
        // Check if auth buttons already exist
        if (!header.querySelector('.auth-buttons')) {
          const authButtons = document.createElement('div');
          authButtons.className = 'auth-buttons';
          
          // Insert after the first child (usually the heading)
          if (header.firstChild) {
            header.insertBefore(authButtons, header.firstChild.nextSibling);
          } else {
            header.appendChild(authButtons);
          }
        }
      });
    }
    
    getCurrentUser() {
      return this.auth.currentUser;
    }
    
    isUserSignedIn() {
      return !!this.auth.currentUser;
    }
  }
  
  // Initialize auth manager
  document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
  });