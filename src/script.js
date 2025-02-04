/**
 *
 * @param {function} func
 * @param {array} args
 * @returns {function}
 */
async function executeChromeFunction(func, args) {
  await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func,
      args,
    });
  });
}

executeChromeFunction(() => {
  window.useStyleState = (element) => {
    element.dataset.elementModified = true;
    if (element.dataset.originalStyle === undefined)
      element.dataset.originalStyle = element.style.cssText;

    const setStyle = (propertyName, value) => {
      element.style[propertyName] = value;
    };

    return setStyle;
  };
  window.useAttributeState = (element) => {
    element.dataset.elementModified = true;
    const setAttribute = (attributeName, value) => {
      if (element.dataset.originalAttribute === undefined)
        element.dataset.originalAttribute = JSON.stringify({
          attributeName,
          value: element[attributeName],
        });
      element[attributeName] = value;
    };

    return setAttribute;
  };
});
// >>=====>>====>>====#[<| EFFECTS |>]#====<<====<<=====<<

const clearEffectsButton = document.getElementById("clear-effects");

clearEffectsButton.addEventListener("click", () => {
  executeChromeFunction(() => {
    const modifiedElements = document.querySelectorAll(
      '*[data-element-modified="true"]'
    );
    modifiedElements.forEach((element) => {
      element.dataset.elementModified = undefined;
      if (element.dataset.originalStyle !== undefined)
        element.style.cssText = element.dataset.originalStyle;

      if (element.dataset.originalAttribute !== undefined) {
        const originalAttribute = JSON.parse(element.dataset.originalAttribute);
        element[originalAttribute.attributeName] = originalAttribute.value;
      }
    });
  });
});

// <<===========||===========||===========||===========>>

const setBackgroundRedButton = document.querySelector(".set-bg-btn");

const setBackgroundRed = () => {
  const setBodyStyle = window.useStyleState(document.body);
  setBodyStyle("backgroundColor", "#883333");
};

setBackgroundRedButton.addEventListener("click", () =>
  executeChromeFunction(setBackgroundRed)
);

// <<===========||===========||===========||===========>>

const setLinkColorButton = document.querySelector(".set-link-color");
const linkColorInput = document.querySelector(".link-color-input");

function setLinkColor(color) {
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    const setLinkColor = window.useStyleState(link);
    setLinkColor("color", color);
  });
}

setLinkColorButton.addEventListener("click", () =>
  executeChromeFunction(setLinkColor, [linkColorInput.value])
);

// <<===========||===========||===========||===========>>

const deleteImagesButton = document.querySelector(".delete-images-btn");

function deleteAllImages() {
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => {
    const setImageDisplay = window.useStyleState(img);
    setImageDisplay("display", "none");
  });
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
    const setType = window.useAttributeState(input);
    setType("type", type);
    input.setAttribute("is_pass", arePasswordsShown);
  });
}

toggleDisplayPasswordsButton.addEventListener("click", () => {
  passwordsAreShown = !passwordsAreShown;
  executeChromeFunction(togglePasswordDisplay, [passwordsAreShown]);
});

// <<===========||===========||===========||===========>>

const showMenuButton = document.querySelector(".show-menu-btn");

showMenuButton.addEventListener("click", async () => {
  if (showMenuButton.disabled) return;
  showMenuButton.disabled = true;
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.insertCSS({
    target: {
      tabId: tab.id,
    },
    files: ["menu.css"],
  });
  const menuStyles = `
  <style>
  ${await (await fetch("./menu.css")).text()}
  </style>
  `;
  const menuComponent = await (await fetch("./menu.html")).text();
  executeChromeFunction(
    (menu, menuStyle) => {
      document.body.innerHTML = menu + document.body.innerHTML;
      document.head.innerHTML += menuStyle;
    },
    [menuComponent, menuStyles]
  );
});
