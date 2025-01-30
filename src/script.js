/**
 *
 * @param {function} func
 * @param {array} args
 * @returns {function}
 */
function useChromeFunction(func, args) {
  return () =>
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

setBackgroundRedButton.addEventListener(
  "click",
  useChromeFunction(setBackgroundRed)
);

// <<===========||===========||===========||===========>>

const setLinkColorButton = document.querySelector(".set-link-color");
const linkColorInput = document.querySelector(".link-color-input");

function setLinkColor(color) {
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => (link.style.color = color));
}

setLinkColorButton.addEventListener("click", () => {
  useChromeFunction(setLinkColor, [linkColorInput.value])();
});
