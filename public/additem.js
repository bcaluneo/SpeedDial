import { createMenuHTML, createItemHTML } from "./parser";
var enabled = false;
var modal = document.getElementById("add-item");
var createBtn = document.getElementById("create");
var closeBtn = document.getElementById("close");
var linkBtn = document.getElementById("link");
var menuBtn = document.getElementById("menu");
var urlBox = document.getElementById("linkURL");
export function isEnabled() {
    return enabled;
}
export function onClick(target) {
    if (target == closeBtn) {
        enabled = false;
        modal.style.display = "none";
    }
    else if (target.className == "container") {
        toggleURL(target.firstElementChild);
    }
    else if (target.className == "checkmark") {
        toggleURL(target.parentNode.firstElementChild);
    }
    else if (target == createBtn) {
        let newItem = null;
        if (urlBox.style.visibility == "visible") {
            newItem = createItemHTML("Test", urlBox.value);
        }
        else {
            newItem = createMenuHTML("Test", urlBox.value);
        }
        createItem(newItem);
    }
}
function createItem(newItem) {
    // if id != "", then it's a menu, get the corresponding one and add the item.
    // else get the parent and then add it. -- for now.
    // let elem:HTMLElement = getSelectedElement();
    // if (elem.id != "") {
    //   let menu:HTMLElement = document.getElementById(elem.id + "-menu");
    //   menu.appendChild(newItem);
    // } else {
    //   elem.parentNode.appendChild(newItem);
    // }
    // toggleCreating();
    // saveMenu();
}
function toggleURL(target) {
    if (target == linkBtn) {
        linkBtn.checked = true;
        menuBtn.checked = false;
        urlBox.style.visibility = "visible";
    }
    else {
        linkBtn.checked = false;
        menuBtn.checked = true;
        urlBox.style.visibility = "hidden";
    }
}
export function toggleCreating() {
    enabled = !enabled;
    if (enabled) {
        urlBox.textContent = "";
        modal.style.display = "block";
    }
    else {
        modal.style.display = "none";
    }
}
