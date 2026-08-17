 const SAVED_LINK = 'https://moviev3-backend.onrender.com/api/v1/saved';
//const SAVED_LINK = 'http://localhost:8000/api/v1/saved';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('section');

async function loadWatchlist() {
    const token = localStorage.getItem('token');
    if (!token) {
        main.innerHTML = '<p style="color:white; text-align:center;">Please log in to see your watchlist.</p>';
        return;
    }

    const res = await fetch(`${SAVED_LINK}/list/watchlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const movies = await res.json();

    if (movies.length === 0) {
        main.innerHTML = '<p style="color:white; text-align:center;">No movies in watchlist yet.</p>';
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
        removeBtn.textContent = 'Remove from Watchlist';
        removeBtn.className = 'save-btn';
        removeBtn.onclick = async () => {
            await fetch(`${SAVED_LINK}/${movie.movieId}?type=watchlist`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            div_card.remove();
        };

        const watchedBtn = document.createElement('button');
        watchedBtn.textContent = 'Mark as Watched';
        watchedBtn.className = 'save-btn';
        watchedBtn.onclick = async () => {
            if (!confirm(`Mark "${movie.movieTitle}" as watched?`)) return;

            // remove from watchlist
            await fetch(`${SAVED_LINK}/${movie.movieId}?type=watchlist`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // add to watched
            await fetch(`${SAVED_LINK}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movieId: movie.movieId,
                    movieTitle: movie.movieTitle,
                    posterPath: movie.posterPath,
                    type: 'watched'
                })
            });

            div_card.remove();
        };

        div_card.appendChild(image);
        div_card.appendChild(title);
        div_card.appendChild(removeBtn);
        div_card.appendChild(watchedBtn);
        main.appendChild(div_card);
    });
}

loadWatchlist();

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});