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

// <<===========||===========||===========||===========>>

const setBackgroundRedButton = document.querySelector(".set-bg-btn");

setBackgroundRedButton.addEventListener(
  "click",
  useChromeFunction(setBackgroundRed)
);

const setBackgroundRed = () =>
  (document.body.style.backgroundColor = "#883333");
