import { html2json, createItemHTML, createMenuHTML, createSubMenuDIV, createMenuURL } from "./parser";
import { getMenuItem, hideSubMenus } from "./menu";
import { browser, Downloads } from "webextension-polyfill-ts";

const contextMenu = document.getElementById("context-menu");
const editorMenu: HTMLElement = document.getElementsByClassName("editor")[0] as HTMLElement;

var dragged: HTMLElement, hovered: HTMLElement;
var editing: boolean = false;

function setEditorPosition(): void {
  let editorTop: number = contextMenu.getBoundingClientRect().top - editorMenu.getBoundingClientRect().height - 4;
  let width: number = contextMenu.getBoundingClientRect().width - editorMenu.getBoundingClientRect().width;
  let editorLeft: number = contextMenu.getBoundingClientRect().left + width / 2;

  editorMenu.style.top = `${editorTop}px`;
  editorMenu.style.left = `${editorLeft}px`;
  editorMenu.style.visibility = "visible";
}

export function processClick(target: HTMLElement) {
  let parent:HTMLElement = target.parentNode as HTMLElement;
  if (parent.id == "editor-control-export" || target.id == "editor-control-export") {
    downloadMenuJSON();
  }
}

export function onDragItem(event: DragEvent): void {
  event.dataTransfer.setData('text/plain', null);
  let target: HTMLElement = event.target as HTMLElement;
  
  if (target.tagName == "A") dragged = target.parentNode as HTMLElement;
  else dragged = target;
}

function isDraggingControl(): boolean {
  return dragged.id.substring("editor-control".length + 1).length != 0;
}

function isDraggedControl(check: string): boolean {
  if (!isDraggingControl()) return false;
  let control: string = dragged.id.substring("editor-control".length + 1);
  return control == check;
}

export function init(): void {
  document.addEventListener("dragend", function (event: DragEvent) {
    if (!isEditing()) return;
    event.preventDefault();
  });

  document.addEventListener("dragover", function (event: DragEvent) {
    if (!isEditing()) return;
    event.preventDefault();
    processDragOver(event.target as HTMLElement);
  }, false);

  document.addEventListener("drop", function (event: DragEvent) {
    if (!isEditing()) return;
    event.preventDefault();
    processDrop(event.target as HTMLElement);
  }, false);
}

export function toggleEditing(): void {
  editing = !editing;

  if (!editing) {
    editorMenu.style.visibility = "hidden";
    contextMenu.style.borderColor = "#777474";
    saveMenu();
  } else {
    contextMenu.style.borderColor = "orange";
    setEditorPosition();
  }
}

export function isEditing(): boolean {
  return editing;
}

export function deleteItem(item: HTMLElement, prompt: boolean = false): void {
  let accept: boolean = true;
  if (prompt) {
    accept = confirm("Are you sure you want to delete this?");
  }

  if (accept) {
    let parent: HTMLElement = item.parentNode as HTMLElement;
    parent.removeChild(item);
    item = null;
    saveMenu();
  }
}

// TODO: This doesn't let you change the URL if it's a link item.
function renameItem(item: HTMLElement): void {
  let isMenu: boolean = item.id != "";
  let name: string = prompt("Edit item name", isMenu ? item.firstChild.textContent : item.textContent);
  if (name == null) return;

  if (isMenu) {
    item.firstChild.textContent = name;
  } else {
    item.firstElementChild.textContent = name;
  }

  saveMenu();
}

function createItem(parent: HTMLElement): void {
  let name: string = prompt("Item name");
  if (name == null) return;

  let url: string = prompt("Item URL");
  if (url == null) return;

  let div: HTMLElement = createItemHTML(name, url);
  parent.appendChild(div);

  saveMenu();
}

function createMenu(parent: HTMLElement): void {
  let name: string = prompt("Item name");
  if (name == null) return;

  let div: HTMLElement = createMenuHTML(name, name);
  let sdiv: HTMLElement = createSubMenuDIV(name);
  parent.appendChild(div);
  parent.appendChild(sdiv);

  saveMenu();
}

export function saveMenu(): void {
  let json = html2json(contextMenu);
  localStorage.setItem("swamplinks", JSON.stringify(json));
}

function processDragOver(target: HTMLElement): void {
  target = getMenuItem(target);

  let isMenuItem: boolean = target.className == "item" || target.id == "context-menu" || target.className == "secondary-menu";
  let isInHeader: boolean = (target.tagName == "IMG" || target.tagName == "HR") && (target.parentNode as HTMLElement).className == "header";
  let isHeader: boolean = target.className == "header";

  if (isInHeader || isHeader) target = contextMenu;

  if (!(isMenuItem || isInHeader || isHeader)) {
    if (hovered != null) {
      hovered.style.background = "#3F3D3D";
      hovered = null;
    }

    return;
  }

  if (isDraggedControl("edit") && target.id == "context-menu" || target.id == "secondary-menu") return;

  if (hovered != null) {
    hovered.style.background = "#3F3D3D";
  }

  hovered = target;
  target.style.background = "#777474";
}

function processDrop(target: HTMLElement): void {
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

  let control: string = dragged.id.substring("editor-control".length + 1);
  target = getMenuItem(target);

  let isInHeader: boolean = (target.tagName == "IMG" || target.tagName == "HR") && (target.parentNode as HTMLElement).className == "header";
  let isHeader: boolean = target.className == "header";
  if (isInHeader || isHeader) target = contextMenu;
  
  let hasDroppedOntoItem: boolean = dragged.className == "item" && target.className == "item" && dragged != target;
  if (hasDroppedOntoItem) {
    if ((dragged.parentNode as HTMLElement).id == "context-menu") hideSubMenus();
    swapItems(target, dragged);
    saveMenu();
    return;
  }

  // prevents edit controls from being dropped onto other edit controls.
  if (control.length == 0 || !(target.className == "item" || target.id == "context-menu")) return;

  // prevents the context menu from being renamed (not sure what would happen).
  if (isDraggedControl("edit") && target == contextMenu) return;

  switch (control) {
    case "newMenu":
      if (target.id != "") {
        let actual: HTMLElement = document.getElementById(target.id + "-menu");
        createMenu(actual == null ? target : actual);
      }

      break;
    case "newItem":
      if (target.id != "") {
        let actual: HTMLElement = document.getElementById(target.id + "-menu");
        createItem(actual == null ? target : actual);
      }

      break;
    case "edit":
      renameItem(target);
      break;
  }
}

function swapItems(first: HTMLElement, second: HTMLElement): void {
  if (first.parentNode != second.parentNode) return;

  let parent: HTMLElement = first.parentNode as HTMLElement;
  let firstCopy: HTMLElement = first.cloneNode(true) as HTMLElement;
  let secondCopy: HTMLElement = second.cloneNode(true) as HTMLElement;

  parent.insertBefore(firstCopy, second).addEventListener("dragstart", onDragItem);
  parent.insertBefore(secondCopy, first).addEventListener("dragstart", onDragItem);

  parent.removeChild(first);
  parent.removeChild(second);
}

function downloadMenuJSON(): void {
  var link: string = createMenuURL();

  let downloadPromise = browser.downloads.download({
    url : link,
    filename : 'Menu Configuration.json'
  });

  browser.downloads.onChanged.addListener((downloadDelta: Downloads.OnChangedDownloadDeltaType) => {
    URL.revokeObjectURL(link);
  });
}