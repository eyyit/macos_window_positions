// Default filepath for all scripts.
var home_dir = ObjC.unwrap($.NSHomeDirectory()).toString();
var filename = home_dir + '/.saved_window_positions';

var app = Application.currentApplication();
app.includeStandardAdditions = true;
var saved_positions = {};

// Get a list of all visible application's names
var app_list = Application("System Events").applicationProcesses.whose({visible: true}).name();

// Loop through all applications
for (app_num in app_list) {
  var app_name = app_list[app_num];
  saved_positions[app_name] = {};

  // Get a list of all windows for the current application
  var window_list = Application(app_name).windows;

  // loop through all windows for the current application
  for (window_num in window_list) {
    var window = window_list[window_num];
    var window_name = window_list[window_num].name();
    saved_positions[app_name][window_name] = window.bounds();
  }
}

// Open a new file, overwrite if needed
var file = app.openForAccess(filename, { writePermission: true });
app.setEof(file, { to: 0 });

// Write json data to file
app.write(JSON.stringify(saved_positions), {to: file});
app.closeAccess(file);

// Kill caffeinate
var plist = home_dir + '/Library/LaunchAgents/com.user.caffeinate.plist';
app.doShellScript('/bin/launchctl unload ' + plist);

// Sleep the computer
Application("System Events").sleep();
