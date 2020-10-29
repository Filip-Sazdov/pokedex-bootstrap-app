let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=24";
	let modalContainer = document.querySelector(".modal");

	function add(pokemon) {
		if (
			typeof pokemon === "object"
			// &&
			// "name" in pokemon &&
			// "height" in pokemon &&
			// "types" in pokemon
		) {
			pokemonList.push(pokemon);
		} else {
			console.log(
				"Please input an Object data type with the required properties!!!"
			);
		}
	}

	function getAll() {
		return pokemonList;
	}
	function findByName(userNameInput) {
		let result = pokemonList.filter(
			(pokemon) => pokemon.name === userNameInput
		);
		if (result.length === 0) {
			return `There is no such pokemon by the name of ${userNameInput} in this repository!`;
		} else {
			return result;
		}
	}
	function addListItem(pokemon) {
		loadDetails(pokemon).then(function () {
			let listOfPokemons = document.querySelector(".pokemon-list");

			let listItem = document.createElement("li");
			listItem.classList.add(
				"list-item",
				"list-group-item-dark",
				"col-4",
				"card",
				"group-list-item",
				"mb-4"
			);

			let button = document.createElement("button");
			button.innerText = pokemon.name;
			button.classList.add(
				"btn",
				"btn-primary",
				"text-capitalize",
				"text-warning"
			);
			button.setAttribute("type", "button");
			button.setAttribute("data-toggle", "modal");
			button.setAttribute("data-target", "#exampleModalCenter");

			let buttonImage = document.createElement("img");
			buttonImage.setAttribute("src", pokemon.imageUrlAnimation);
			buttonImage.classList.add("button-image", "card-img-top");

			listItem.appendChild(buttonImage);
			listItem.appendChild(button);
			listOfPokemons.appendChild(listItem);

			button.addEventListener("click", () => {
				showDetails(pokemon);
			});
		});
	}

	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}
	function showModal(pokemon) {
		let contentElement = document.querySelector(".modal-body");
		let titleElement = document.querySelector(".modal-title");

		let modalBox = document.querySelector(".modal-content");
		modalBox.classList.add("text-warning", "text-center", "bg-dark");

		contentElement.innerHTML = "";
		titleElement.innerHTML = "";

		let nameElement = document.createElement("h1");
		nameElement.innerText = pokemon.name;
		nameElement.classList.add("text-capitalize");

		let spriteElement = document.createElement("img");
		spriteElement.src = pokemon.imageUrl;
		spriteElement.classList.add("modal-img");
		spriteElement.setAttribute("style", "width:50%");

		let capitalisedName = pokemon.name[0]
			.toUpperCase()
			.concat(pokemon.name.slice(1));
		let stringifiedTypes = pokemon.types.join(", and ");
		let stringifiedAbilities = pokemon.abilities.join(", and ");

		let correctHeight = function () {
			heightFromApi = pokemon.height.toString();

			if (heightFromApi.length < 2) {
				heightFromApi = "0." + heightFromApi;
				return heightFromApi;
			} else {
				heightFromApi = heightFromApi[0] + "." + heightFromApi[1];
			}
			return heightFromApi;
		};
		let paragraph = document.createElement("p");
		paragraph.innerText = `${capitalisedName} is a Pokemon of type[s]: ${stringifiedTypes} and has a height of ${correctHeight()} meters. Its abilities are: ${stringifiedAbilities}.`;

		titleElement.appendChild(nameElement);
		contentElement.appendChild(spriteElement);
		contentElement.appendChild(paragraph);
	}

	function hideModal() {
		modalContainer.classList.remove("is-visible");
	}

	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
			hideModal();
		}
	});

	modalContainer.addEventListener("click", (e) => {
		let target = e.target;
		if (target === modalContainer) {
			hideModal();
		}
	});

	function loadList() {
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					add(pokemon);
				});
			})
			.catch(function (e) {
				console.error(e);
			});
	}
	function loadDetails(item) {
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				// Now we add the details to the item
				item.imageUrl = details.sprites.other.dream_world.front_default;
				item.imageUrlAnimation =
					details.sprites.versions["generation-v"][
						"black-white"
					].animated.front_default;
				item.height = details.height;
				item.types = [];
				details.types.forEach(function (itemType) {
					item.types.push(itemType.type.name);
				});
				item.abilities = [];
				details.abilities.forEach(function (itemAbility) {
					item.abilities.push(itemAbility.ability.name);
				});
			})
			.catch(function (e) {
				console.error(e);
			});
	}

	return {
		add: add,
		getAll: getAll,
		findByName: findByName,
		addListItem: addListItem,
		showDetails: showDetails,
		loadList: loadList,
		loadDetails: loadDetails,
	};
})();

pokemonRepository.loadList().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});

function searchByName() {
	let input, filter, ul, li, a, txtValue;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	ul = document.getElementById("myUL");
	li = ul.querySelectorAll(".list-item");
	console.log(li);

	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("button")[0];
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}
