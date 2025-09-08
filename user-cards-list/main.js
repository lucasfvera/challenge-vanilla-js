function getSafeElementById(id = '', errorName = '') {
	const element = document.getElementById(id);
	if (!element) {
		throw new Error(
			`Element with ${
				errorName ? `name ${errorName}` : `id ${id}`
			} not found`
		);
	}
	return element;
}

const API_USERS = 'https://randomuser.me/api/?results=50&nat=us';

/**
 *
 * @returns {Promise<User[]>}
 */
async function fetchUsers() {
	try {
		const response = await fetch(API_USERS);

		if (response.status >= 400) {
			//TODO: add error handling
			return [];
		}
		const jsonBody = await response.json();

		return jsonBody.results;
	} catch (e) {
		return [];
	}
}

function getRootList() {
	const rootList = getSafeElementById('users-list');
	return rootList;
}

/**
 *
 * @typedef User
 * @property {{uuid: string}} login
 * @property {{first: string, last: string}} name
 * @property {string} email
 * @property {{large: URL, medium: URL, thumbnail: URL}} picture
 *
 * @param {User} user
 */
function insertUserCardItem(user) {
	const rootList = getRootList();
	const item = createDomCard();
	const container = item.querySelector('li');
	const pictureElement = item.querySelector('#user-picture');
	const nameElement = item.querySelector('#user-name');
	const emailElement = item.querySelector('#user-email');
	const deleteButtonElement = item.querySelector('#delete-button');

	if (
		!pictureElement ||
		!nameElement ||
		!emailElement ||
		!container ||
		!deleteButtonElement
	) {
		// TODO: Add error handling
		return;
	}

	// TODO: Add blur version for loading state
	pictureElement.src = user.picture.large;

	const fullname = `${user.name.first} ${user.name.last}`;
	nameElement.textContent = fullname;
	emailElement.textContent = user.email;

	container.id = user.login.uuid;

	deleteButtonElement.addEventListener('click', () => {
		removeElement(user.login.uuid);
	});

	rootList.append(item);
}

function createDomCard() {
	const template = /** @type {HTMLTemplateElement} */ (
		getSafeElementById('user-entry', 'Root Template')
	);
	const newItem = template.content.cloneNode(true);

	return /** @type {HTMLElement} */ (newItem);
}

/**
 * @template T
 * @param {{page: number, elements: T[]}} page
 * @param {(el: T) => void} renderFn
 */
function renderPage(page, renderFn) {
	const pageIndicatorElement = getSafeElementById(
		'page-number',
		'Page Indicator'
	);
	if (!page) return;

	pageIndicatorElement.textContent = page.page.toString();
	page.elements.forEach((el) => renderFn(el));
}

function clearPage() {
	const root = getRootList();
	root.replaceChildren();
}

function renderPaginationHandlers() {
	const pages = usersData.retrievePages;
	// This is for the initial render
	const prevBtnElement = document.getElementById('previous-page-btn');
	const nextBtnElement = document.getElementById('next-page-btn');
	if (!prevBtnElement || !nextBtnElement) {
		throw new Error('Something failed while attaching the handlers');
	}
	const pageNumber = getCurrentPageNumber();
	if (pages.length === 0) {
		//Disable both buttons
		!prevBtnElement.hasAttribute('disabled') &&
			toggleDisableButton(prevBtnElement);
		!nextBtnElement.hasAttribute('disabled') &&
			toggleDisableButton(nextBtnElement);
		return;
	}
	updatePageButtonStatus(pageNumber, 0, prevBtnElement);
	updatePageButtonStatus(pageNumber + 1, pages.length, nextBtnElement);
}

function toggleDisableButton(button) {
	button.toggleAttribute('disabled');
}

function updatePageButtonStatus(pageNumber, limitNumber, targetButton) {
	const isDisabled = targetButton.hasAttribute('disabled');
	if (pageNumber === limitNumber) {
		if (!isDisabled) {
			toggleDisableButton(targetButton);
		}
		return true;
	} else if (isDisabled) {
		toggleDisableButton(targetButton);
		return false;
	}
}

function getCurrentPageNumber() {
	const pageIndicatorElement = document.getElementById('page-number');
	if (!pageIndicatorElement || !pageIndicatorElement.textContent)
		throw new Error('Page indicator not found');

	return Number(pageIndicatorElement.textContent);
}

class UserData {
	#data;
	#paginatedData;
	#filteredUsers;
	#searchTerm;

	/**
	 *
	 * @param {User[]} data
	 */
	constructor(data) {
		this.#data = data;
		this.#paginatedData = this.buildPaginatedData(data, 5);
		this.#filteredUsers = data;
		this.#searchTerm = '';
	}

