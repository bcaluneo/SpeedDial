// All the source code and shit related to controlling the speed dials.
class DialContext {
    Dials;
}
;
class DialObject {
    Title;
    UUID;
    Clicks;
    Link;
}
;
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
    }
    else {
        json2html(localStorage.getItem("DialContext"));
    }
}
function createDialHTML(dial) {
    let div = document.createElement("div");
    div.className = "grid-item";
    div.id = dial.UUID;
    div.textContent = dial.Title;
    return div;
}
function json2html(json) {
    var dials = JSON.parse(json).DialContext.Dials;
    if (dials != undefined) {
        dials.forEach((dial) => {
            var dialHtml = createDialHTML(dial);
            dialGrid.appendChild(dialHtml);
        });
    }
}
