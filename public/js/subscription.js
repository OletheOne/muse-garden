// Subscription Management Module
class SubscriptionManager {
    constructor() {
      this.db = firebase.firestore();
      this.initSubscriptionUI();
    }
    
    initSubscriptionUI() {
      // Create subscription modal
      this.createSubscriptionModal();
      
      // Add event listeners
      document.addEventListener('click', e => {
        // Upgrade button clicked
        if (e.target.matches('.upgrade-btn')) {
          e.preventDefault();
          this.showSubscriptionModal();
        }
        
        // Subscribe button clicked
        if (e.target.matches('.subscribe-btn')) {
          e.preventDefault();
          const planId = e.target.getAttribute('data-plan');
          this.handleSubscription(planId);
        }
      });
      
      // Check current subscription and update UI
      this.updateSubscriptionUI();
    }
    
    createSubscriptionModal() {
      if (!document.getElementById('subscription-modal')) {
        const subscriptionModal = document.createElement('div');
        subscriptionModal.id = 'subscription-modal';
        subscriptionModal.className = 'modal hidden';
        subscriptionModal.innerHTML = `
          <div class="modal-content subscription-content">
            <span class="close-modal">&times;</span>
            <h2>Upgrade Your Muse Garden</h2>
            <p>Choose the plan that works best for you</p>
            
            <div class="subscription-plans">
              <div class="plan-card">
                <h3>Free</h3>
                <p class="plan-price">$0/month</p>
                <ul class="plan-features">
                  <li>Generate up to 10 ideas per day</li>
                  <li>Basic idea analysis</li>
                  <li>Save ideas locally</li>
                </ul>
                <button class="btn secondary subscribe-btn" data-plan="free">Current Plan</button>
              </div>
              
              <div class="plan-card featured">
                <div class="badge">Popular</div>
                <h3>Pro</h3>
                <p class="plan-price">$9.99/month</p>
                <ul class="plan-features">
                  <li>Unlimited idea generation</li>
                  <li>Advanced idea analysis</li>
                  <li>Cloud storage for ideas</li>
                  <li>Export in all formats</li>
                  <li>Priority support</li>
                </ul>
                <button class="btn primary subscribe-btn" data-plan="pro">Upgrade to Pro</button>
              </div>
              
              <div class="plan-card">
                <h3>Business</h3>
                <p class="plan-price">$29.99/month</p>
                <ul class="plan-features">
                  <li>Everything in Pro</li>
                  <li>Team collaboration</li>
                  <li>Idea versioning</li>
                  <li>Advanced export options</li>
                  <li>Custom branding</li>
                </ul>
                <button class="btn primary subscribe-btn" data-plan="business">Upgrade to Business</button>
              </div>
            </div>
            
            <div class="subscription-footer">
              <p>All plans include a 7-day free trial. Cancel anytime.</p>
            </div>
          </div>
        `;
        document.body.appendChild(subscriptionModal);
        
        // Add close button event listener
        subscriptionModal.querySelector('.close-modal').addEventListener('click', () => {
          subscriptionModal.classList.add('hidden');
        });
      }
    }
    
    showSubscriptionModal() {
      const modal = document.getElementById('subscription-modal');
      if (modal) {
        modal.classList.remove('hidden');
        
        // Update button states based on current subscription
        this.getUserSubscription().then(subscription => {
          const currentPlan = subscription.type || 'free';
          
          // Update all buttons
          modal.querySelectorAll('.subscribe-btn').forEach(button => {
            const planId = button.getAttribute('data-plan');
            
            if (planId === currentPlan) {
              button.textContent = 'Current Plan';
              button.classList.remove('primary');
              button.classList.add('secondary');
              button.disabled = true;
            } else {
              button.textContent = `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`;
              button.classList.remove('secondary');
              button.classList.add('primary');
              button.disabled = false;
            }
          });
        });
      }
    }
    
    handleSubscription(planId) {
      const user = firebase.auth().currentUser;
      if (!user) {
        // Show sign-in modal if user is not logged in
        document.getElementById('login-modal').classList.remove('hidden');
        document.getElementById('subscription-modal').classList.add('hidden');
        return;
      }
      
      // For now, simulate successful subscription
      // In a real app, this would integrate with a payment processor like Stripe
      this.db.collection('users').doc(user.uid).update({
        subscription: {
          type: planId,
          startDate: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'active'
        }
      })
      .then(() => {
        // Show success message
        alert(`Successfully upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`);
        document.getElementById('subscription-modal').classList.add('hidden');
        
        // Update UI to reflect new subscription
        this.updateSubscriptionUI();
      })
      .catch(error => {
        console.error('Error updating subscription:', error);
        alert('There was an error processing your subscription. Please try again.');
      });
    }
    
    getUserSubscription() {
      const user = firebase.auth().currentUser;
      if (!user) return Promise.resolve({ type: 'free' });
      
      return this.db.collection('users').doc(user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            return data.subscription || { type: 'free' };
          } else {
            return { type: 'free' };
          }
        })
        .catch(error => {
          console.error('Error getting subscription:', error);
          return { type: 'free' };
        });
    }
    
    updateSubscriptionUI() {
      const user = firebase.auth().currentUser;
      if (!user) return;
      
      this.getUserSubscription().then(subscription => {
        const subscriptionType = subscription.type || 'free';
        
        // Update subscription badge
        let badgeHTML = '';
        if (subscriptionType === 'pro') {
          badgeHTML = '<span class="subscription-badge pro">Pro</span>';
        } else if (subscriptionType === 'business') {
          badgeHTML = '<span class="subscription-badge business">Business</span>';
        }
        
        document.querySelectorAll('.user-info').forEach(userInfo => {
          // Check if badge already exists
          const existingBadge = userInfo.querySelector('.subscription-badge');
          if (existingBadge) {
            existingBadge.remove();
          }
          
          // Add badge if user has premium subscription
          if (badgeHTML && subscriptionType !== 'free') {
            userInfo.querySelector('.user-display').insertAdjacentHTML('afterend', badgeHTML);
          }
        });
        
        // Update feature access based on subscription
        document.body.classList.remove('sub-free', 'sub-pro', 'sub-business');
        document.body.classList.add(`sub-${subscriptionType}`);
        
        // Hide/show premium features
        this.updateFeatureAccess(subscriptionType);
      });
    }
    
    updateFeatureAccess(subscriptionType) {
      // Show/hide features based on subscription
      document.querySelectorAll('[data-subscription]').forEach(element => {
        const requiredSubscription = element.getAttribute('data-subscription');
        
        if (this.hasAccess(subscriptionType, requiredSubscription)) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
      });
    }
    
    hasAccess(userSubscription, requiredSubscription) {
      // Define subscription hierarchy
      const subscriptionLevels = {
        'free': 0,
        'pro': 1,
        'business': 2
      };
      
      // Compare levels
      return subscriptionLevels[userSubscription] >= subscriptionLevels[requiredSubscription];
    }
  }
  
  // Initialize subscription manager
  document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is initialized
    if (typeof firebase !== 'undefined') {
      window.subscriptionManager = new SubscriptionManager();
    } else {
      // Try again after firebase is loaded
      window.addEventListener('firebase-ready', () => {
        window.subscriptionManager = new SubscriptionManager();
      });
    }
  });