import * as Parser from "./parser";
import * as Editor from "./editor";
import * as Dial from "./dial";
import * as Menu from "./menu";
import { setClock } from "./clock";
const APP_NAME = "Speed Dial";
const contextMenu = document.getElementById("context-menu");
setClock();
Parser.initMenu();
Dial.initGrid();
// Overwrites the default right-click handler to display my custom menu.
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (Editor.isEditing())
        return;
    Menu.hideAllMenus();
    if (event.target.className == "grid-item") {
    }
    else {
        contextMenu.style.top = `${event.clientY}px`;
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.classList.add("visible");
    }
});
document.addEventListener("click", (event) => {
    if (Editor.isEditing())
        event.preventDefault();
    let target = Menu.getMenuItem(event.target);
    let isHeader = target.className == "header";
    if (isHeader || target.id == "context-menu") {
        Menu.hideSubMenus();
    }
    if (target.className == "item") {
        let menu = document.getElementById(`${target.id}-menu`);
        if (menu != null && menu.childElementCount > 0) {
            Menu.hideSubMenus();
            if (menu.style.visibility == "hidden") {
                Menu.drawMenu(target, menu, menu.className == "secondary-menu");
            }
            else {
                menu.style.visibility = "hidden";
            }
            return;
        }
        if (!Editor.isEditing()) {
            if (target.id == "") {
                let link = target.firstElementChild;
                window.location.href = link.href;
            }
            return;
        }
    }
    else {
        let parent = target.parentNode;
        if (parent.className == "header" && target.tagName == "IMG") {
            Editor.toggleEditing();
            Menu.hideSubMenus();
            return;
        }
        if (!Editor.isEditing()) {
            // make this its own function
            let id = "";
            if (target.className == "grid-item") {
                id = target.id;
            }
            else if (target.tagName == "IMG") {
                id = parent.parentNode.id;
            }
            else if (target.tagName == "A") {
                let child = target.firstElementChild;
                id = child.id;
            }
            if (id != "") {
                let clickVariable = localStorage.getItem(`dial${id}-clicks`);
                if (clickVariable == null) {
                    localStorage.setItem(`dial${id}-clicks`, "1");
                }
                else {
                    let clickCount = +clickVariable;
                    clickCount++;
                    localStorage.setItem(`dial${id}-clicks`, `${clickCount}`);
                }
            }
            if (!Menu.isTargetInContextMenu(event))
                Menu.hideAllMenus();
        }
        else {
            Editor.processClick(target);
        }
    }
});
