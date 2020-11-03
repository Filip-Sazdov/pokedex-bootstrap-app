let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20';

	function add(pokemon) {
		if (
			typeof pokemon === 'object'
			// &&
			// "name" in pokemon &&
			// "height" in pokemon &&
			// "types" in pokemon
		) {
			pokemonList.push(pokemon);
		} else {
			console.log('Please input an Object data type with the required properties!!!');
		}
	}

	function getAll() {
		return pokemonList;
	}
	function findByName(userNameInput) {
		let result = pokemonList.filter((pokemon) => pokemon.name === userNameInput);
		if (result.length === 0) {
			return `There is no such pokemon by the name of ${userNameInput} in this repository!`;
		} else {
			return result;
		}
	}
	function addListItem(pokemon) {
		loadDetails(pokemon).then(function () {
			let pokemonList = document.querySelector('.pokemon-list');
			let card = document.createElement('div');
			card.classList.add('card');

			let image = document.createElement('img');
			image.classList.add('card-img-top', 'card-image');
			image.setAttribute('src', pokemon.imageUrlAnimation);
			image.setAttribute('alt', 'gif of Pokemon');

			let body = document.createElement('div');
			body.classList.add('card-body');

			let button = document.createElement('button');
			button.innerText = pokemon.name;
			button.classList.add('btn', 'btn-primary', 'btn-lg', 'text-capitalize');
			button.setAttribute('type', 'button');
			button.setAttribute('data-toggle', 'modal');
			button.setAttribute('data-target', '#exampleModalCenter');

			body.appendChild(button);
			card.appendChild(image);
			card.appendChild(body);
			pokemonList.appendChild(card);

			button.addEventListener('click', function () {
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
		let modal = document.createElement('div');
		modal.innerHTML = '';
		modal.classList.add('modal', 'fade');
		modal.setAttribute('id', 'exampleModalCenter');
		modal.setAttribute('tabindex', '-1');
		modal.setAttribute('role', 'dialog');
		modal.setAttribute('aria-labelledby', 'exampleModalCenterTitle');
		modal.setAttribute('aria-hidden', 'true');

		let modalDialog = document.createElement('div');
		modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
		modalDialog.setAttribute('role', 'document');

		let modalContent = document.createElement('div');
		modalContent.classList.add('modal-content', 'text-warning', 'text-center', 'bg-dark');

		let modalHeader = document.createElement('div');
		modalHeader.classList.add('modal-header');

		let modalTitle = document.createElement('h5');
		modalTitle.classList.add('modal-title', 'text-capitalize');
		modalTitle.innerText = pokemon.name;

		let button = document.createElement('button');
		button.setAttribute('type', 'button');
		button.classList.add('close');
		button.setAttribute('data-dismiss', 'modal');
		button.setAttribute('aria-label', 'Close');
		button.setAttribute('data-dismiss', 'modal');
		button.innerHTML = '<span aria-hidden="true">&times;</span>';

		let modalBody = document.createElement('div');
		modalBody.classList.add('modal-body');

		let spriteElement = document.createElement('img');
		spriteElement.setAttribute('src', pokemon.imageUrl);
		spriteElement.classList.add('modal-img');

		let capitalisedName = pokemon.name[0].toUpperCase().concat(pokemon.name.slice(1));
		let stringifiedTypes = pokemon.types.join(', and ');
		let stringifiedAbilities = pokemon.abilities.join(', and ');
		// The API provided an erroneus value for height, value is missing a "." to denote height in meters (example: 11, instead of 1.1) so I corrected it with the below code after checking the true height on pokemon.com which is displayed there in feet.
		let correctHeight = function () {
			heightFromApi = pokemon.height.toString();

			if (heightFromApi.length < 2) {
				heightFromApi = '0.' + heightFromApi;
			} else {
				heightFromApi = heightFromApi[0] + '.' + heightFromApi[1];
			}
			return heightFromApi;
		};
		let paragraph = document.createElement('p');
		paragraph.innerText = `${capitalisedName} is a Pokemon of type[s]: ${stringifiedTypes} and has a height of ${correctHeight()} meters. Its abilities are: ${stringifiedAbilities}.`;

		modalBody.appendChild(spriteElement);
		modalBody.appendChild(paragraph);
		modalHeader.appendChild(modalTitle);
		modalHeader.appendChild(button);
		modalContent.appendChild(modalHeader);
		modalContent.appendChild(modalBody);
		modalDialog.appendChild(modalContent);
		modal.appendChild(modalDialog);
		document.querySelector('main').appendChild(modal);
	}

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
				// Now we add the API object details to the pokemon item
				item.imageUrl = details.sprites.other.dream_world.front_default;
				item.imageUrlAnimation = details.sprites.versions['generation-v']['black-white'].animated.front_default;
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
	input = document.getElementById('myInput');
	filter = input.value.toUpperCase();
	ul = document.getElementById('myUL');
	li = ul.querySelectorAll('.card');
	for (i = 0; i < li.length; i++) {
		a = li[i].querySelector('.card-body').querySelector('.btn');
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = '';
		} else {
			li[i].style.display = 'none';
		}
	}
}

let inputElement = document.querySelector('#myInput');
inputElement.addEventListener('keyup', searchByName);

let clearSearchButton = document.querySelector('#clear-search');
clearSearchButton.addEventListener('click', function () {
	inputElement.value = '';
	inputElement.dispatchEvent(new KeyboardEvent('keyup'));
});
