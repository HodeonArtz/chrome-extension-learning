const setBackgroundRedButton = document.querySelector(".set-bg-btn");

setBackgroundRedButton.addEventListener(
  "click",
  useChromeFunction(setBackgroundRed)
);

function setBackgroundRed() {
  document.body.style.backgroundColor = "#883333";
}

function useChromeFunction(func) {
  return () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func,
      });
    });
  };
}
