document.addEventListener("DOMContentLoaded", () => {
  const shortcutsContainer = document.getElementById("shortcuts");

  // 초기에 저장된 사용자 지정 단축키 불러오기
  chrome.storage.local.get(["customShortcuts"], (result) => {
    const customShortcuts = result.customShortcuts || {};

    for (let i = 1; i <= 9; i++) {
      const shortcut = customShortcuts[`Alt+Shift+Digit${i}`] || {};
      addShortcutInput(i, shortcut.text || "");
    }
  });

  function addShortcutInput(number, textValue) {
    const shortcutRow = document.createElement("div");
    shortcutRow.className = "shortcut-row";
    shortcutRow.innerHTML = `
      <label for="text${number}">Alt+Shift+${number}</label>
      <input type="text" id="text${number}" value="${textValue}" />
      <input type="hidden" id="shortcut${number}" value="Alt+Shift+Digit${number}" />
    `;
    shortcutsContainer.appendChild(shortcutRow);
  }

  document.getElementById("save").addEventListener("click", () => {
    const customShortcuts = {};

    // 입력된 단축키 저장
    const shortcutRows = document.querySelectorAll(".shortcut-row");
    shortcutRows.forEach((row) => {
      const number = row.querySelector("input[type=text]").id.match(/\d+/)[0];
      const textValue = document.getElementById(`text${number}`).value;
      const shortcutValue = document.getElementById(`shortcut${number}`).value;
      customShortcuts[shortcutValue] = {
        text: textValue,
        shortcut: shortcutValue,
      };
    });

    chrome.storage.local.set({ customShortcuts }, () => {
      chrome.runtime.sendMessage(
        { action: "customShortcutUpdated", shortcut: customShortcuts },
        (response) => {
          console.log("Message sent to background script:", response);
        }
      );
      alert("저장되었습니다.");
    });
  });
});
