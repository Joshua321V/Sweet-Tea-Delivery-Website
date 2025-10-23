const container = document.querySelector('.container');
const LoginLink = document.querySelector('.SignInLink');
const RegisterLink = document.querySelector('.SignUpLink');
const closeModal = document.getElementById("closeModal");
const authModal = document.getElementById("authModal");

// --- Dummy user accounts ---
const users = [
    { username: "Josh", email: "josh@example.com", password: "1234" },
    { username: "Anna", email: "anna@example.com", password: "abcd" }
];

// Handle Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
        alert("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        authModal.style.display = "none";
        window.location.href = "index.html";
    } else {
        alert("Invalid username or password.");
    }
});

// Handle Register
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const newUser = { username, email, password };
    users.push(newUser);

    alert("Registration successful! Please log in.");
    container.classList.remove('active');
});

// Switch to register form
RegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add('active');
});

// witch to login form
LoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove('active');
});

// Close modal (via button)
closeModal.onclick = () => {
    authModal.style.display = "none";
    window.location.href = "index.html"; 
};

// Close modal (click outside)
window.onclick = (event) => {
    if (event.target === authModal) {
        authModal.style.display = "none";
        window.location.href = "index.html";
    }
};
