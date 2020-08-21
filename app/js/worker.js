const ipc = require("electron").ipcRenderer;
const win = require('electron').remote.getCurrentWindow();

const timeSettings = {
    day: "2-digit",
    weekday: "long",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
};

onLoad = () => {
    /* ---------- Basic window features ---------- */
    // Create minimise/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", function() {
        win.minimize();
    });
    document.getElementById('close-button').addEventListener("click", function() {
        win.close();
    });


    // Update finsih
    finishDate = () => {
        let additionalTime = (parseInt(document.querySelector("#amount").value) / document.querySelector("#numberPerHour").value);
        let date = new Date(new Date().getTime() + additionalTime * 1000 * 60 * 60).toLocaleDateString("de", timeSettings);

        if (date != "Invalid Date") {
            document.querySelector("#finished").innerText = date;
            if (additionalTime < 1) document.querySelector("#finishedTIME").innerText = parseInt(additionalTime * 60) + " Minuten";
            else document.querySelector("#finishedTIME").innerText = parseInt(additionalTime) + ":" + parseInt((additionalTime - parseInt(additionalTime)) * 60).toString().padStart(2, "0") + " Stunden";
        }
        else {
            document.querySelector("#finished").innerText = "-";
            document.querySelector("#finishedTIME").innerText = "-";
        }
    }   


    // Update Clock
    updateClock = () => {
        document.querySelector("#currentClock").innerText = new Date().toLocaleDateString("de", timeSettings);
        finishDate();
    }
    updateClock();

    setTimeout(() => {
        setInterval(updateClock, 1000 * 60); 
        updateClock();
    }, 60 * 1000 - (new Date().getSeconds() * 1000 + new Date().getMilliseconds())); // Wait for first time change -- perfect timing


    // Amount input
    document.querySelector("#amount").addEventListener("input", (e) => {
        // ignore if not a number
        if (/[^0-9]/.test(e.data)) e.target.value = e.target.value.replace(/[^0-9]/g, "");

        // update slider
        document.querySelector("#perHour").max = e.target.value;

        // update finish
        finishDate();
    });


    // Slider change per hour
    document.querySelector("#perHour").addEventListener("input", () => {
        // update slider value
        updatePerHourNumber();

        // update finish
        finishDate();
    });


    document.querySelector("#numberPerHour").addEventListener("input", (e) => {
        // ignore if not a number
        if (/[^0-9]/.test(e.data)) e.target.value = e.target.value.replace(/[^0-9\.]/g, "");

        // update slider
        document.querySelector("#perHour").value = e.target.value;

        // update finish
        finishDate();
    });


    // Update per hour text
    updatePerHourNumber = () => {
        if (document.querySelector("#amount").value) document.querySelector("#numberPerHour").value = document.querySelector("#perHour").value;
    } 
}