---
name: feedback-ios-input-auto-zoom
description: Mobile text inputs must be at least 16px font-size or iOS Safari auto-zooms the viewport on focus with no way back; pattern is text-base sm:text-sm
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 44414eec-ba9f-41fe-b913-401bb1113fb0
---

Any `<input>`, `<textarea>`, or contenteditable element rendered on a page that mobile users hit must have computed `font-size >= 16px`. If it doesn't, iOS Safari (and Chrome on iOS, which uses WebKit) zooms the viewport in when the field receives focus, and the user is stuck zoomed — every `fixed`/`absolute` layer breaks: drawers slide in mis-sized, FABs overlap inputs, full-page modals look clipped.

**Why:** The user hit this on `MapSearch` after M8 promoted the search pill to mobile. `text-sm` (14px) on the input triggered the bug; fix in `347f8fd` switched to `text-base sm:text-sm`. They explicitly flagged it as "the whole page is kind of zoomed in for some reason, and you have to zoom out in order to see the whole recipe box".

**How to apply:** When adding or reviewing any text input that mobile users will see, prefer `text-base sm:text-sm` (16px on mobile, 14px on desktop) or pin to `text-[16px]`. Audit existing inputs whenever you touch a mobile flow. This applies to filter searches, recipe search forms, comment fields, dialogs — anywhere the user can focus a text field on a phone.
