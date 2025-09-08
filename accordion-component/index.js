const accordions = document.querySelectorAll(".accordion");

accordions.forEach((acc) => {
    acc.querySelector(".accordion__header")?.addEventListener("click", () =>
        clickHandler(acc)
    );
});

function clickHandler(acc) {
    /** @type HTMLElement */
    const content = acc.querySelector(".accordion__content");
    if (!content)
        throw new Error(
            "Accordion element content not found: define the accordion__content"
        );
    // content.classList.toggle("visible");
    if (content.style.maxHeight) {
        content.style.maxHeight = "";
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}
