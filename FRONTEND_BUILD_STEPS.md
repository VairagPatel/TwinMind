# TwinMind Live Suggestions - Frontend Build Steps

## Overview
Single-page HTML application with no dependencies, no build step, no frameworks - pure HTML + CSS + vanilla JavaScript.

## Step 1: HTML Structure Setup

### 1.1 Create the base HTML document
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TwinMind — Live Suggestions</title>
</head>
<body>
</body>
</html>
```

### 1.2 Add CSS variables for theming
Define all color tokens in `:root`:
- `--bg: #0f1115` (page background)
- `--panel: #171a21` (card background)
- `--panel-2: #1d212a` (inner elements)
- `--border: #272c38`
- `--text: #e7e9ee`
- `--muted: #8a93a6`
- `--accent: #6ea8fe` (blue)
- `--accent-2: #b388ff` (purple)
- `--good: #4ade80` (green)
- `--warn: #fbbf24` (yellow)
- `--danger: #ef4444` (red)

### 1.3 Create the top bar
```html
<div class="topbar">
  <h1>TwinMind — Live Suggestions</h1>
  <div class="meta">3-column layout · Transcript · Live Suggestions · Chat</div>
</div>
```

### 1.4 Create the 3-column grid layout
```html
<div class="layout">
  <!-- Column 1: Mic & Transcript -->
  <div class="col">...</div>
  
  <!-- Column 2: Live Suggestions -->
  <div class="col">...</div>
  
  <!-- Column 3: Chat -->
  <div class="col">...</div>
</div>
```

## Step 2: Column 1 - Mic & Transcript

### 2.1 Structure
```html
<div class="col">
  <header>
    <span>1. Mic & Transcript</span>
    <span id="recState">idle</span>
  </header>
  <div class="mic-wrap">
    <button id="micBtn" class="mic-btn">●</button>
    <div class="mic-status" id="micStatus">Click mic to start recording</div>
  </div>
  <div class="body" id="transcriptBody">
    <div class="empty" id="transcriptEmpty">No transcript yet — start the mic.</div>
  </div>
</div>
```

### 2.2 Styling
- Mic button: 44px circular button, blue when idle, red with pulse animation when recording
- Transcript lines: timestamp prefix + text content
- Auto-scroll to bottom when new chunks added
- Fade-in animation for new transcript lines

### 2.3 JavaScript Logic
- Toggle recording state on mic button click
- Add transcript chunks every 30 seconds while recording
- Format timestamps as HH:MM:SS
- Auto-scroll transcript area to bottom
- Cycle through 5 hardcoded transcript chunks

## Step 3: Column 2 - Live Suggestions

### 3.1 Structure
```html
<div class="col">
  <header>
    <span>2. Live Suggestions</span>
    <span id="batchCount">0 batches</span>
  </header>
  <div class="reload-row">
    <button class="reload-btn" id="reloadBtn">↻ Reload suggestions</button>
    <span class="countdown" id="countdown">auto-refresh in 30s</span>
  </div>
  <div class="body" id="suggestionsBody">
    <div class="empty" id="suggestionsEmpty">Suggestions appear here once recording starts.</div>
  </div>
</div>
```

### 3.2 Suggestion Card Structure
Each suggestion card contains:
- Tag (question/talking/answer/fact) with color-coded background
- Title text
- Click handler to send to chat

### 3.3 Styling
- Fresh batch: highlighted with accent border
- Stale batches: 55% opacity
- Batch divider: centered text with timestamp
- Tag colors:
  - Question → blue (--accent)
  - Talking point → purple (--accent-2)
  - Answer → green (--good)
  - Fact-check → yellow (--warn)

### 3.4 JavaScript Logic
- Generate 3 suggestion cards per batch
- Insert new batches at the top
- Mark previous batches as stale
- Auto-refresh every 30 seconds (countdown timer)
- Manual reload button resets countdown
- Cycle through 3 hardcoded suggestion batches

## Step 4: Column 3 - Chat

