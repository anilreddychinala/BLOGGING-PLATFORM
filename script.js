// script.js
document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('homePage');
    const registerPage = document.getElementById('registerPage');
    const loginPage = document.getElementById('loginPage');
    const createPostPage = document.getElementById('createPostPage');
    const profilePage = document.getElementById('profilePage');
    const postDetailsPage = document.getElementById('postDetailsPage');
  
    const homeLink = document.getElementById('homeLink');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const createPostLink = document.getElementById('createPostLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
  
    const blogPostsContainer = document.getElementById('blogPosts');
    const userPostsContainer = document.getElementById('userPosts');
    const commentsSection = document.getElementById('commentsSection');
  
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const postForm = document.getElementById('postForm');
    const commentForm = document.getElementById('commentForm');
  
    let currentUser = null;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Navigation
    homeLink.addEventListener('click', () => showPage(homePage));
    registerLink.addEventListener('click', () => showPage(registerPage));
    loginLink.addEventListener('click', () => showPage(loginPage));
    createPostLink.addEventListener('click', () => showPage(createPostPage));
    profileLink.addEventListener('click', () => {
      showPage(profilePage);
      loadUserPosts();
    });
    logoutLink.addEventListener('click', logout);
  
    // Forms
    registerForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);
    postForm.addEventListener('submit', savePost);
    commentForm.addEventListener('submit', addComment);
  
    // Show homepage by default
    showPage(homePage);
    loadPosts();
  
    function showPage(page) {
      homePage.style.display = 'none';
      registerPage.style.display = 'none';
      loginPage.style.display = 'none';
      createPostPage.style.display = 'none';
      profilePage.style.display = 'none';
      postDetailsPage.style.display = 'none';
      page.style.display = 'block';
    }
  
    function updateNav() {
      if (currentUser) {
        registerLink.style.display = 'none';
        loginLink.style.display = 'none';
        createPostLink.style.display = 'inline';
        profileLink.style.display = 'inline';
        logoutLink.style.display = 'inline';
      } else {
        registerLink.style.display = 'inline';
        loginLink.style.display = 'inline';
        createPostLink.style.display = 'none';
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';
      }
    }
  
    function registerUser(e) {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;
  
      if (users.some(user => user.username === username)) {
        alert('Username already exists.');
        return;
      }
  
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful. Please login.');
      showPage(loginPage);
    }
  
    function loginUser(e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
  
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        currentUser = username;
        updateNav();
        showPage(homePage);
        loadPosts();
      } else {
        alert('Invalid username or password.');
      }
    }
  
    function logout() {
      currentUser = null;
      updateNav();
      showPage(homePage);
    }
  
    function savePost(e) {
      e.preventDefault();
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
  
      const post = {
        id: Date.now(),
        title,
        content,
        author: currentUser,
        comments: []
      };
  
      posts.push(post);
      localStorage.setItem('posts', JSON.stringify(posts));
      alert('Post created successfully.');
      showPage(homePage);
      loadPosts();
    }
  
    function loadPosts() {
      blogPostsContainer.innerHTML = '';
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><em>By ${post.author}</em></p>
          <button onclick="viewPost(${post.id})">View Post</button>
        `;
        blogPostsContainer.appendChild(postElement);
      });
    }
  
    function loadUserPosts() {
      userPostsContainer.innerHTML = '';
      const userPosts = posts.filter(post => post.author === currentUser);
      userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <button onclick="editPost(${post.id})">Edit</button>
          <button onclick="deletePost(${post.id})">Delete</button>
        `;
        userPostsContainer.appendChild(postElement);
      });
    }
  
    function viewPost(postId) {
      const post = posts.find(post => post.id === postId);
      if (post) {
        document.getElementById('postDetailsTitle').textContent = post.title;
        document.getElementById('postDetailsContent').textContent = post.content;
        commentsSection.innerHTML = '';
        post.comments.forEach(comment => {
          const commentElement = document.createElement('div');
          commentElement.className = 'comment';
          commentElement.textContent = comment;
          commentsSection.appendChild(commentElement);
        });
        showPage(postDetailsPage);
      }
    }
  
    function addComment(e) {
      e.preventDefault();
      const commentContent = document.getElementById('commentContent').value;
      const postId = posts.find(post => post.title === document.getElementById('postDetailsTitle').textContent).id;
      const post = posts.find(post => post.id === postId);
      post.comments.push(commentContent);
      localStorage.setItem('posts', JSON.stringify(posts));
      viewPost(postId);
      document.getElementById('commentContent').value = '';
    }
  
    function editPost(postId) {
      const post = posts.find(post => post.id === postId);
      if (post) {
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
        showPage(createPostPage);
        postForm.onsubmit = function(e) {
          e.preventDefault();
          post.title = document.getElementById('postTitle').value;
          post.content = document.getElementById('postContent').value;
          localStorage.setItem('posts', JSON.stringify(posts));
          alert('Post updated successfully.');
          showPage(profilePage);
          loadUserPosts();
        };
      }
    }
  
    function deletePost(postId) {
      posts = posts.filter(post => post.id !== postId);
      localStorage.setItem('posts', JSON.stringify(posts));
      alert('Post deleted successfully.');
      loadUserPosts();
    }
  
    window.viewPost = viewPost;
    window.editPost = editPost;
    window.deletePost = deletePost;
  });