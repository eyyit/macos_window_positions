// Default filepath for all scripts.
var home_dir = ObjC.unwrap($.NSHomeDirectory()).toString();
var filename = home_dir + '/.saved_window_positions';

var app = Application.currentApplication();
app.includeStandardAdditions = true;

// get saved positions from file
var saved_positions = JSON.parse(app.read(Path(filename)));

var app_list = Application("System Events").applicationProcesses.whose({visible: true}).name();

// Loop through currently visible applications
for (app in app_list) {
  var app_name = app_list[app];
  // If the current app has no saved data, skip it
  if (! app_name in saved_positions) {
    continue;
  }
  var saved_windows = saved_positions[app_name];
  var app_windows = Application(app_name).windows;

  // Loop through saved windows and apply bounds to anything that matches.
  for (app_window in app_windows) {
    // Some windows don't have a .name() function (meaning they don't support applescript
    try {
      app_window_name = app_windows[app_window].name()
      if (app_window_name in saved_windows) {
        Application(app_name).windows[app_window].bounds = saved_windows[app_window_name];
      }
    } catch (e) {
      continue;
    }
  }
}

// Launch caffeinate
var plist = home_dir + '/Library/LaunchAgents/com.user.caffeinate.plist';
app.doShellScript('/bin/launchctl load ' + plist);
