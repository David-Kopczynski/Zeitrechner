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
            if (additionalTime < 1) {
                let minutes = parseInt(additionalTime * 60);
                document.querySelector("#finishedTIME").innerText = minutes + (minutes != 1 ? " Minuten" : " Minute");
            } 
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
    var previousValue;

    document.querySelector("#amount").addEventListener("input", (e) => {
        // ignore if not a number
        if (/[^0-9]/.test(e.data)) e.target.value = e.target.value.replace(/[^0-9]/g, "");

        // update slider
        if (document.querySelector("#perHour").value < e.target.value * 2) document.querySelector("#perHour").max = e.target.value * 2;
        if (!document.querySelector("#numberPerHour").value || document.querySelector("#perHour").value == previousValue) {
            document.querySelector("#numberPerHour").value = e.target.value;
            document.querySelector("#perHour").value = e.target.value;
            document.querySelector("#perHour").max = e.target.value * 2;
        }
        previousValue = e.target.value

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
        if (document.querySelector("#perHour").max < e.target.value * 2 || !document.querySelector("#amount").value) document.querySelector("#perHour").max = e.target.value * 2;
        document.querySelector("#perHour").value = e.target.value;

        // update finish
        finishDate();
    });


    // Update per hour text
    updatePerHourNumber = () => {
        document.querySelector("#numberPerHour").value = document.querySelector("#perHour").value;
    } 
}