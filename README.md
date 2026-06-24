# ticket-closed-
vibe coded edge/chromium extension that shoots confetti particles when you close a ticket in autotask

# Autotask Confetti

Adds configurable confetti when you close Autotask tickets (Save & Close), with a toolbar popup to tweak how wild the celebration gets.

## What it does

- Injects confetti into Autotask ticket pages via a content script.[web:228][web:236]
- Listens for the **Save & Close** button and fires confetti automatically.
- Provides a popup UI when you click the extension icon so you can:
  - Test confetti on the current ticket tab.
  - Adjust pieces, size, duration, physics, colours, and origin.

## Features

### Confetti behaviour

- **Trigger**
  - Fires when you click Autotask’s **Save & Close** button on a ticket.
  - Can be triggered manually via the **Test confetti now** button in the popup.

- **Origins**
  - **Top corners**: confetti falls from the top-left and top-right of the viewport.
  - **Bottom corners**: confetti launches upward from the bottom-left and bottom-right.

- **Physics mode**
  - Off: simple CSS-driven burst (pieces fall in a single transition).
  - On: physics-style burst using `requestAnimationFrame` for more natural motion (gravity, velocity, rotation).

### Customisation (popup settings)

All settings are stored with `chrome.storage.sync` so they persist across sessions and machines.[web:188][web:180]

- **Confetti pieces**
  - Controls how many pieces are created per burst.
  - Default: `200` (can be lowered for subtle or raised for chaos).

- **Confetti size**
  - Multiplier applied to the base size of each piece.
  - Example range: `0.5` (small) to `3.0` (very large).

- **Duration (ms)**
  - Base lifetime of the animation.
  - Lower values finish quickly; higher values keep pieces on screen longer.
  - Used to scale both the CSS transition duration and physics gravity/velocity.

- **Colour theme**
  - **Classic**: bright multi-colour palette.
  - **Pink pastel**: brighter pink pastel palette.
  - **Company**: brand colours
    - `rgb(76,119,223)`
    - `rgb(83,61,134)`
    - `rgb(236,54,115)`
    - plus lighter accent variants.

- **Origin**
  - **Top corners**: spawn from top-left/top-right.
  - **Bottom corners**: spawn from bottom-left/bottom-right.

- **Physics mode**
  - Checkbox: enable/disable the physics burst.

### Popup UI

- Dark-themed popup (`popup.html`) registered under the `action.default_popup` key in `manifest.json`.[web:235][web:230]
- Controls:
  - Number inputs for pieces, size multiplier, duration.
  - Select dropdowns for colour theme and origin.
  - Checkbox for physics mode.
  - **Save settings** button.
  - Status line showing save/test feedback.
  - **Test confetti now** button.
  - Helper text: “If testing doesn’t work, refresh the ticket tab and try again.”

### Implementation details

- **Manifest**
  - Uses Manifest V3.
  - Declares:
    - `action.default_popup` → `popup.html`
    - `content_scripts` for Autotask URLs (e.g. `https://ww16.autotask.net/*`).
    - `permissions`: `storage`.[web:188][web:235]

- **Storage**
  - `chrome.storage.sync` for:
    - `pieceCount`
    - `physicsEnabled`
    - `sizeMultiplier`
    - `durationMs`
    - `colorMode`
    - `originMode`

- **Content script (`content.js`)**
  - Guards against multiple injections (`window.__autotaskConfettiInstalled`).
  - Loads settings on start and listens for `chrome.storage.onChanged` to keep them in sync.[web:188][web:218]
  - Styles each piece with:
    - Fixed position.
    - Bright background colour from the selected palette.
    - Full opacity.
    - Rounded or pill shape.
    - Light “glow” via `box-shadow`.
  - Handles:
    - Simple burst with CSS transitions.
    - Physics burst with gravity, velocity, rotation.
    - Origin selection (top corners vs bottom corners).
    - Click detection on the Autotask **Save & Close** button.
    - Message listener (`chrome.runtime.onMessage`) for the popup’s test button.[web:228][web:225]

- **Popup script (`popup.js`)**
  - Reads settings via `chrome.storage.sync.get(defaults)` on load.
  - Writes settings via `chrome.storage.sync.set()` on Save.
  - Sends a message to the active tab using `chrome.tabs.sendMessage` for **Test confetti now**.[web:188][web:235]
  - Avoids relying on `chrome.runtime.lastError` for user-facing errors to prevent misleading warnings.

## Development / Usage

1. Load the extension
   - Go to `edge://extensions` (or `chrome://extensions`).
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the extension folder.

2. Configure
   - Click the extension icon in the toolbar to open the popup.
   - Set your desired:
     - Confetti pieces, size, duration.
     - Colour theme.
     - Origin mode.
     - Physics mode.
   - Click **Save settings**.

3. Test
   - Open an Autotask ticket page.
   - Use **Test confetti now** from the popup to verify the effect.
   - Use **Save & Close** on a ticket to see the confetti in normal operation.

4. Troubleshooting
   - If **Test confetti now** doesn’t do anything:
     - Ensure you’re on a ticket tab that matches the content script URL pattern.
     - Refresh the ticket tab and try again.
   - Use DevTools (F12) on the Autotask page and look for:
     - `Autotask Confetti content script loaded with settings { ... }` in the console.

## Folder structure

- `manifest.json` – extension metadata, popup registration, content script configuration.
- `content.js` – Autotask injection, confetti logic and settings.
- `popup.html` – dark-themed settings UI.
- `popup.js` – popup logic, storage, and messaging.
