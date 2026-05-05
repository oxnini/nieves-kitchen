# Install: Cooking-Themed Loading Phrases for Claude Code

Hey Claude — please install the cooking-themed status line below for me.

> **Heads up:** Claude Code's built-in "Thinking…" phrases aren't user-customizable. The closest thing is a custom **statusLine** — the line at the bottom of the terminal — which we *can* override. That's what we're installing here: a script that shows a random cooking phrase each time the status bar refreshes while Claude is working.

## What I want you to do

1. **Create the hook script** at `~/.claude/hooks/cooking-statusline.sh` with the contents below, then run `chmod +x ~/.claude/hooks/cooking-statusline.sh` to make it executable.

   ```bash
   #!/usr/bin/env bash
   # Cooking-themed status line for Claude Code.
   # Picks a random phrase each time the status bar refreshes.

   phrases=(
     "Simmering..."
     "Reducing the sauce..."
     "Toasting the spices..."
     "Caramelizing the onions..."
     "Letting the dough rest..."
     "Tempering the chocolate..."
     "Deglazing the pan..."
     "Folding in the flavor..."
     "Mise en place..."
     "Marinating overnight..."
     "Tasting as we go..."
     "Sharpening the knives..."
     "Skimming the stock..."
     "Proofing the dough..."
     "Whisking together..."
     "Reading the recipe twice..."
     "Finishing with flaky salt..."
     "Resting the meat..."
     "Plating up..."
     "Steeping..."
   )

   # Drain stdin — Claude Code pipes JSON to statusLine commands, but we don't need it.
   cat > /dev/null
   echo "${phrases[$((RANDOM % ${#phrases[@]}))]}"
   ```

2. **Register the script** in `~/.claude/settings.json`. If the file doesn't exist, create it with:

   ```json
   {
     "statusLine": {
       "type": "command",
       "command": "~/.claude/hooks/cooking-statusline.sh"
     }
   }
   ```

   If it already exists, merge the `statusLine` key into the existing JSON — don't overwrite the other keys.

3. **Sanity check** by running this in a terminal — it should print one of the cooking phrases:

   ```bash
   ~/.claude/hooks/cooking-statusline.sh < /dev/null
   ```

4. **Confirm back to me**: tell me where you wrote the script, that you `chmod +x`'d it, that you merged the `statusLine` key into `~/.claude/settings.json`, and that the sanity check printed a phrase.

After that I just need to start a fresh Claude Code session and the cooking phrases should show up at the bottom of the terminal. 🍳

---

## To add or remove phrases later

Just edit the `phrases=( ... )` array in `~/.claude/hooks/cooking-statusline.sh`. One quoted phrase per line. No other changes needed — Claude Code re-runs the script on every status refresh.
