const { Clutter, Meta, St } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let snapLayoutsButton;

function init() {
  // Initialization code
}

function enable() {
  // Create a button in the top panel
  snapLayoutsButton = new St.Button({ style_class: 'panel-button', reactive: true, can_focus: true, track_hover: true });
  let icon = new St.Icon({ icon_name: 'view-grid-symbolic', style_class: 'system-status-icon' });
  snapLayoutsButton.set_child(icon);

  Main.panel._rightBox.insert_child_at_index(snapLayoutsButton, 0);

  snapLayoutsButton.connect('button-press-event', () => {
    let windows = global.get_window_actors().map(w => w.get_meta_window()).filter(w => w.get_window_type() == Meta.WindowType.NORMAL);
    if (windows.length > 0) {
      arrangeWindows(windows);
    }
  });
}

function disable() {
  // Remove the button from the panel
  if (snapLayoutsButton) {
    Main.panel._rightBox.remove_child(snapLayoutsButton);
    snapLayoutsButton.destroy();
    snapLayoutsButton = null;
  }
}

function arrangeWindows(windows) {
  let monitor = Main.layoutManager.primaryMonitor;
  let halfWidth = monitor.width / 2;
  let halfHeight = monitor.height / 2;

  for (let i = 0; i < windows.length; i++) {
    let window = windows[i];
    switch (i) {
      case 0:
        moveAndResizeWindow(window, monitor.x, monitor.y, halfWidth, monitor.height);
        break;
      case 1:
        moveAndResizeWindow(window, monitor.x + halfWidth, monitor.y, halfWidth, monitor.height);
        break;
      case 2:
        moveAndResizeWindow(window, monitor.x, monitor.y, halfWidth, halfHeight);
        break;
      case 3:
        moveAndResizeWindow(window, monitor.x + halfWidth, monitor.y, halfWidth, halfHeight);
        break;
      case 4:
        moveAndResizeWindow(window, monitor.x, monitor.y + halfHeight, halfWidth, halfHeight);
        break;
      case 5:
        moveAndResizeWindow(window, monitor.x + halfWidth, monitor.y + halfHeight, halfWidth, halfHeight);
        break;
      default:
        moveAndResizeWindow(window, monitor.x, monitor.y, monitor.width, monitor.height);
        break;
    }
  }
}

function moveAndResizeWindow(window, x, y, width, height) {
  // Use Meta API to move and resize the window
  window.move_frame(true, x, y);
  window.move_resize_frame(true, x, y, width, height);
}

