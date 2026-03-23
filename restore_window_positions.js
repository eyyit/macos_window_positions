var home_dir = ObjC.unwrap($.NSHomeDirectory()).toString();
var filename = home_dir + '/.saved_window_positions';

var app = Application.currentApplication();
app.includeStandardAdditions = true;

// get saved positions from file
var saved_positions = JSON.parse(app.read(Path(filename)));

var sys_events = Application('System Events');
var app_list = sys_events.applicationProcesses.whose({
  visible: true
}).name();

// Loop through currently visible applications
for (var i = 0; i < app_list.length; i++) {
  var app_name = app_list[i];

  // If the current app has no saved data, skip it
  if (!(app_name in saved_positions)) {
    continue;
  }
  
  var saved_windows = saved_positions[app_name];
  var target_app = Application(app_name);
  var app_windows = target_app.windows;

  // Loop through saved windows and apply bounds to anything that matches.
  for (var j = 0; j < app_windows.length; j++) {
    // Some windows lack a .name() function or throw an error
    try {
      var app_window_name = app_windows[j].name();
      if (app_window_name in saved_windows) {
        target_app.windows[j].bounds = saved_windows[app_window_name];
      }
    } catch (e) {
      continue;
    }
  }
}
