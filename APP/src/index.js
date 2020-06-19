const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');
//electron filesystem access
if (require('electron-squirrel-startup')) {
  app.quit();
}
//package markup
const createWindow = () => {
  //main window of the app
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    webPreferences: {
      nodeIntegration: true //node.js access
    }
  });
  mainWindow.setMenuBarVisibility(false) //hiding the menu bar
  mainWindow.loadFile(path.join(__dirname, 'index.html')); //template engine loader

};

app.on('ready', createWindow);
//main menu function
app.on('window-all-closed', () => {
  //killswitch
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  //startup
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});