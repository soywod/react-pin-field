/**
 * KeyboardEvent.key polyfill.
 *
 * @see https://github.com/soywod/keyboardevent-key-polyfill/blob/master/index.js
 */

const keyMap: { [key: number]: string | [string, string] } = {
  3: "Cancel",
  6: "Help",
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  28: "Convert",
  29: "NonConvert",
  30: "Accept",
  31: "ModeChange",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  41: "Select",
  42: "Print",
  43: "Execute",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  48: ["0", ")"],
  49: ["1", "!"],
  50: ["2", "@"],
  51: ["3", "#"],
  52: ["4", "$"],
  53: ["5", "%"],
  54: ["6", "^"],
  55: ["7", "&"],
  56: ["8", "*"],
  57: ["9", "("],
  91: "OS",
  93: "ContextMenu",
  106: "*",
  107: "+",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  181: "VolumeMute",
  182: "VolumeDown",
  183: "VolumeUp",
  186: [";", ":"],
  187: ["=", "+"],
  188: [",", "<"],
  189: ["-", "_"],
  190: [".", ">"],
  191: ["/", "?"],
  192: ["`", "~"],
  219: ["[", "{"],
  220: ["\\", "|"],
  221: ["]", "}"],
  222: ["'", '"'],
  224: "Meta",
  225: "AltGraph",
  246: "Attn",
  247: "CrSel",
  248: "ExSel",
  249: "EraseEof",
  250: "Play",
  251: "ZoomOut",
};

// Function keys (F1-24).

let i: number;
for (i = 1; i < 25; i += 1) {
  keyMap[111 + i] = "F" + i;
}

// Printable ASCII characters.

for (i = 65; i < 91; i += 1) {
  const letter = String.fromCharCode(i);
  keyMap[i] = [letter.toLowerCase(), letter.toUpperCase()];
}

// Numbers on numeric keyboard.

for (i = 96; i < 106; i += 1) {
  keyMap[i] = String.fromCharCode(i - 48);
}

/**
 * Find the key associated to a keyboard event.
 * Default to "Unidentified".
 */
export function getKeyFromKeyboardEvent(evt: KeyboardEvent): string {
  if (evt.key && evt.key !== "Unidentified") {
    return evt.key;
  }

  const key = keyMap[evt.which || evt.keyCode] || "Unidentified";

  if (Array.isArray(key)) {
    return key[+(evt.shiftKey || 0)];
  }

  return key;
}

export default {
  getKey: getKeyFromKeyboardEvent,
};
