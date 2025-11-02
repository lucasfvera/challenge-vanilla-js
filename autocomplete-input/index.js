const MOCKED_LIST = [
    'Apple',
    'Banana',
    'Orange',
    'Strawberry',
    'Grape',
    'Watermelon',
    'Pineapple',
    'Mango',
    'Kiwi',
    'Blueberry',
    'Raspberry',
    'Peach',
    'Pear',
    'Plum',
    'Cherry',
    'Lemon',
    'Lime',
    'Avocado',
    'Pomegranate',
    'Coconut',
];

function querySafeElement(el = '', errorName = '') {
    const element = document.querySelector(el);
    if (!element) {
        throw new Error(
            `Element with ${
                errorName ? `name ${errorName}` : `id ${el}`
            } not found`
        );
    }
    return element;
}

class SearchComponent {
    elementsInList = MOCKED_LIST;

    constructor(searchInputRef, listRef) {
        this.searchInputRef = searchInputRef;
        this.listRef = listRef;
    }

    initialize() {
        this.renderListOfElements(this.elementsInList);

        this.searchInputRef.addEventListener('input', () => {
            const value = this.searchInputRef.value;
            const filteredElements = this.elementsInList.filter((el) =>
                el.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
            );
            this.renderListOfElements(filteredElements);
        });
    }

    /**
     *
     * @param {string[]} elements
     */
    renderListOfElements(elements) {
        this.listRef.replaceChildren();
        let elementsToAppend = [];
        elements.forEach((el) => {
            const it = this.createListItem();
            const container = it.querySelector('li');
            const inner = it.querySelector('button');
            if (!container || !inner) return;
            inner.addEventListener('click', () => {
                console.log('element clicked', el);
                this.elementsInList = this.elementsInList.filter(
                    (e) => e !== el
                );
                this.renderListOfElements(this.elementsInList);
                this.selectItem(el);
            });
            inner.textContent = el;
            elementsToAppend.push(container);
        });
        this.listRef.append(...elementsToAppend);
    }

    createListItem() {
        const template = /**@type {HTMLTemplateElement} */ (
            querySafeElement('#list-element-template')
        );
        const el = template.content.cloneNode(true);
        return /** @type {HTMLElement} */ (el);
    }

    selectItem(item) {
        const list = querySafeElement('#selected-items');
        const el = document.createElement('p');
        el.textContent = item;
        list.append(el);
    }
}

const inputElement = querySafeElement('#search-input');
const listElement = querySafeElement('#list');

const SearchElement = new SearchComponent(inputElement, listElement);
SearchElement.initialize();
