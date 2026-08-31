 const SAVED_LINK = 'https://moviev3-backend.onrender.com/api/v1/saved';
//const SAVED_LINK = 'http://localhost:8000/api/v1/saved';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('section');

const loader = document.getElementById('loader');

function showLoaderFav() {
    if (loader) {
        if (!document.body.contains(loader)) main.appendChild(loader);
        loader.style.display = 'flex';
    }
}

function hideLoaderFav() {
    if (loader) loader.style.display = 'none';
}

async function loadFavorites() {
    const token = localStorage.getItem('token');
    if (!token) {
        main.innerHTML = '<p style="color:white; text-align:center;">Please log in to see your favorites.</p>';
        return;
    }

    hideLoaderFav();

    // Only show the spinner if the request takes a while (cold start).
    let loaderShown = false;
    const showTimer = setTimeout(() => {
        showLoaderFav();
        loaderShown = true;
    }, 400);

    const res = await fetch(`${SAVED_LINK}/list/favorite`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const movies = await res.json();

    clearTimeout(showTimer);
    if (loaderShown) hideLoaderFav();

    if (movies.length === 0) {
        main.innerHTML = '<p style="color:white; text-align:center;">No favorites yet.</p>';
        return;
    }

    movies.forEach(movie => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');

        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.src = movie.posterPath
            ? IMG_PATH + movie.posterPath
            : 'https://raw.githubusercontent.com/kushwaha-aryan/storage/refs/heads/main/mohamed_hassan-cinema-4153289_1920.jpg';

        const title = document.createElement('h3');
        title.innerHTML = `${movie.movieTitle}<br><a href="movies.html?id=${movie.movieId}&title=${movie.movieTitle}">Reviews</a>`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove from Favorites';
        removeBtn.className = 'save-btn';
        removeBtn.onclick = async () => {
            await fetch(`${SAVED_LINK}/${movie.movieId}?type=favorite`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            div_card.remove();
        };

        div_card.appendChild(image);
        div_card.appendChild(title);
        div_card.appendChild(removeBtn);
        main.appendChild(div_card);
    });
}

loadFavorites();

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});


const RECOMMEND_LINK = 'https://moviev3-backend.onrender.com/api/v1/recommend';
//const RECOMMEND_LINK = 'http://localhost:8000/api/v1/recommend';

const recommendBtn = document.getElementById('recommendBtn');
const recommendationResult = document.getElementById('recommendationResult');
const saved = localStorage.getItem('lastRecommendation');

const spinnerHTML = `
    <div class="recommendation-spinner">
        <div class="spinner-wrap">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-center">🎬</div>
        </div>
        <div class="spinner-dots">
            <span></span><span></span><span></span>
        </div>
        <div class="loader-msg">Waking up the server...</div>
        <div class="loader-submsg">AI is picking recommendations for you, hang tight!</div>
    </div>
`;

function showRecommendSpinner() {
    setRecommendLoaderMessage('Waking up the server...', 'AI is picking recommendations for you, hang tight!');
    recommendationResult.innerHTML = spinnerHTML;
}

function setRecommendLoaderMessage(msg, sub) {
    const msgEl = document.querySelector('.loader-msg');
    const subEl = document.querySelector('.loader-submsg');
    if (msgEl) msgEl.textContent = msg;
    if (subEl) subEl.textContent = sub;
}

if (saved) {
    const parsed = JSON.parse(saved);
    recommendationResult.innerHTML = parsed.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    const usageDiv = document.createElement('div');
    usageDiv.className = 'recommend-usage';
    usageDiv.textContent = `Used ${parsed.usageCount}/${parsed.dailyLimit} recommendations today`;
    recommendationResult.appendChild(usageDiv);
}

recommendBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first');
        return;
    }

    recommendBtn.disabled = true;

    // Only show the AI spinner if it actually takes a while (Gemini + cold start).
    let loaderShown = false;
    const showTimer = setTimeout(() => {
        showRecommendSpinner();
        loaderShown = true;
    }, 400);

    const res = await fetch(RECOMMEND_LINK, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    clearTimeout(showTimer);
    recommendBtn.disabled = false;

    if (loaderShown) {
        recommendationResult.innerHTML = '';
    }

    if (data.error) {
        recommendationResult.innerHTML = `<p style="color: hotpink;">${data.error}</p>`;
        return;
    }

    recommendationResult.innerHTML = data.recommendation
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    localStorage.setItem('lastRecommendation', JSON.stringify({
        text: data.recommendation,
        usageCount: data.usageCount,
        dailyLimit: data.dailyLimit
    }));

    const usageDiv = document.createElement('div');
    usageDiv.className = 'recommend-usage';
    usageDiv.textContent = `Used ${data.usageCount}/${data.dailyLimit} recommendations today`;
    recommendationResult.appendChild(usageDiv);
});