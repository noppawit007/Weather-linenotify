import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyC-uG628wZlufA1CjJ0betXF7WDiJG-G6o",
  authDomain: "weathernoti-33bdc.firebaseapp.com",
  databaseURL: 'https://weathernoti-33bdc-default-rtdb.firebaseio.com',
  projectId: 'weathernoti-33bdc',
  storageBucket: 'weathernoti-33bdc.appspot.com',
  messagingSenderId: '590479012159'
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  getUserConfig = uid => {
    return new Promise((resolve, reject) => {
      this.db
        .collection('weatherConfig')
        .doc(`${uid}`)
        .get()
        .then(doc => {
          if (doc.exists) {
            return resolve(doc.data());
          } else {
            return reject(null);
          }
        })
        .catch(err => reject(err));
    });
  };

  saveUserConfig = (uid, config) => {
    this.db
      .collection('weatherConfig')
      .doc(`${uid}`)
      .set(config)
      .then(() => 'Success')
      .catch(err => err);
  };

  deleteUserConfig = uid => {
    return new Promise((resolve, reject) => {
      this.db
        .collection('weatherConfig')
        .doc(`${uid}`)
        .delete()
        .then(() => resolve('Success'))
        .catch(err => reject(err));
    });
  };
}

export default Firebase;
