const APILINK = 'https://moviev3-backend.onrender.com/api/v1/reviews/';
const BACKEND = 'https://moviev3-backend.onrender.com/api/v1/movies';
// const APILINK = 'http://localhost:8000/api/v1/reviews/';
// const BACKEND = 'http://localhost:8000/api/v1/movies';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];
const sorts = [
    { value: 'revenue.desc', name: 'Revenue' },
    { value: 'popularity.desc', name: 'Popularity' },
    { value: 'vote_average.desc', name: 'Rating' }
];

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');
const loadMoreBtn = document.getElementById('loadMore');
const genreContainer = document.querySelector('.genre');
const sortContainer = document.querySelector('.sort-options');

let currentPage = 1;
let currentType = 'discover';
let currentGenre = '';
let currentSearch = '';
let currentSort = 'revenue.desc';

returnMovies();

function returnMovies(){
    let url;
    if(currentType === 'search'){
        url = `${BACKEND}/search?q=${currentSearch}&page=${currentPage}`;
    } else if(currentType === 'genre'){
        url = `${BACKEND}/genre/${currentGenre}?page=${currentPage}`;
    } else {
        url = `${BACKEND}?page=${currentPage}&sort=${currentSort}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(function(data){
            data.results.forEach(elements => {
                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'card');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');

                const rating = document.createElement('div');
                rating.classList.add('rating');

                const year = document.createElement('div');
                year.classList.add('year');

                const overview = document.createElement('div');
                overview.classList.add('overview');

                const movieInfo = document.createElement('div');
                movieInfo.classList.add('movie-info');

                const ratingYear = document.createElement('div');
                ratingYear.classList.add('rating-year');

                ratingYear.appendChild(rating);
                ratingYear.appendChild(year);
                movieInfo.appendChild(ratingYear);
                movieInfo.appendChild(overview);

                title.innerHTML = `${elements.title}<br><a href="movies.html?id=${elements.id}&title=${elements.title}">Reviews</a>`;

                image.src = elements.poster_path
                    ? IMG_PATH + elements.poster_path
                    : 'https://raw.githubusercontent.com/kushwaha-aryan/storage/refs/heads/main/mohamed_hassan-cinema-4153289_1920.jpg';
                image.onerror = () => image.src = 'https://raw.githubusercontent.com/kushwaha-aryan/storage/refs/heads/main/mohamed_hassan-cinema-4153289_1920.jpg';

                rating.innerHTML = `⭐ ${elements.vote_average.toFixed(2)}`;
                year.innerHTML = elements.release_date?.split("-")[0];
                overview.innerHTML = elements.overview;

                div_card.appendChild(image);
                div_card.appendChild(title);
                div_card.appendChild(movieInfo);
                main.appendChild(div_card);
            });
        });
}

genres.forEach(g => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="genre" value="${g.id}"> ${g.name}`;
    genreContainer.appendChild(label);
});

genreContainer.addEventListener('change', () => {
    currentGenre = document.querySelector('input[name="genre"]:checked').value;
    currentType = 'genre';
    currentPage = 1;
    main.innerHTML = '';
    returnMovies();
});

sorts.forEach(s => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="sort" value="${s.value}"> ${s.name}`;
    sortContainer.appendChild(label);
});

sortContainer.addEventListener('change', () => {
    currentSort = document.querySelector('input[name="sort"]:checked').value;
    currentType = 'discover';
    currentPage = 1;
    main.innerHTML = '';
    returnMovies();
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    returnMovies();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchItem = search.value;
    if(searchItem){
        currentType = 'search';
        currentSearch = searchItem;
        currentPage = 1;
        main.innerHTML = '';
        returnMovies();
        search.value = "";
        document.querySelectorAll('input[name="genre"]').forEach(r => r.checked = false);
    }
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});


// ===== AUTH =====
const authToggleBtn = document.getElementById('authToggleBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const loggedOutView = document.getElementById('loggedOutView');
const loggedInView = document.getElementById('loggedInView');
const authUsername = document.getElementById('authUsername');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const togglePassword = document.getElementById('togglePassword');
const submitAuthBtn = document.getElementById('submitAuthBtn');
const modalTitle = document.getElementById('modalTitle');
const switchToSignup = document.getElementById('switchToSignup');
const welcomeUser = document.getElementById('welcomeUser');
const logoutBtn = document.getElementById('logoutBtn');
const toggleAuthMode = document.getElementById('toggleAuthMode');

const AUTH_LINK = 'https://moviev3-backend.onrender.com/api/v1/users';
let isSignupMode = false;

function updateAuthUI() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
        authToggleBtn.textContent = username;
        welcomeUser.textContent = username;
    } else {
        authToggleBtn.textContent = 'Login';
    }
}

authToggleBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
    const token = localStorage.getItem('token');
    if (token) {
        loggedInView.style.display = 'block';
        loggedOutView.style.display = 'none';
    } else {
        loggedOutView.style.display = 'block';
        loggedInView.style.display = 'none';
    }
});

closeModal.addEventListener('click', () => {
    authModal.style.display = 'none';
});

togglePassword.addEventListener('change', function() {
    authPassword.type = this.checked ? 'text' : 'password';
});

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    isSignupMode = !isSignupMode;
    if (isSignupMode) {
        modalTitle.textContent = 'Sign Up';
        authEmail.style.display = 'block';
        submitAuthBtn.textContent = 'Sign Up';
        toggleAuthMode.innerHTML = 'Already have an account? <a href="#" id="switchToSignup2">Login</a>';
        document.getElementById('switchToSignup2').addEventListener('click', (ev) => {
            ev.preventDefault();
            isSignupMode = false;
            modalTitle.textContent = 'Login';
            authEmail.style.display = 'none';
            submitAuthBtn.textContent = 'Login';
            toggleAuthMode.innerHTML = 'Don\'t have an account? <a href="#" id="switchToSignup">Sign up</a>';
        });
    }
});

submitAuthBtn.addEventListener('click', async () => {
    const username = authUsername.value;
    const password = authPassword.value;

    if (isSignupMode) {
        const email = authEmail.value;
        const res = await fetch(`${AUTH_LINK}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        alert('Registered! Now log in.');
        isSignupMode = false;
        modalTitle.textContent = 'Login';
        authEmail.style.display = 'none';
        submitAuthBtn.textContent = 'Login';
    } else {
        const res = await fetch(`${AUTH_LINK}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        authModal.style.display = 'none';
        updateAuthUI();
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    authModal.style.display = 'none';
    updateAuthUI();
});

updateAuthUI();