### 4.1 Structure
```html
<div class="col">
  <header>
    <span>3. Chat (detailed answers)</span>
    <span>session-only</span>
  </header>
  <div class="body" id="chatBody">
    <div class="empty" id="chatEmpty">Click a suggestion or type a question below.</div>
  </div>
  <div class="chat-input-row">
    <input id="chatInput" placeholder="Ask anything…" />
    <button id="chatSend">Send</button>
  </div>
</div>
```

### 4.2 Message Structure
- User messages: "You" label + blue-tinted bubble
- Assistant messages: "Assistant" label + neutral bubble
- When from suggestion: "You · [Tag Type]" label

### 4.3 Styling
- User bubble: blue tinted background with blue border
- Assistant bubble: neutral background with border
- Auto-scroll to bottom on new messages

### 4.4 JavaScript Logic
- Clicking suggestion card → adds to chat as user message → triggers assistant reply (600ms delay)
- Manual text input → adds as user message → triggers assistant reply
- Enter key also sends message
- Simulated assistant responses reference the question

## Step 5: JavaScript State Management

### 5.1 Global State Variables
```javascript
let recording = false;
let transcriptIdx = 0;
let batchIdx = 0;
let countdown = 30;
let recordingTimer = null;
let countdownTimer = null;
```

### 5.2 Demo Data Arrays
- `transcriptChunks`: 5 hardcoded transcript lines about backend scaling
- `suggestionBatches`: 3 batches, each with 3 suggestions (question/talking/answer/fact)

### 5.3 Timer Management
- Transcript timer: adds chunk every 30 seconds
- Countdown timer: ticks every 1 second, triggers batch at 0
- Clear all timers when recording stops

## Step 6: Interactions & Acceptance Criteria

### 6.1 Mic Button
- WHEN clicked THEN toggle recording state
- WHEN recording starts THEN begin transcript and suggestion timers
- WHEN recording stops THEN clear all timers

### 6.2 Transcript
- WHEN recording THEN add chunk every 30 seconds
- WHEN chunk added THEN auto-scroll to bottom
- WHEN 2 chunks added THEN auto-generate suggestion batch

### 6.3 Suggestions
- WHEN 30 seconds elapse THEN auto-add new batch
- WHEN reload clicked THEN immediately add batch and reset countdown
- WHEN new batch added THEN mark previous batches as stale
- WHEN card clicked THEN send to chat

### 6.4 Chat
- WHEN suggestion clicked THEN add as user message with tag label
- WHEN user message sent THEN trigger assistant reply after 600ms
- WHEN Enter pressed THEN send message
- WHEN message added THEN auto-scroll to bottom

## Step 7: CSS Grid Layout

### 7.1 Grid Configuration
```css
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px;
  height: calc(100vh - 46px);
}
```

### 7.2 Column Flex Layout
```css
.col {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.col .body {
  flex: 1;
  overflow-y: auto;
}
```

## Step 8: Animations

### 8.1 Pulse Animation (Recording Mic)
```css
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}
```

### 8.2 Fade-in Animation (New Transcript)
```css
@keyframes fadein {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}
```

## Step 9: Testing Checklist

- [ ] Mic button toggles recording state
- [ ] Transcript chunks appear every 30s while recording
- [ ] Suggestion batches auto-generate every 30s
- [ ] Reload button immediately adds new batch
- [ ] Countdown timer displays and counts down
- [ ] Clicking suggestion sends to chat
- [ ] Manual chat input works
- [ ] Enter key sends chat message
- [ ] Assistant replies appear after 600ms
- [ ] All areas auto-scroll to bottom
- [ ] Fresh batches highlighted, stale batches faded
- [ ] No horizontal scroll
- [ ] Layout fills 100vh
- [ ] All interactions work without page refresh

## Step 10: Delivery

### 10.1 File Requirements
- Single HTML file: `twinmind-live.html`
- No external dependencies
- No build step required
- No localStorage or fetch calls
- All state in-memory only

### 10.2 Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- ES6 JavaScript features used

### 10.3 File Size
- Approximately 10-12 KB uncompressed
- Inline CSS and JavaScript
- No images or external assets
