import React, { useContext } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const handleGoogleSignIn = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app();
        }
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                const { displayName, email } = result.user;
                const signedInUser = { name: displayName, email }
                setLoggedInUser(signedInUser);
                storeAuthToken();
            }).catch((error) => {
                var errorMessage = error.message;
                console.log(errorMessage);
            });

        const storeAuthToken = () => {
            firebase.auth().currentUser.getIdToken(true)
                .then(function (idToken) {
                    sessionStorage.setItem('token', idToken);
                    history.replace(from);
                }).catch(function (error) {
                });
        }
    }
    return (
        <div className="App">
            <h1>Sign in with google</h1>
            <button onClick={handleGoogleSignIn}>Sign In Google</button>
        </div>
    );
};

export default Login;