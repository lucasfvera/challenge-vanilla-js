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
	if (!pageIndicatorElement) return;

	pageIndicatorElement.textContent = page.page.toString();
	page.elements.forEach((el) => renderFn(el));
}

function clearPage() {
	const root = getRootList();
	root.replaceChildren();
}

function addPaginationHandlers(pages) {
	const prevBtnElement = document.getElementById('previous-page-btn');
	const nextBtnElement = document.getElementById('next-page-btn');
	if (!prevBtnElement || !nextBtnElement) {
		throw new Error('Something failed while attaching the handlers');
	}

	const pageNumber = getCurrentPageNumber();
	updatePageButtonStatus(pageNumber, 0, prevBtnElement);
	updatePageButtonStatus(pageNumber, pages.length - 1, nextBtnElement);

	nextBtnElement.addEventListener('click', () => {
		const pageNumber = getCurrentPageNumber();
		clearPage();
		renderPage(pages[pageNumber + 1], insertUserCardItem);
		updatePageButtonStatus(pageNumber, 0, prevBtnElement);
		updatePageButtonStatus(
			pageNumber + 1,
			pages.length - 1,
			nextBtnElement
		);
	});

	prevBtnElement.addEventListener('click', () => {
		const pageNumber = getCurrentPageNumber();
		clearPage();
		renderPage(pages[pageNumber - 1], insertUserCardItem);
		updatePageButtonStatus(pageNumber, pages.length - 1, nextBtnElement);
		updatePageButtonStatus(pageNumber - 1, 0, prevBtnElement);
	});
}

function toggleDisableButton(button) {
	button.toggleAttribute('disabled');
}

function updatePageButtonStatus(pageNumber, limitNumber, targetButton) {
	if (pageNumber === limitNumber) {
		toggleDisableButton(targetButton);
		return true;
	} else if (targetButton.hasAttribute('disabled')) {
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

async function main() {
	const users = await fetchUsers();

	const paginatedUsers = paginateData(users, 5);
	renderPage(paginatedUsers[0], insertUserCardItem);
	addPaginationHandlers(paginatedUsers);
}

main();
