const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const targetTabId = tab.id;
        // The tab is already selected
        if (tab.classList.contains("tab__active")) {
            return;
        } else {
            tabs.forEach((t) =>
                t.id === targetTabId
                    ? // Add active class to this tab
                      t.classList.add("tab__active")
                    : // remove the active class from other tabs
                      t.classList.remove("tab__active")
            );
            tabs.forEach((t) =>
                t.id === targetTabId
                    ? // remove the active class from other contents
                      document
                          .getElementById(t.id + "-content")
                          ?.classList.add("active")
                    : // Add active to the proper content
                      document
                          .getElementById(t.id + "-content")
                          ?.classList.remove("active")
            );
        }
    });
});

// Improvements:
// Add the tab to the URL to keep state
