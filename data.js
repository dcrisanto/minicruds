
const observer =()=>{
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('User is signed in.');
            console.log(user);
            login.classList.add("hiden");
            bd.classList.remove("hiden");
            posts.classList.remove("hiden");
            logout.classList.remove("hiden");
            username.innerHTML = `Bienvenida ${user.displayName}`;
        } else {
            console.log('No user is signed in.');
            login.classList.remove("hiden");
            logout.classList.add("hiden");
            posts.classList.add("hiden");
            bd.classList.add("hiden")
        }
    });
}   

const  writeUserData = (userId, name, email, imageUrl) =>{
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}
const writeNewPost = (uid, body)=> {
    // A post entry.
    var postData = {
        uid: uid,
        body: body,
    };
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    firebase.database().ref().update(updates);
    return newPostKey;
}


const register = () => {
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(() => {
            console.log('Usuario Creado');
        })
        .catch(function (error) {
            console.log(error.code, ' : ', error.message);
        });
}



const startSession = () => {
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
            console.log('Verificado')
        })
        .catch(function (error) {
            console.log('Contraseña Incorrecta')
        });
}

const logOut = () => {
    firebase.auth().signOut().then(function () {
        console.log('Cerro Sesión');
    }).catch(function (error) {
        console.log('Error al cerrar Sesión');
    });
}

const facebook = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
        .then(function (result) { console.log('Logueado con Fb') })
        .catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            console.log(error.email);
            console.log(error.credential);
        });
}

const google = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log('Login Google');
            var user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            console.log(error.email);
            console.log(error.credential);
        });
}

/******************************************************************************************************************** */

// function reload_page() {
//   window.location.reload();
// }
/************************************************************** */
