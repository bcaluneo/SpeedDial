import { html2json, createItemHTML, createMenuHTML, createSubMenuDIV, createMenuURL } from "./parser";
import { getMenuItem, hideSubMenus } from "./menu";
import { browser } from "webextension-polyfill-ts";
const contextMenu = document.getElementById("context-menu");
const editorMenu = document.getElementsByClassName("editor")[0];
var dragged, hovered;
var editing = false;
function setEditorPosition() {
    let editorTop = contextMenu.getBoundingClientRect().top - editorMenu.getBoundingClientRect().height - 4;
    let width = contextMenu.getBoundingClientRect().width - editorMenu.getBoundingClientRect().width;
    let editorLeft = contextMenu.getBoundingClientRect().left + width / 2;
    editorMenu.style.top = `${editorTop}px`;
    editorMenu.style.left = `${editorLeft}px`;
    editorMenu.style.visibility = "visible";
}
export function processClick(target) {
    let parent = target.parentNode;
    if (parent.id == "editor-control-export" || target.id == "editor-control-export") {
        downloadMenuJSON();
    }
}
export function onDragItem(event) {
    event.dataTransfer.setData('text/plain', null);
    let target = event.target;
    if (target.tagName == "A")
        dragged = target.parentNode;
    else
        dragged = target;
}
function isDraggingControl() {
    return dragged.id.substring("editor-control".length + 1).length != 0;
}
function isDraggedControl(check) {
    if (!isDraggingControl())
        return false;
    let control = dragged.id.substring("editor-control".length + 1);
    return control == check;
}
export function init() {
    document.addEventListener("dragend", function (event) {
        if (!isEditing())
            return;
        event.preventDefault();
    });
    document.addEventListener("dragover", function (event) {
        if (!isEditing())
            return;
        event.preventDefault();
        processDragOver(event.target);
    }, false);
    document.addEventListener("drop", function (event) {
        if (!isEditing())
            return;
        event.preventDefault();
        processDrop(event.target);
    }, false);
}
export function toggleEditing() {
    editing = !editing;
    if (!editing) {
        editorMenu.style.visibility = "hidden";
        contextMenu.style.borderColor = "#777474";
        saveMenu();
    }
    else {
        contextMenu.style.borderColor = "orange";
        setEditorPosition();
    }
}
export function isEditing() {
    return editing;
}
export function deleteItem(item, prompt = false) {
    let accept = true;
    if (prompt) {
        accept = confirm("Are you sure you want to delete this?");
    }
    if (accept) {
        let parent = item.parentNode;
        parent.removeChild(item);
        item = null;
        saveMenu();
    }
}
// TODO: This doesn't let you change the URL if it's a link item.
function renameItem(item) {
    let isMenu = item.id != "";
    let name = prompt("Edit item name", isMenu ? item.firstChild.textContent : item.textContent);
    if (name == null)
        return;
    if (isMenu) {
        item.firstChild.textContent = name;
    }
    else {
        item.firstElementChild.textContent = name;
    }
    saveMenu();
}
function createItem(parent) {
    let name = prompt("Item name");
    if (name == null)
        return;
    let url = prompt("Item URL");
    if (url == null)
        return;
    let div = createItemHTML(name, url);
    parent.appendChild(div);
    saveMenu();
}
function createMenu(parent) {
    let name = prompt("Item name");
    if (name == null)
        return;
    let div = createMenuHTML(name, name);
    let sdiv = createSubMenuDIV(name);
    parent.appendChild(div);
    parent.appendChild(sdiv);
    saveMenu();
}
export function saveMenu() {
    let json = html2json(contextMenu);
    localStorage.setItem("swamplinks", JSON.stringify(json));
}
function processDragOver(target) {
    target = getMenuItem(target);
    let isMenuItem = target.className == "item" || target.id == "context-menu" || target.className == "secondary-menu";
    let isInHeader = (target.tagName == "IMG" || target.tagName == "HR") && target.parentNode.className == "header";
    let isHeader = target.className == "header";
    if (isInHeader || isHeader)
        target = contextMenu;
    if (!(isMenuItem || isInHeader || isHeader)) {
        if (hovered != null) {
            hovered.style.background = "#3F3D3D";
            hovered = null;
        }
        return;
    }
    if (isDraggedControl("edit") && target.id == "context-menu" || target.id == "secondary-menu")
        return;
    if (hovered != null) {
        hovered.style.background = "#3F3D3D";
    }
    hovered = target;
    target.style.background = "#777474";
}
function processDrop(target) {
    if (hovered != null) {
        hovered.style.background = "#3F3D3D";
        hovered = null;
    }
    if (!dragged.id.startsWith("editor") && (target.id == "delete" || target.id == "delete-icon")) {
        if (dragged.id != "") {
            deleteItem(document.getElementById(dragged.id + "-menu"), true);
        }
        deleteItem(dragged, true);
        return;
    }
    let control = dragged.id.substring("editor-control".length + 1);
    target = getMenuItem(target);
    let isInHeader = (target.tagName == "IMG" || target.tagName == "HR") && target.parentNode.className == "header";
    let isHeader = target.className == "header";
    if (isInHeader || isHeader)
        target = contextMenu;
    let hasDroppedOntoItem = dragged.className == "item" && target.className == "item" && dragged != target;
    if (hasDroppedOntoItem) {
        if (dragged.parentNode.id == "context-menu")
            hideSubMenus();
        swapItems(target, dragged);
        saveMenu();
        return;
    }
    // prevents edit controls from being dropped onto other edit controls.
    if (control.length == 0 || !(target.className == "item" || target.id == "context-menu"))
        return;
    // prevents the context menu from being renamed (not sure what would happen).
    if (isDraggedControl("edit") && target == contextMenu)
        return;
    switch (control) {
        case "newMenu":
            if (target.id != "") {
                let actual = document.getElementById(target.id + "-menu");
                createMenu(actual == null ? target : actual);
            }
            break;
        case "newItem":
            if (target.id != "") {
                let actual = document.getElementById(target.id + "-menu");
                createItem(actual == null ? target : actual);
            }
            break;
        case "edit":
            renameItem(target);
            break;
    }
}
function swapItems(first, second) {
    if (first.parentNode != second.parentNode)
        return;
    let parent = first.parentNode;
    let firstCopy = first.cloneNode(true);
    let secondCopy = second.cloneNode(true);
    parent.insertBefore(firstCopy, second).addEventListener("dragstart", onDragItem);
    parent.insertBefore(secondCopy, first).addEventListener("dragstart", onDragItem);
    parent.removeChild(first);
    parent.removeChild(second);
}
function downloadMenuJSON() {
    var link = createMenuURL();
    let downloadPromise = browser.downloads.download({
        url: link,
        filename: 'Menu Configuration.json'
    });
    browser.downloads.onChanged.addListener((downloadDelta) => {
        URL.revokeObjectURL(link);
    });
}
