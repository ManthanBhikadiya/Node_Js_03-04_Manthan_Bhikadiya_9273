const API = 'http://localhost:5000/api/blogs';
const AUTH_API = 'http://localhost:5000/api/auth';
let blogsMap = {};
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        currentUser = JSON.parse(user);
        showMainApp();
    }
});

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('auth-modal-title').textContent = 'Login';
}

function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('auth-modal-title').textContent = 'Sign Up';
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showToast('Please fill in all fields!', true);
        return;
    }

    try {
        const res = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showMainApp();
            showToast('Login successful!');
        } else {
            showToast(data.message || 'Login failed!', true);
        }
    } catch (error) {
        showToast('Login failed!', true);
    }
}

async function signup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        showToast('Please fill in all fields!', true);
        return;
    }

    try {
        const res = await fetch(`${AUTH_API}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showMainApp();
            showToast('Signup successful!');
        } else {
            showToast(data.message || 'Signup failed!', true);
        }
    } catch (error) {
        showToast('Signup failed!', true);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    showLogin();
}

function showMainApp() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('user-name').textContent = currentUser.name;
    fetchBlogs();
}

async function fetchBlogs() {
    const res = await fetch(API);
    const blogs = await res.json();
    renderBlogs(blogs);
}

function renderBlogs(blogs) {
    blogsMap = {};
    const list = document.getElementById('blogs-list');
    const empty = document.getElementById('empty-msg');
    list.innerHTML = '';
    if (!blogs.length) {
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');
    blogs.forEach(b => {
        blogsMap[b._id] = b;
        const date = new Date(b.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

        const isOwner = currentUser && b.createdBy === currentUser._id;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow hover:shadow-md transition p-5 flex flex-col gap-3';

        let buttonsHtml = '';
        if (isOwner) {
            buttonsHtml = `
                <div class="flex gap-2 pt-2 border-t border-gray-100">
                  <button class="btn-edit flex-1 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-lg cursor-pointer transition" data-id="${b._id}"> Edit</button>
                  <button class="btn-delete flex-1 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg cursor-pointer transition" data-id="${b._id}"> Delete</button>
                </div>
            `;
        }

        card.innerHTML = `
        <h2 class="text-lg font-bold text-gray-800 leading-snug">${escHtml(b.title)}</h2>
        <div class="text-xs text-gray-500">By <strong class="text-indigo-600">${escHtml(b.author)}</strong> &bull; ${date}</div>
        <p class="text-sm text-gray-600 flex-1 line-clamp-3">${escHtml(b.description)}</p>
        ${buttonsHtml}
      `;
        list.appendChild(card);
    });

    list.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const b = blogsMap[btn.dataset.id];
            openModal(b._id, b.title, b.author, b.description);
        });
    });
    list.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteBlog(btn.dataset.id));
    });
}

function openModal(id = '', title = '', author = '', desc = '') {
    document.getElementById('blog-id').value = id;
    document.getElementById('blog-title').value = title;
    document.getElementById('blog-author').value = author;
    document.getElementById('blog-desc').value = desc;
    document.getElementById('modal-title').textContent = id ? 'Edit Blog' : 'Create Blog';
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

async function saveBlog() {
    const id = document.getElementById('blog-id').value;
    const title = document.getElementById('blog-title').value.trim();
    const author = document.getElementById('blog-author').value.trim();
    const description = document.getElementById('blog-desc').value.trim();
    if (!title || !author || !description) { showToast('All fields are required!', true); return; }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API}/${id}` : `${API}/create`;

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, author, description })
    });
    if (res.ok) {
        closeModal();
        fetchBlogs();
        showToast(id ? 'Blog updated!' : 'Blog created!');
    } else {
        const data = await res.json();
        showToast(data.message || 'Something went wrong.', true);
    }
}

async function deleteBlog(id) {
    if (!confirm('Delete this blog?')) return;
    const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) { fetchBlogs(); showToast('Blog deleted!'); }
    else {
        const data = await res.json();
        showToast(data.message || 'Delete failed.', true);
    }
}

function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg z-50 transition-all duration-300 ${isError ? 'bg-red-500' : 'bg-green-500'} opacity-100 pointer-events-auto`;
    setTimeout(() => {
        t.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all duration-300 opacity-0 pointer-events-none z-50';
    }, 2800);
}

function escHtml(str) {
    return String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});
