# todo-list-app

A to-do list app built with plain HTML, CSS, and JavaScript — no frameworks, no build step. Tasks persist in `localStorage`.

## Usage

Open `index.html` in a browser. Type a task and press Enter (or click "Add Task") to add it. Check a task off to mark it complete, or click the ✕ to delete it.

## Tests

End-to-end tests with Playwright, run directly against the static file:

```
npm install
npx playwright install chromium
npx playwright test
```

Covers adding tasks (via button and Enter key), rejecting empty input, marking complete, deleting, and persistence across a reload.
