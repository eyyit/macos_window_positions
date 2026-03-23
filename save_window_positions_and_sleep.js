// Import the CoreGraphics framework to see across all macOS Spaces
ObjC.import('CoreGraphics');

// Default filepath for all scripts.
var home_dir = ObjC.unwrap($.NSHomeDirectory()).toString();
var filename = home_dir + '/.saved_window_positions';

var app = Application.currentApplication();
app.includeStandardAdditions = true;
var saved_positions = {};

// Use CoreGraphics to pull a list of ALL windows across ALL spaces
var windowList = $.CGWindowListCopyWindowInfo($.kCGWindowListOptionAll, $.kCGNullWindowID);
var windows = ObjC.deepUnwrap(windowList);

// Get a list of all visible applications to filter out background processes
var visible_apps = Application("System Events").applicationProcesses.whose({visible: true}).name();
var visible_apps_set = new Set(visible_apps); // Converted to a Set for faster lookup

// Loop through the CoreGraphics window list
for (var i = 0; i < windows.length; i++) {
    var win = windows[i];
    var layer = win.kCGWindowLayer;
    var appName = win.kCGWindowOwnerName;
    
    // Layer 0 denotes standard application windows. 
    // We also check if the app is actually visible/running.
    if (layer === 0 && visible_apps_set.has(appName)) {
        
        // Ensure the app object exists in our save state
        if (!saved_positions[appName]) {
            saved_positions[appName] = {};
        }

        // Handle cases where a window has no title
        var windowName = win.kCGWindowName || ("Unnamed_Window_" + win.kCGWindowNumber);
        var bounds = win.kCGWindowBounds;

        // Map CoreGraphics bounds (X, Y) to standard JXA bounds format (x, y) 
        // so your restore script doesn't break
        saved_positions[appName][windowName] = {
            "x": bounds.X,
            "y": bounds.Y,
            "width": bounds.Width,
            "height": bounds.Height
        };
    }
}

// Open a new file, overwrite if needed
var file = app.openForAccess(filename, { writePermission: true });
app.setEof(file, { to: 0 });

// Write json data to file
app.write(JSON.stringify(saved_positions), {to: file});
app.closeAccess(file);

// Kill caffeinate (Wrapped in a try-catch so the script doesn't abort if it's already dead)
var plist = home_dir + '/Library/LaunchAgents/com.user.caffeinate.plist';
try {
    app.doShellScript('/bin/launchctl unload ' + plist);
} catch (error) {
    // Silently continue if launchctl fails
}

// Sleep the computer
Application("System Events").sleep();
