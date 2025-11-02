const PASSWORD_REQUIRED_LENGTH = 8;

function querySafeSelector(el) {
    const element = document.querySelector(el);
    if (!element) {
        throw new Error(`Element ${el} not found`);
    } else {
        return element;
    }
}

class FormValidator {
    /**
     * @type {{field: string, msg: string}[]}
     */
    errors = [];

    /**
     *
     * @param {HTMLFormElement} formRef
     * @param {string[]} fields
     */
    constructor(formRef, fields) {
        /** @type {HTMLFormElement} */
        this.form = formRef;
        /** @type {{field: string, touched: boolean}[]} */
        this.fields = fields.map((field) => ({ field, touched: false }));
    }

    initialize() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.errors.length > 0) {
                return;
            } else {
                alert('Form submitted');
            }
        });

        this.fields.forEach(({ field }) => {
            const el = querySafeSelector(`#${field}-input`);
            const fieldState = this.getFieldState(field);

            el.addEventListener('blur', () => {
                fieldState.touched = true;
                this.validateField(field);
                this.renderErrors(field);
            });

            el.addEventListener('input', () => {
                if (fieldState.touched) {
                    this.resetFieldErrors(field);
                    this.validateField(field);
                    this.renderErrors(field);
                }
                // if (field === 'email' && fieldState.touched) {
                //     this.resetFieldErrors('email');
                //     this.validateEmailField();
                //     this.renderErrors('email');
                // }
                // if (field === 'password' && fieldState.touched) {
                //     this.resetFieldErrors('password');
                //     this.validatePasswordField();
                //     this.renderErrors('password');
                // }
            });
        });
    }

    /** @param {string} field */
    getFieldState(field) {
        const targetField = this.fields.find((f) => f.field === field);
        if (!targetField)
            throw new Error(`Unable to find ${field} field state`);
        return targetField;
    }

    setFormError(e, field) {
        this.errors = [...this.errors, { field, msg: e }];
    }

    resetFieldErrors(field) {
        this.errors = this.errors.filter((e) => e.field !== field);
    }

    resetFormErrors() {
        this.errors = [];
    }

    /** @param {string} field */
    validateField(field) {
        if (field === 'email') {
            this.validateEmailField();
        } else if (field === 'password') {
            this.validatePasswordField();
        }
    }

    validateEmailField() {
        /** @type {HTMLInputElement} */
        const emailInput = querySafeSelector('#email-input');
        const inputValue = emailInput.value;

        const hasAtChar = inputValue.includes('@');
        const hasDomain =
            inputValue.split('@').filter((el) => el !== '').length > 1;
        const hasTopLevelDomain =
            hasDomain &&
            inputValue
                .split('@')[1]
                .split('.')
                .filter((e) => e !== '').length > 1;

        if (!hasAtChar) {
            this.setFormError('@ character missing in email', 'email');
        }
        if (!hasTopLevelDomain) {
            this.setFormError('email missing top level domain', 'email');
        }

        return hasAtChar && hasTopLevelDomain;
    }

    validatePasswordField() {
        const passwordInput = querySafeSelector('#password-input');
        const inputValue = passwordInput.value;

        const hasProperLength = inputValue.length >= PASSWORD_REQUIRED_LENGTH;
        const regexSpecialChar = new RegExp(/[^A-Za-z0-9]/);
        const regexNumberChar = new RegExp(/[0-9]/);

        const hasSpecialChar = regexSpecialChar.test(inputValue);
        const hasNumberChar = regexNumberChar.test(inputValue);

        if (!hasProperLength) {
            this.setFormError('password must have 8 chars min', 'password');
        }
        if (!hasSpecialChar) {
            this.setFormError(
                'password must have a special character',
                'password'
            );
        }
        if (!hasNumberChar) {
            this.setFormError('password must have a number', 'password');
        }

        return hasProperLength && hasSpecialChar && hasNumberChar;
    }

    /**
     *
     * @param {string} errorType
     */
    renderErrors(errorType) {
        const errorsList = querySafeSelector('#errors-list');
        errorsList.replaceChildren();

        if (this.errors.some((e) => e.field === errorType)) {
            const input = querySafeSelector(`#${errorType}-input`);
            input.classList.add('has-error');
        } else {
            const input = querySafeSelector(`#${errorType}-input`);
            input.classList.remove('has-error');
        }

        // Error is of type {field, msg}
        const elements = this.errors.map((e) => {
            const listElement = document.createElement('li');
            listElement.textContent = e.msg;
            return listElement;
        });

        errorsList.append(...elements);
    }
}

const inputs = ['email', 'password'];
const formElement = querySafeSelector('#signup-form');
const validator = new FormValidator(formElement, inputs);

validator.initialize();
