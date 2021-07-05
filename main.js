// Initialize Firebase

var firebaseConfig = {
  apiKey: "AIzaSyArFVB4orI1tIg2T1JNNoCcZkFVjAZWgJ8",
  authDomain: "khmer-auction-d8bf5.firebaseapp.com",
  databaseURL: "https://khmer-auction-d8bf5-default-rtdb.firebaseio.com",
  projectId: "khmer-auction-d8bf5",
  storageBucket: "khmer-auction-d8bf5.appspot.com",
  messagingSenderId: "815601442430",
  appId: "1:815601442430:web:9d2c0dbc9c88c0ff2f822f",
  measurementId: "G-TS0384Q8P7"
};


firebase.initializeApp(firebaseConfig);

document.getElementById('login-form').onsubmit = function(event) {
  event.preventDefault();
  let email = document.getElementById('email').value;
  let pass = document.getElementById('password').value;
  login(email, pass);
};


document.getElementById('get-token').onclick = function(event) {
  event.preventDefault();
  firebase.auth().currentUser.getIdToken(true).then(token => document.getElementById('id-token').innerHTML = token);
  
};

function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user) {
      console.log('login success');
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
    });

  let callback = null;
  let metadataRef = null;
  firebase.auth().onAuthStateChanged(user => {
    // Remove previous listener.
    if (callback) {
      metadataRef.off('value', callback);
    }
    // On user login add new listener.
    if (user) {
      // Check if refresh is required.
      metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
      callback = (snapshot) => {
        // Force refresh to pick up the latest custom claims changes.
        // Note this is always triggered on first call. Further optimization could be
        // added to avoid the initial trigger when the token is issued and already contains
        // the latest claims.
        user.getIdToken(true);
      };
      // Subscribe new listener to changes on that node.
      metadataRef.on('value', callback);
    }
  });
}
