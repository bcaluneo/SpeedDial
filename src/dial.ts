// All the source code and shit related to controlling the speed dials.

import {v4 as uuidv4} from 'uuid';

class DialContext {
    Dials: DialObject[];
};

class DialObject {
    Title: string;
    UUID: string;
    Clicks: number;
    Link: string;
};

const dialGrid = document.getElementById("dial-grid");

// <div id="0" class="grid-item">
// HackForums
// </div>

export function initGrid() {
    if (localStorage.getItem("DialContext") == null) {
        fetch('public/dials.json')
        .then(response => response.text())
        .then(responseText => {
          let json = JSON.parse(responseText);
          localStorage.setItem("DialContext", JSON.stringify(json));
          json2html(localStorage.getItem("DialContext"));
        });
    } else {
        json2html(localStorage.getItem("DialContext"));
    }
}

function createDialHTML(dial: DialObject) {
    let div: HTMLElement = document.createElement("div");
    div.className = "grid-item";
    div.id = dial.UUID;
    div.textContent = dial.Title;
    return div;
}

function json2html(json: string) {
    var dials: DialObject[] = JSON.parse(json).DialContext.Dials;

    if (dials != undefined) {
        dials.forEach((dial: DialObject) => {
            var dialHtml = createDialHTML(dial);
            dialGrid.appendChild(dialHtml);
        });
    }
}