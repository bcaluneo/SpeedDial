import { deleteItem } from "./editor";
var dragged;
export function onDragDial(event) {
    event.dataTransfer.setData('text/plain', null);
    dragged = event.target;
    console.log("dragging");
    console.log(dragged);
}
export function getDraggedElement() {
    return dragged;
}
export function init() {
    document.addEventListener("dragend", function (event) {
        event.preventDefault();
    });
    document.addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);
    document.addEventListener("drop", function (event) {
        event.preventDefault();
        var div = event.target;
        if (div.id == "delete" || div.id == "delete-icon") {
            deleteItem(dragged);
        }
    }, false);
}
