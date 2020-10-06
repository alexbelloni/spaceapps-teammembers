var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

const FirebaseAccess = () => {
    var config = {
        apiKey: process.env.REACT_APP_firebase_apiKey,
        authDomain: process.env.REACT_APP_firebase_authDomain,
        databaseURL: process.env.REACT_APP_firebase_databaseURL,
        storageBucket: process.env.REACT_APP_firebase_storageBucket,
    };

    let initialized = false;
    function getFirebase(){
        if(!initialized){
            firebase.initializeApp(config);
            initialized = true;
        }
        return firebase;
    }    

    function getTeams() {
        return new Promise((resolve, reject) => {
            getFirebase().database().ref('/').once('value').then(function (snapshot) {
                try {
                    resolve(snapshot.val().filter(t => {
                        return t && t.lookingForMembers
                    }))
                } catch (e) {
                    reject(e)
                }
            });
        })
    }

    function _updatePositions(teamName, positions) {
        const arr = []
        getFirebase().database().ref('/').once('value').then(function (snapshot) {
            const ar = snapshot.val();
            const keys = (Object.keys(ar))

            let y = 0
            ar.forEach(e => {
                if (e) {
                    arr.push({ id: keys[y++], ...e })
                }
            });

            //Search for teamName
            const team = arr.find(x => x.teamName.indexOf(teamName) > -1)
            console.log("found ", team ? team.teamName : "NO")
            if (team) {
                var updates = {};
                updates[`/${team.id}`] = { ...team, positions: positions.toLowerCase() };
                getFirebase().database().ref().update(updates, (e) => console.log(e || "success"));
            }
        });
    }

    function updatePositions(teamName, positions) {
        getFirebase().auth().signOut();
        var provider = new getFirebase().auth.GoogleAuthProvider();
        getFirebase().auth().signInWithPopup(provider).then(function (result) {
            _updatePositions(teamName, positions);
        }).catch(function (error) {
            console.log(error);
        });
    }

    function _addTeam({ location, lookingForMembers, teamName, updated, url }) {
        getFirebase().database().ref('/').child("226").set({
            location, lookingForMembers, teamName, updated, url
        });
    }

    function addTeam({ location, lookingForMembers, teamName, updated, url }) {
        getFirebase().auth().signOut();
        var provider = new getFirebase().auth.GoogleAuthProvider();
        getFirebase().auth().signInWithPopup(provider).then(function (result) {
            _addTeam({ location, lookingForMembers, teamName, updated, url });
        }).catch(function (error) {
            console.log(error);
        });
    }

    return {
        getTeams,
        addTeam,
        updatePositions,
    }
}

export default FirebaseAccess()