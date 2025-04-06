// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9fnAtDYVOGTS88Qw_48xb-wwa-ZtzaPM",
    authDomain: "muse-garden.firebaseapp.com",
    projectId: "muse-garden",
    storageBucket: "muse-garden.firebasestorage.app",
    messagingSenderId: "114577937475",
    appId: "1:114577937475:web:0557ce15c9f14d639eb0f6",
    measurementId: "G-HFZY2QKDPK"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize services
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // Authentication state observer
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      console.log('User signed in:', user.email);
      document.body.classList.add('user-signed-in');
      document.body.classList.remove('user-signed-out');
      
      // Update UI with user info
      const userDisplayElements = document.querySelectorAll('.user-display');
      userDisplayElements.forEach(el => {
        el.textContent = user.displayName || user.email;
      });
      
      // Load user's data
      loadUserData(user.uid);
    } else {
      // User is signed out
      console.log('User signed out');
      document.body.classList.add('user-signed-out');
      document.body.classList.remove('user-signed-in');
    }
  });
  
  // Load user's data
  function loadUserData(userId) {
    // Load ideas from Firestore
    db.collection('users').doc(userId).collection('ideas')
      .orderBy('timestamp', 'desc')
      .get()
      .then(snapshot => {
        // Convert Firestore data to our idea format
        const ideas = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          ideas.push({
            id: doc.id,
            content: data.content,
            date: data.date,
            hasAnalysis: data.hasAnalysis,
            analysis: data.analysis,
            category: data.category,
            tags: data.tags,
            searchText: data.searchText,
            timestamp: data.timestamp.toDate()
          });
        });
        
        // Save to localStorage as backup and for offline use
        localStorage.setItem('muse-garden-ideas', JSON.stringify(ideas));
        
        // Update UI
        if (typeof loadSavedIdeas === 'function') {
          loadSavedIdeas();
        }
      })
      .catch(error => {
        console.error('Error loading ideas:', error);
      });
  }
  
  // Save idea to Firestore
  function saveIdeaToFirestore(idea) {
    const user = auth.currentUser;
    if (!user) return Promise.reject('User not signed in');
    
    // Add timestamp for sorting
    const ideaWithTimestamp = {
      ...idea,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Save to Firestore
    return db.collection('users').doc(user.uid).collection('ideas')
      .add(ideaWithTimestamp)
      .then(docRef => {
        console.log('Idea saved to Firestore with ID:', docRef.id);
        return docRef.id;
      });
  }
  
  // Delete idea from Firestore
  function deleteIdeaFromFirestore(ideaId) {
    const user = auth.currentUser;
    if (!user) return Promise.reject('User not signed in');
    
    return db.collection('users').doc(user.uid).collection('ideas')
      .doc(ideaId)
      .delete()
      .then(() => {
        console.log('Idea deleted from Firestore');
      });
  }
  
  // Save user preferences
  function saveUserPreferences(preferences) {
    const user = auth.currentUser;
    if (!user) return Promise.reject('User not signed in');
    
    return db.collection('users').doc(user.uid).set({
      preferences: preferences
    }, { merge: true });
  }
  
  // Get user subscription status
  function getUserSubscription() {
    const user = auth.currentUser;
    if (!user) return Promise.reject('User not signed in');
    
    return db.collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          return data.subscription || { type: 'free' };
        } else {
          return { type: 'free' };
        }
      });
  }