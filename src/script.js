/**
 *
 * @param {function} func
 * @param {array} args
 * @returns {function}
 */
function executeChromeFunction(func, args) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func,
      args,
    });
  });
}
// >>=====>>====>>====#[<| EFFECTS |>]#====<<====<<=====<<

const setBackgroundRedButton = document.querySelector(".set-bg-btn");

const setBackgroundRed = () =>
  (document.body.style.backgroundColor = "#883333");

setBackgroundRedButton.addEventListener("click", () =>
  executeChromeFunction(setBackgroundRed)
);

// <<===========||===========||===========||===========>>

const setLinkColorButton = document.querySelector(".set-link-color");
const linkColorInput = document.querySelector(".link-color-input");

function setLinkColor(color) {
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => (link.style.color = color));
}

setLinkColorButton.addEventListener("click", () =>
  executeChromeFunction(setLinkColor, [linkColorInput.value])
);

// <<===========||===========||===========||===========>>

const deleteImagesButton = document.querySelector(".delete-images-btn");

function deleteAllImages() {
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => img.remove());
}

deleteImagesButton.addEventListener("click", () =>
  executeChromeFunction(deleteAllImages)
);

// <<===========||===========||===========||===========>>
const toggleDisplayPasswordsButton = document.querySelector(
  ".toggle-display-passwords"
);

let passwordsAreShown = false;
function togglePasswordDisplay(arePasswordsShown) {
  const originalPasswordInputs = document.querySelectorAll(
    'input[type="password"]'
  );
  const type = arePasswordsShown ? "text" : "password";

  originalPasswordInputs.forEach((input) =>
    input.setAttribute("is_pass", arePasswordsShown)
  );
  document.querySelectorAll("input[is_pass]").forEach((input) => {
    input.type = type;
    input.setAttribute("is_pass", arePasswordsShown);
  });
}

toggleDisplayPasswordsButton.addEventListener("click", () => {
  passwordsAreShown = !passwordsAreShown;
  executeChromeFunction(togglePasswordDisplay, [passwordsAreShown]);
});
