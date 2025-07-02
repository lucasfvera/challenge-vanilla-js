const API_USERS = 'https://randomuser.me/api/?results=50&nat=us';

async function fetchUsers() {
	try {
		const response = await fetch(API_USERS);

		if (response.status >= 400) {
			//TODO: add error management
			return [];
		}
		const jsonBody = await response.json();

		return jsonBody.results;
	} catch (e) {}
}

fetchUsers().then((users) => users.forEach((user) => insertUserCardItem(user)));

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
	const rootList = document.getElementById('users-list');
	const item = createDomCard();
	const pictureElement = item.querySelector('#user-picture');
	const nameElement = item.querySelector('#user-name');
	const emailElement = item.querySelector('#user-email');

	if (!pictureElement || !nameElement || !emailElement || !rootList) {
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
