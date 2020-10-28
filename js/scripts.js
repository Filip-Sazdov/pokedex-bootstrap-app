let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";
	let modalContainer = document.querySelector("#modal-container");

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
		pokemonRepository.loadDetails(pokemon).then(function () {
			let listOfPokemons = document.querySelector(".pokemon-list");
			let listItem = document.createElement("li");
			listItem.classList.add("list-item");
			let button = document.createElement("button");
			button.innerText = pokemon.name;
			button.classList.add("button-template");

			//I need help with this. I can't access the image at details.sprites.other.dream_world.front_default;
			let buttonImage = document.createElement("img");
			buttonImage.setAttribute("src", pokemon.imageUrlAnimation);
			buttonImage.classList.add("button-image");
			listItem.appendChild(buttonImage);

			listItem.appendChild(button);
			listOfPokemons.appendChild(listItem);
			button.addEventListener("click", function (event) {
				showDetails(pokemon);
			});
		});
	}

	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
		console.log(pokemon);
	}
	function showModal(pokemon) {
		// Clear all existing modal content
		modalContainer.innerHTML = "";

		let modal = document.createElement("div");
		modal.classList.add("modal");

		// Add the new modal content
		let closeButtonElement = document.createElement("button");
		closeButtonElement.classList.add("modal-close");
		closeButtonElement.innerText = "Close";
		closeButtonElement.addEventListener("click", hideModal);

		let titleElement = document.createElement("h1");
		titleElement.innerText = pokemon.name;
		titleElement.classList.add("text-transform");

		let spriteElement = document.createElement("img");
		spriteElement.classList.add("modal-img");
		spriteElement.src = pokemon.imageUrl;

		let capitalisedName = pokemon.name[0].toUpperCase().concat(name.slice(1));
		let stringifiedTypes = pokemon.types.join(", and ");
		let stringifiedAbilities = pokemon.abilities.join(", and ");

		let contentElement = document.createElement("p");
		contentElement.innerText = `${capitalisedName} is a Pokemon of type[s]: ${stringifiedTypes} and has a height of ${pokemon.height} feet. Its abilities are: ${stringifiedAbilities}.`;

		modal.appendChild(closeButtonElement);
		modal.appendChild(titleElement);
		modal.appendChild(spriteElement);
		modal.appendChild(contentElement);
		modalContainer.appendChild(modal);

		modalContainer.classList.add("is-visible");
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
		// Since this is also triggered when clicking INSIDE the modal container,
		// We only want to close if the user clicks directly on the overlay
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

function myFunction() {
	let input, filter, ul, li, a, txtValue;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	ul = document.getElementById("myUL");
	li = ul.querySelectorAll(".list");
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