const setBackgroundRedButton = document.querySelector(".set-bg-btn");

setBackgroundRedButton.addEventListener("click", clickBtn);

function setBackgroundRed() {
  document.body.style.backgroundColor = "#883333";
}

function clickBtn() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: setBackgroundRed,
    });
  });
}
