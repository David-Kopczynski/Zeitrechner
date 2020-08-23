const { app, BrowserWindow, dialog } = require("electron");
const electron = require("electron");
const ipc = electron.ipcMain;
const path = require("path");
const fs = require("fs");
const os = require("os");

function apppath() {
    return path.join(app.getAppPath(), ...arguments)
}

app.on("ready", function (event) {
    var mainWindow = new BrowserWindow({
        show: true,
		autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        },
        fullscreen: false,
        // Windows frame managment
        frame: false,
        backgroundColor: "#FFF",
        resizable: false,
        width: 550,
        height: 260
    });
	mainWindow.loadFile(path.join('app/index.html'));
});

ipc.on("loadJson", function (event, name) {
    fs.readFile(apppath("app/json", name), (err, jsonSettings) => {
        if (err) throw err;
        else event.returnValue = JSON.parse(jsonSettings);
    });
});

ipc.on("writeFile", function(event, content, filePath) {
    fs.writeFile(apppath(...filePath), content, function(err) {
        if (err) return console.log(err);
    });
});

ipc.on("readFile", function(event, filePath) {
    fs.readFile(apppath(...filePath), "utf-8", function(err, data) {
        if (err) return console.log(err);
        else event.returnValue = data;
    });
});

ipc.on('importFiles', function (event, searchName, searchTypes) {
    event.returnValue = dialog.showOpenDialogSync({
        properties: ['openFile', "multiSelections"],
        defaultPath: path.join(os.homedir(), "Desktop"),
        filters: [
            {
                name: searchName,
                extensions: searchTypes
            }
        ]
    });
});

ipc.on('exportFile', function (event, file, saveName, saveTypes) {
    var fileLocation = dialog.showSaveDialogSync({
        properties: [],
        defaultPath: path.join(os.homedir(), "Desktop"),
        filters: [
            {
                name: saveName,
                extensions: saveTypes
            }
        ]
    });

    fs.writeFileSync(fileLocation, file, "utf-8");
    event.returnValue = fileLocation;
});
