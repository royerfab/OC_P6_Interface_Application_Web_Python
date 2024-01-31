function close_modal() {
  var modal = document.getElementById("modale");
  console.log("modale_cliquée");
  modal.style.display = "none";
}

function open_modal(movie_id) {
  var modal = document.getElementById("modale");
  console.log("modale_cliquée", movie_id);
  modale_content(movie_id);
  modal.style.display = "block";
}

function generate_movies(url, classe) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        const data1 = data.results
        fetch(url + "&page=2")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const data2 = data.results;
            const results = data1.concat(data2.slice(0, 2));
            for (result of results) {
              document.getElementById(classe).innerHTML += `
                <div class="film">
                    <img
                        onclick="open_modal(${result.id})"
                        style="width: 100%; height: 100%"
                        src="${result.image_url}"
                    />
                </div>
                `;
            }
          });
    });
}

function modale_content(movie_id) {
  fetch(`http://localhost:8000/api/v1/titles/${movie_id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        document.getElementById("modale_content").innerHTML = ""
        document.getElementById("modale_content").innerHTML += `
                    <div>
                        <img
                            style="width: 200px; height: 300px"
                            src="${data.image_url ?? ""}"
                        />
                    </div>
                    <div>
                        <h2 id="dialog-title">${data.title ?? ""}</h2>
                        <p id="movie_genre">${data.genre ?? ""}</p>
                        <p id="year">${data.year ?? ""}</p>
                        <p id="rated">Critique : ${
                          isNaN(data.rated) ? data.rated : data.rated + "/10"
                        }</p>
                        <p id="imbd">Score imbd : ${data.imdb_score ?? ""}</p>
                        <p id="directors">Réalisateur : ${
                          data.directors ?? ""
                        }</p>
                        <p id="actors">Acteurs : ${data.actors ?? ""}</p>
                        <p id="duration">${data.duration ?? ""} minutes</p>
                        <p id="countries">${data.countries ?? ""}</p>
                        <p id="worldwide_gross_income">${
                          data.worldwide_gross_income ?? ""
                        }</p>
                        <p id="description">Résumé : ${
                          data.description ?? ""
                        }</p>
                    </div>
                    <div>
                        <i class="fa-solid fa-square-xmark"></i>                   
                    </div>
                `;
    });
}


function best_movie(url, classe) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const container = document.querySelector(`.${classe}`);
      if (container) {
        container.innerHTML = "";
        const firstResult = data.results[0];
        fetch(firstResult.url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const result = data;
            container.innerHTML += `
            <div class="best_film">
                <div id="content_best_film">
                    <h2 id="best_film_title">${result.title ?? ""}</h2></br>
                    <button id="button_infos" onclick="open_modal(${
                      result.id
                    })">Infos</button>
                    <p id="best_film_description">Résumé : ${
                      result.description
                    }</p>
                </div>
                <div>
                    <img
                    onclick="open_modal(${result.id})"
                    style="width: 600px; height: 500px; box-shadow: 0 0 8px 8px; border-radius: 50px"
                    src="${result.image_url}"
                    />
                </div>
                
            </div>
            `;
        });
      }
    });
}

function prevSlide(elementId) {
  const element = document.getElementById(elementId);
  element.scrollLeft -= 285;
}

function nextSlide(elementId) {
    const element = document.getElementById(elementId)
    element.scrollLeft += 285;
}

generate_movies(
  "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score",
  "best_movies"
);

generate_movies(
  "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=family",
  "family_movies"
);

generate_movies(
  "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=music",
  "music_movies"
);

generate_movies(
  "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=horror",
  "horror_movies"
);

best_movie(
   " http://localhost:8000/api/v1/titles/?sort_by=-imdb_score",
   "Meilleur_film");