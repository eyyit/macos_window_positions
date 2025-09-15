# Set (Restore) and Save MacOS window positions

When I wake my laptop with external monitors plugged in, the previous window positions are not restored.  This automation will save and restore them.

`save_window_positions.js` will save positions to a local file.

`save_window_positions_and_sleep.js` will also save the window positions but also sleep the computer.

`set_window_positions.js` will restore the saved positions from the same file.

To enable these as commands in MacOS:

1. Open Automator app
2. Select Quick Action document type
3. Under `Workflow receives current`, select `no input` at the bottom of the list
4. On the left where the search icon is with the text `Name`, type in `Run Javascript`
5. Drag `Run Javascript` to the right and drop where it says `Drag actions or files here to build your workflow.`
6. Select all existing boilerplate code and paste in the script you want to use
7. File menu, Save
8. Type in the name you want to be displayed under every Application Services menu
9. Save `com.user.caffeinate.plist` to `~/Library/LaunchAgents/com.user.caffeinate.plist`
10. Set a keyboard shortcut using Application Services menu item `Services Settings...`


Credit to https://macmost.com/saving-and-recalling-window-positions-with-automator.html for the head start with this.  This code differs in that it also matches the window name (for multiple chrome windows for example).  It's also less user friendly in that it doesn't prompt for filename to save/read from, etc.  Use at your own risk.
