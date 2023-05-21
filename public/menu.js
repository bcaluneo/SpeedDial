const contextMenu = document.getElementById("context-menu");
export function isTargetInContextMenu(event) {
    let menuX = contextMenu.getBoundingClientRect().x;
    let menuY = contextMenu.getBoundingClientRect().y;
    let menuWidth = contextMenu.getBoundingClientRect().width;
    let menuHeight = contextMenu.getBoundingClientRect().height;
    let x = event.clientX;
    let y = event.clientY;
    return x >= menuX && x <= menuX + menuWidth && y >= menuY && y <= menuY + menuHeight;
}
// TODO, clean this up.
export function getMenuItem(target) {
    if (target.tagName == "I" && target.parentNode.parentNode.className != "editor")
        target = target.parentNode.parentNode;
    if (target.className == "menu-icon")
        target = target.parentNode;
    if (target.tagName == "A")
        target = target.parentNode;
    return target;
}
export function drawMenu(div, menu, isSubMenu) {
    let parent = menu.parentNode;
    let top = 0;
    let ix = Array.from(div.parentNode.children).indexOf(div) - 1;
    if (isSubMenu && parent.id != "context-menu")
        ix++;
    if (ix < 0)
        ix = 0;
    hideSubMenus();
    if (parent.id == "context-menu") {
        top = document.getElementsByClassName("header")[0].getBoundingClientRect().height + 7;
        menu.style.left = "155px";
    }
    else {
        top = div.clientTop - 1;
        menu.style.left = `${parent.clientWidth + 5}px`;
        makeParentsVisible(div);
    }
    top += div.getBoundingClientRect().height * ix;
    menu.style.top = `${top}px`;
    menu.style.visibility = "visible";
}
export function makeParentsVisible(div) {
    let parent = div.parentNode;
    do {
        parent.style.visibility = "visible";
        div = parent;
        parent = div.parentNode;
    } while (parent != null && parent.id != "context-menu");
}
export function calculateMenuIX(div) {
    let parent = div.parentNode;
    do {
        div = parent;
        parent = div.parentNode;
    } while (parent != null && parent.id != "context-menu");
    div = document.getElementById(`${div.id.split("-")[0]}`);
    return Array.from(div.parentNode.children).indexOf(div) - 1;
}
export function hideSubMenus() {
    let subMenus = document.getElementsByClassName("secondary-menu");
    [].forEach.call(subMenus, function (menu) {
        menu.style.visibility = "hidden";
    });
}
export function hideAllMenus() {
    contextMenu.classList.remove("visible");
    hideSubMenus();
}
