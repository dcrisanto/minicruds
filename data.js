const btnUpdate = document.getElementById('update');
const btnDelete = document.getElementById('delete');
window.onload = () => {
    firebase.auth().onAuthStateChanged((user) =>{
        if (user) {
            console.log('User is signed in.');
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
function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}
function writeNewPost(uid, body) {
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

btnSave.addEventListener('click', () => {
    var userId = firebase.auth().currentUser.uid;
    const newPost = writeNewPost(userId, post.value);
    posts.innerHTML += `
    <div>
        <textarea id="${newPost}">${post.value}</textarea>
        <button id ="update" type="button">Update</button>
        <button id="delete" type="button">Delete</button>
    </div>`
})
btnDelete.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
    firebase.database().ref().child('posts/' + newPost).remove();
    while (posts.firstChild) posts.removeChild(posts.firstChild);
    console.log('El usuario esta eliminando  successfully!');
    // reload_page();
});

btnUpdate.addEventListener('click', () => {
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
        body: newUpdate.value,
    };
    var updatesUser = {};
    var updatesPost = {};
    updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
    updatesPost['/posts/' + newPost] = nuevoPost;
    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);
});