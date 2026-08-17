 const SAVED_LINK = 'https://moviev3-backend.onrender.com/api/v1/saved';
//const SAVED_LINK = 'http://localhost:8000/api/v1/saved';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('section');

async function loadWatched() {
    const token = localStorage.getItem('token');
    if (!token) {
        main.innerHTML = '<p style="color:white; text-align:center;">Please log in to see your watched movies.</p>';
        return;
    }

    const res = await fetch(`${SAVED_LINK}/list/watched`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const movies = await res.json();

    if (movies.length === 0) {
        main.innerHTML = '<p style="color:white; text-align:center;">No watched movies yet.</p>';
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
        removeBtn.textContent = 'Remove from Watched';
        removeBtn.className = 'save-btn';
        removeBtn.onclick = async () => {
            await fetch(`${SAVED_LINK}/${movie.movieId}?type=watched`, {
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

loadWatched();

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});