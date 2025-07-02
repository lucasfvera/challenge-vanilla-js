Here's a **mock Vanilla JS technical challenge** that simulates a 1-hour interview setting. This exercise is tailored to hit the areas you need to strengthen — including **async logic**, **DOM manipulation**, **performance**, **form handling**, and **code quality**.

---

## 🧪 Mock Interview Challenge (1 Hour)

### 🕒 Goal:

Build a fully functional and **cleanly structured** app in **60 minutes**. Prioritize clarity, error handling, and basic styling.

---

## 📌 Challenge: **User Directory Dashboard**

Build a small frontend app that:

1. **Fetches a list of users** from an API.
2. Displays them in a **paginated list**.
3. Includes a **search bar** to filter users by name (case-insensitive).
4. Shows a **loading spinner** while fetching.
5. Handles **API errors** gracefully.
6. Includes a basic **form to add a user** locally.
7. Allows removing a user from the list.
8. Applies **clean and consistent styling** — no `!important`.

---

### 🔗 API Endpoint:

Use: [https://randomuser.me/api/?results=50\&nat=us](https://randomuser.me/api/?results=50&nat=us)

Example response:

```json
{
  "results": [
    {
      "name": { "first": "John", "last": "Doe" },
      "email": "john.doe@example.com",
      "picture": { "thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg" }
    },
    ...
  ]
}
```

---

## 🧩 Features to Implement

### 🔍 1. **User List + Pagination**

* Show 10 users per page.
* Include next/prev buttons.
* Display user name, email, and thumbnail.

### 🔎 2. **Live Search**

* Search filters the list as you type.
* Case-insensitive matching on first or last name.

### 🔁 3. **Loading State**

* While fetching data, show a "Loading..." indicator.
* Remove it once data is ready.

### 🧨 4. **Error Handling**

* Simulate a failed fetch (bad URL) and show a helpful error message in the UI.

### 🧾 5. **Add User (Form)**

* Create a simple form with:

  * First Name
  * Last Name
  * Email
* Add new user to the current list when submitted.
* Form should validate non-empty values.

### ❌ 6. **Delete User**

* Include a delete button per user.

### 💄 7. **Styling Requirements**

* Use pure CSS, no frameworks.
* No inline styles.
* Avoid `!important` — style with specificity and class structure.
* Try a basic layout: centered, card-style UI, readable font sizes.

---

## 📂 Folder Structure (suggestion)

```
- index.html
- style.css
- script.js
```

---

## 💡 Tips

### Coding

* Use `async/await` and `try/catch` properly.
* Keep logic modular: separate rendering, state, and UI updates.
* Use helper functions to clean up long blocks of logic.
* Be mindful of re-rendering only necessary parts on pagination/filtering.

### Edge Cases

* Handle empty search results.
* Don’t break the pagination when a user is deleted.
* Prevent form submission if fields are empty or invalid.

---

## 🧠 After You're Done

When the 1 hour is over:

1. **Review your code** for clarity.
2. Ask yourself:

   * Would another dev understand this quickly?
   * Could I add tests later?
   * Are styles scoped properly?

---

Would you like a version of this with a scoring rubric, like an interviewer would use (e.g. 1–5 on structure, async logic, UX polish, etc)?
