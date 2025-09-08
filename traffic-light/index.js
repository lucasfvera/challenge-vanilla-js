function showRedLight() {
    document.getElementById("red")?.classList.add("active");
    document.getElementById("red")?.classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("red")?.classList.add("hidden");
        document.getElementById("red")?.classList.remove("active");
        showYellowLight("red");
    }, 4000);
}

showRedLight();

/**
 *
 * @param {"red" | "green"} previousLight
 */
function showYellowLight(previousLight) {
    document.getElementById("yellow")?.classList.add("active");
    document.getElementById("yellow")?.classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("yellow")?.classList.remove("active");
        document.getElementById("yellow")?.classList.add("hidden");
        if (previousLight === "red") {
            showGreenLight();
        } else {
            showRedLight();
        }
    }, 2000);
}

function showGreenLight() {
    document.getElementById("green")?.classList.add("active");
    document.getElementById("green")?.classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("green")?.classList.remove("active");
        document.getElementById("green")?.classList.add("hidden");
        showYellowLight("green");
    }, 5000);
}
