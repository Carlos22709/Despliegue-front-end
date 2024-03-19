document.addEventListener("DOMContentLoaded", () => {
  const btnRandomCocktail = document.getElementById("BotonRandom");
  const imagenCoctel = document.querySelector(".ImagenCoctel");
  const infoCoctel = document.querySelector(".InfoCoctel");
  const botonGuardar = document.getElementById("botonGuardar");

  btnRandomCocktail.addEventListener("click", async () => {
    document.querySelector(".divrandom img").style.display = "none";
    mostrarLoader(imagenCoctel);
    try {
      const response = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/random.php"
      );
      if (response.ok) {
        const data = await response.json();
        const drink = data.drinks[0];
        imagenCoctel.innerHTML = `<img class="ImagenCoctel" src="${drink.strDrinkThumb}">`;
        //Mostrar info de coctel
        infoCoctel.innerHTML = `
                <h2>${drink.strDrink}</h2>
                <p>ID: ${drink.idDrink}</p>
                <p>Categoría: ${drink.strCategory}</p>
                <h3>Ingredientes:</h3>
                <ul>
                ${crearListaIngredientes(drink)}
                </ul>
                <p>Instrucciones: ${drink.strInstructions}</p>
                `;
        //Aquí está la lógica para la lista de favoritos...
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Obtener los cócteles favoritos almacenados en localStorage
        botonGuardar.addEventListener("click", () => {
          const drink = data.drinks[0];
          favoritos.push(drink); // Agregar el cóctel actual a la lista de favoritos
          localStorage.setItem("favoritos", JSON.stringify(favoritos)); // Guardar la lista de favoritos en localStorage, se pasa a string
          mostrarFavoritos();
        });
      } else {
        throw new Error("Error en la solicitud: " + response.status);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error, realiza la acción nuevamente");
    }
  });

  //Función para el loader
  function mostrarLoader(elemento) {
    const loader = document.createElement("div");
    loader.className = "loader";
    elemento.appendChild(loader);
  }

  // Función para crear la lista de ingredientes con sus cantidades
  function crearListaIngredientes(drink) {
    let ingredientesLista = "";
    // Recorrer los campos de ingredientes y medidas
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      // Verificar si el ingrediente y la medida existen y agregarlos a la lista
      if (ingredient && measure) {
        ingredientesLista += `<p>${measure.trim()} of ${ingredient.trim()}</p>`;
      }
    }
    return ingredientesLista;
  }

  //Esta función es para la visualización de la list de favoritos
    function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Obtener los cócteles favoritos almacenados en localStorage
    const favoritosContainer = document.querySelector(
      "#favoritos .divfavoritos"
    ); // Obtener el contenedor de favoritos
    // Limpiar la lista actual de favoritos para evitar duplicados
    favoritosContainer.innerHTML = "";
    // Agregar todos los cócteles favoritos a la lista
    if (favoritos.length > 0) {
      favoritos.forEach((drink) => {
        if (drink) {
          // Verificar que drink no sea null
          const favoritoItem = document.createElement("div");
          const botonDetalles = document.createElement("button");
          favoritoItem.style.display = "inline-block";
          favoritoItem.style.marginRight = "20px";
          favoritoItem.style.alignContent = "center";
          botonDetalles.textContent = "Ver Detalles";
          botonDetalles.classList.add("ver-detalles");
          botonDetalles.addEventListener("click", function () {
            mostrarDetalles(drink);
          });
          favoritoItem.innerHTML = `
                <h3>${drink.strDrink}</h3>
                <p>ID: ${drink.idDrink}</p>
                `;
          favoritoItem.appendChild(botonDetalles);
          favoritosContainer.appendChild(favoritoItem);
        }
      });
    } else {
      favoritosContainer.innerHTML = "No hay cócteles favoritos";
    }
  }
  function mostrarDetalles(coctel) {
    const detallesContainer = document.querySelector(".detalles-container");
    if (
      detallesContainer.style.display === "none" ||
      detallesContainer.innerHTML === ""
    ) {
      detallesContainer.innerHTML = `
                <img src="${coctel.strDrinkThumb}">
                <h3>${coctel.strDrink}</h3>
                <p>ID: ${coctel.idDrink}</p>
                <p>Categoría: ${coctel.strCategory}</p>
                <h3>Ingredientes:</h3>
                <ul>
                    ${crearListaIngredientes(coctel)}
                </ul>
                <p>Instrucciones: ${coctel.strInstructions}</p>
            `;
      detallesContainer.style.display = "block";
    } else {
      detallesContainer.innerHTML = "";
      detallesContainer.style.display = "none";
    }
  }
});
