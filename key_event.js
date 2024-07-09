if (window == top) {
  const codes1_9 = [
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
  ];
  window.addEventListener("keydown", function (event) {
    if (event.altKey && event.shiftKey && codes1_9.includes(event.code)) {
      const pressedShortcut = `Alt+Shift+${event.code}`;

      chrome.storage.local.get(["customShortcuts"], (result) => {
        const shortcut = result?.customShortcuts?.[pressedShortcut] || {};
        if (!!shortcut?.text) {
          insertText(shortcut?.text);
        }
      });
    }
  });
}

// 입력 필드에 텍스트를 삽입하는 함수 예시
function insertText(text) {
  const activeElement = document.activeElement;

  if (activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName)) {
    const start = activeElement.selectionStart - 1;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;
    activeElement.value =
      value.substring(0, start) + text + value.substring(end);
    activeElement.setSelectionRange(start + text.length, start + text.length);
    activeElement.focus();
  }
}