	/**
	 * @template T
	 * @param {T[]} data
	 * @param {number} elementsPerPage
	 * @returns {{page: number, elements: T[]}[]} pages
	 */
	buildPaginatedData(data, elementsPerPage) {
		const pagesNumber = Math.ceil(data.length / elementsPerPage);

		/**
		 * @type {{page: number, elements: Array}[]}
		 */
		let pages = [];
		for (let currentPage = 0; currentPage < pagesNumber; currentPage++) {
			const nextPage = currentPage + 1;
			const elements = data.slice(
				currentPage * elementsPerPage,
				nextPage * elementsPerPage
			);
			const newPage = {
				page: currentPage,
				elements,
			};
			pages.push(newPage);
		}

		return pages;
	}

	get retrievePages() {
		// return this.#paginatedData;
		return this.buildPaginatedData(this.#filteredUsers, 5);
	}

	get retrieveData() {
		return this.#data;
	}

	get retrieveFilteredUsers() {
		return this.#filteredUsers;
	}

	/**
	 * @deprecated
	 */
	updatePaginatedData(newPaginatedData) {
		this.#paginatedData = this.buildPaginatedData(newPaginatedData, 5);
	}

	filterByFirstName(searchTerm) {
		this.#searchTerm = searchTerm;
		this.#filteredUsers = this.retrieveFilteredUsers.filter((el) =>
			el.name.first.toLowerCase().startsWith(searchTerm)
		);
	}

	deleteUser(id) {
		// debugger;
		this.#filteredUsers = this.retrieveFilteredUsers.filter(
			(d) => d.login.uuid !== id
		);
		if (this.#searchTerm) {
			this.filterByFirstName(this.#searchTerm);
		}
	}
}

// class ScreenRenderer{
// 	#screenPages;

// 	/**
// 	 *
// 	 * @param {UserData} usersData
// 	 */
// 	constructor(usersData){
// 		this.#screenPages = usersData.retrievePages
// 	}

// 	renderPage(number = 0){

// 	}

// }

/**
 * @type {UserData}
 */
let usersData;

// let screenRenderer;

async function main() {
	const users = await fetchUsers();
	setLoadingCards(false);

	usersData = new UserData(users);
	// screenRenderer = new ScreenRenderer(usersData.retrievePages)

	const paginatedUsers = usersData.retrievePages;
	renderPage(paginatedUsers[0], insertUserCardItem);
	renderPaginationHandlers();
}

function setLoadingCards(isLoading) {
	const loadingCards = document.querySelectorAll('.card.loading-skeleton');
	if (isLoading) {
		loadingCards.forEach((card) => card.classList.remove('hidden'));
	} else {
		loadingCards.forEach((card) => card.classList.add('hidden'));
	}
}

document.getElementById('search-box')?.addEventListener('input', (e) => {
	if (!e.target) return;
	/**
	 * @type {string}
	 */
	const searchTerm = e.target.value;
	usersData.filterByFirstName(searchTerm);
	// const els = usersData.retrieveData;
	// const filteredEls = els.filter((el) =>
	// 	el.name.first.toLowerCase().startsWith(searchTerm)
	// );

	// usersData.updatePaginatedData(filteredEls);
	const pages = usersData.retrievePages;
	clearPage();
	renderPage(pages[0], insertUserCardItem);
	renderPaginationHandlers();
});

document.getElementById('previous-page-btn')?.addEventListener('click', () => {
	const prevBtnElement = document.getElementById('previous-page-btn');
	const nextBtnElement = document.getElementById('next-page-btn');
	const pageNumber = getCurrentPageNumber();
	const prevPageNumber = pageNumber - 1;
	const pages = usersData.retrievePages;
	clearPage();
	renderPage(pages[prevPageNumber], insertUserCardItem);
	updatePageButtonStatus(prevPageNumber, 0, prevBtnElement);
	updatePageButtonStatus(prevPageNumber, pages.length - 1, nextBtnElement);
});

document.getElementById('next-page-btn')?.addEventListener('click', () => {
	const prevBtnElement = document.getElementById('previous-page-btn');
	const nextBtnElement = document.getElementById('next-page-btn');
	const pageNumber = getCurrentPageNumber();
	const nextPageNumber = pageNumber + 1;
	const pages = usersData.retrievePages;
	clearPage();
	renderPage(pages[nextPageNumber], insertUserCardItem);
	updatePageButtonStatus(nextPageNumber, 0, prevBtnElement);
	updatePageButtonStatus(nextPageNumber, pages.length - 1, nextBtnElement);
});

function removeElement(id) {
	// const data = usersData.retrieveData;
	usersData.deleteUser(id);
	// const filteredData = data.filter((d) => d.login.uuid !== id);
	// usersData.updatePaginatedData(filteredData);
	const pages = usersData.retrievePages;
	clearPage();
	renderPage(pages[0], insertUserCardItem);
	renderPaginationHandlers();
}

main();
