const url = new URL(location.href);
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

 const APILINK = 'https://moviev3-backend.onrender.com/api/v1/reviews/';
 const BACKEND = 'https://moviev3-backend.onrender.com/api/v1/movies';

// const APILINK = 'http://localhost:8000/api/v1/reviews/';
// const BACKEND = 'http://localhost:8000/api/v1/movies';

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const movieDetails = document.getElementById('movie-Details');

returnReviews(APILINK);
addDetails();

function addDetails() {
    fetch(`${BACKEND}/${movieId}`)
        .then(res => res.json())
        .then(function(data) {
            const divCard=document.createElement("div");
            divCard.setAttribute('class', 'card');

            const img = document.createElement('img');
            img.setAttribute('class', 'thumbnail');
            img.src = data.poster_path
                ? IMG_PATH + data.poster_path
                : 'https://raw.githubusercontent.com/kushwaha-aryan/storage/refs/heads/main/mohamed_hassan-cinema-4153289_1920.jpg';

            const overview=document.createElement('p')
            overview.textContent=data.overview;

            divCard.appendChild(img);
            divCard.appendChild(overview);

            movieDetails.appendChild(divCard);
        });
}

const main = document.getElementById('section');
const title = document.getElementById('title');

title.textContent = movieTitle;

const div_new = document.createElement( 'div');
div_new.innerHTML =`
    <div class="row">
        <div class="column">
            <div class="card">
                New Review
                <p><strong>Review: </strong>
                    <input type="text" id="new_review" value="">
                </p>
                <p><strong>User: </strong>
                    <input type="text" id="new_user" value="">
                </p>
                <p><a href="#" onclick="saveReview('new_review', 'new_user' )">💾</a>
                </p>
            </div>
        </div>
    </div>
`

main.appendChild(div_new)

function returnReviews(url) {
    fetch(url + "movie/" + movieId)
        .then(res => res.json())
        .then(function (data) {
            console.log(data);

            data.forEach(review => {
                const div_card = document.createElement('div');

                div_card.innerHTML = `
                    <div class="row">                    
                        <div class="column">
                            <div class="card" id="${review._id}">
                                <p><strong>Review: </strong>${review.review}</p>
                                <p><strong>User: </strong>${review.user}</p>
                                <p>
                                    <a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">✏️</a> 
                                    <a href="#" onclick="deleteReview('${review._id}')">🗑️</a>
                                </p>
                            </div>
                        </div>
                    </div>
                `;

                main.appendChild(div_card);
            });
        });
}

function editReview(id, review, user) {
    const element = document.getElementById(id);
    const reviewInputId = "review" + id;
    const userInputId = "user" + id;

    element.innerHTML = `
        <p><strong>Review: </strong>
            <input type="text" id="${reviewInputId}" value="${review}">
        </p>
        <p><strong>User: </strong>
            <input type="text" id="${userInputId}" value="${user}">
        </p>
        <p>
            <a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a>
        </p>
    `;
}

function saveReview(reviewInputId, userInputId, id="") {
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    if(!user || !review) {
        alert("Please fill in both fields");
        return;
    }

    if(id){
        fetch(APILINK + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review})
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                location.reload();
            });
    }else {
        fetch(APILINK + "new", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review, "movieId": movieId})
        }) . then( res => res.json())
            .then(res => {
                console.log(res)
                location.reload();
            });
    }

}

function deleteReview(id) {
    fetch(APILINK + id, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            location.reload();
        })
}

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});