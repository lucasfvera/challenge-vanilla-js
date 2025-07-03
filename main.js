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
	const rootList = document.getElementById('users-list');
	if (!rootList) throw new Error('Root list not found');
	return rootList;
}

/**
 *
 * @typedef User
 * @property {{first: string, last: string}} name
 * @property {string} email
 * @property {{large: URL, medium: URL, thumbnail: URL}} picture
 *
 * @param {User} user
 */
function insertUserCardItem(user) {
	const rootList = getRootList();
	const item = createDomCard();
	const pictureElement = item.querySelector('#user-picture');
	const nameElement = item.querySelector('#user-name');
	const emailElement = item.querySelector('#user-email');

	if (!pictureElement || !nameElement || !emailElement) {
		// TODO: Add error handling
		return;
	}

	// TODO: Add blur version for loading state
	pictureElement.src = user.picture.large;

	const fullname = `${user.name.first} ${user.name.last}`;
	nameElement.textContent = fullname;
	emailElement.textContent = user.email;

	rootList.append(item);
}

function createDomCard() {
	const template = /** @type {HTMLTemplateElement | null} */ (
		document.getElementById('user-entry')
	);
	if (!template) throw new Error('Root template element not found');
	const newItem = template.content.cloneNode(true);

	return /** @type {HTMLElement} */ (newItem);
}

/**
 * @template T
 * @param {T[]} data
 * @param {number} elementsPerPage
 * @returns {{page: number, elements: T[]}[]} pages
 */
function paginateData(data, elementsPerPage) {
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

/**
 * @template T
 * @param {{page: number, elements: T[]}} page
 * @param {(el: T) => void} renderFn
 */
function renderPage(page, renderFn) {
	const pageIndicatorElement = document.getElementById('page-number');
	if (!pageIndicatorElement || !page) return;

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

	/**
	 *
	 * @param {User[]} data
	 */
	constructor(data) {
		this.#data = data;
		this.#paginatedData = this.buildPaginatedData(data, 5);
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
		return this.#paginatedData;
	}

	get retrieveData() {
		return this.#data;
	}

	updatePaginatedData(newPaginatedData) {
		this.#paginatedData = newPaginatedData;
	}
}

/**
 * @type {UserData}
 */
let usersData;

async function main() {
	const users = await fetchUsers();
	setLoadingCards(false);

	usersData = new UserData(users);

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
	const els = usersData.retrieveData;
	const filteredEls = els.filter((el) =>
		el.name.first.toLowerCase().startsWith(searchTerm)
	);
	console.log(filteredEls, searchTerm);

	const pages = usersData.buildPaginatedData(filteredEls, 5);
	usersData.updatePaginatedData(pages);
	clearPage();
	renderPage(pages[0], insertUserCardItem);
	renderPaginationHandlers();
});

document.getElementById('previous-page-btn')?.addEventListener('click', () => {
	const prevBtnElement = document.getElementById('previous-page-btn');
	const nextBtnElement = document.getElementById('next-page-btn');
	const pages = usersData.retrievePages;
	const pageNumber = getCurrentPageNumber();
	const prevPageNumber = pageNumber - 1;
	clearPage();
	renderPage(pages[prevPageNumber], insertUserCardItem);
	updatePageButtonStatus(prevPageNumber, 0, prevBtnElement);
	updatePageButtonStatus(prevPageNumber, pages.length - 1, nextBtnElement);
});

document.getElementById('next-page-btn')?.addEventListener('click', () => {
	const prevBtnElement = document.getElementById('previous-page-btn');
	const nextBtnElement = document.getElementById('next-page-btn');
	const pages = usersData.retrievePages;
	const pageNumber = getCurrentPageNumber();
	const nextPageNumber = pageNumber + 1;
	clearPage();
	renderPage(pages[nextPageNumber], insertUserCardItem);
	updatePageButtonStatus(nextPageNumber, 0, prevBtnElement);
	updatePageButtonStatus(nextPageNumber, pages.length - 1, nextBtnElement);
});

main();
