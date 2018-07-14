const login = document.getElementById('login');
const logout = document.getElementById('logout');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnRegister = document.getElementById('btnRegister')
const btnLogin = document.getElementById('btnLogin')
const btnLogout = document.getElementById('btnLogout')
const btnFacebook = document.getElementById('btnFacebook');
const btnGoogle = document.getElementById('btnGoogle');
const bd = document.getElementById('bd');
const btnSave = document.getElementById('btnSave');
const post = document.getElementById('post');
const posts = document.getElementById('posts');


window.onload = () => {
  observer();
}

btnRegister.addEventListener('click', () => {
  register();
})
btnLogin.addEventListener('click', () => {
  startSession();
})
btnLogout.addEventListener('click', () => {
  logOut();
});
btnFacebook.addEventListener('click', () => {
  facebook();
});
btnGoogle.addEventListener('click', () => {
  google();
}); 

btnSave.addEventListener('click', () => {
  var userId = firebase.auth().currentUser.uid;
  const newPost = writeNewPost(userId, post.value);
  posts.innerHTML += `
    <div>
        <textarea id="${newPost}">${post.value}</textarea>
        <button id ="update" type="button">Update</button>
        <button id="delete" type="button">Delete</button>
    </div>`
  const btnUpdate = document.getElementById('update');
  const btnDelete = document.getElementById('delete');
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
});
