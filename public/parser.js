import * as Editor from "./editor";
const contextMenu = document.getElementById("context-menu");
class MenuJson {
    menus;
}
;
class MenuObject {
    type;
    parentId;
    id;
    items;
}
;
class ItemObject {
    id;
    text;
    link;
}
;
export function initMenu() {
    if (localStorage.getItem("MenuContext") == null) {
        fetch('public/swamplinks.json')
            .then(response => response.text())
            .then(responseText => {
            let json = JSON.parse(responseText);
            localStorage.setItem("MenuContext", JSON.stringify(json));
            json2html(localStorage.getItem("MenuContext"));
        });
    }
    else {
        json2html(localStorage.getItem("MenuContext"));
    }
    Editor.init();
    document.getElementById("editor-control-edit").addEventListener("dragstart", Editor.onDragItem);
    document.getElementById("editor-control-newMenu").addEventListener("dragstart", Editor.onDragItem);
    document.getElementById("editor-control-newItem").addEventListener("dragstart", Editor.onDragItem);
}
export function items2html(parent, items) {
    items = items.reverse();
    [].forEach.call(items, function (item) {
        let div;
        if (item.link != "") {
            div = createItemHTML(item.text, item.link);
        }
        else {
            div = createMenuHTML(item.text, item.id);
        }
        div.addEventListener("dragstart", Editor.onDragItem);
        div.draggable = true;
        parent.prepend(div);
    });
}
export function createItemHTML(text, link) {
    let div = document.createElement("div");
    let a = document.createElement("a");
    div.className = "item";
    a.href = link;
    a.textContent = text;
    div.addEventListener("dragstart", Editor.onDragItem);
    div.draggable = true;
    div.appendChild(a);
    div.style.cursor = "pointer";
    return div;
}
export function createMenuHTML(text, menuID) {
    let div = document.createElement("div");
    div.className = "item";
    div.id = menuID;
    div.textContent = text;
    let iconDiv = document.createElement("div");
    let icon = document.createElement("i");
    iconDiv.style.textAlign = "right";
    iconDiv.className = "menu-icon";
    icon.className = "material-icons";
    icon.textContent = "keyboard_double_arrow_right";
    iconDiv.appendChild(icon);
    div.appendChild(iconDiv);
    div.addEventListener("dragstart", Editor.onDragItem);
    div.draggable = true;
    return div;
}
export function createSubMenuDIV(menuID) {
    let div = document.createElement("div");
    div.className = "secondary-menu";
    div.id = menuID + "-menu";
    return div;
}
export function createSubMenuHTML(divId, items) {
    let div = document.createElement("div");
    div.id = divId;
    div.className = "secondary-menu";
    items2html(div, items);
    return div;
}
export function json2html(json) {
    let obj = JSON.parse(json);
    let contextMenus = obj.menus;
    let header = document.createElement("div");
    let fox = document.createElement("img");
    let hr = document.createElement("hr");
    let topHr = document.createElement("hr");
    fox.src = "public/assets/fox.png";
    header.className = "header";
    header.appendChild(fox);
    header.appendChild(hr);
    header.prepend(topHr);
    while (contextMenus.length > 0) {
        [].forEach.call(contextMenus, function (menu, index) {
            if (menu.type == "context-menu") {
                items2html(contextMenu, menu.items);
                contextMenu.prepend(header);
                contextMenus.splice(index, 1);
            }
            else {
                let parentDiv = document.getElementById(menu.parentId);
                if (parentDiv != null) {
                    let menuDiv = createSubMenuHTML(menu.id, menu.items);
                    parentDiv.appendChild(menuDiv);
                    contextMenus.splice(index, 1);
                }
            }
        });
    }
}
function div2json(json, div) {
    let result = new MenuObject();
    let subMenus = div.getElementsByClassName("secondary-menu");
    let items = div.getElementsByClassName("item");
    result.items = [];
    if (div.id == "context-menu") {
        result.type = "context-menu";
        result.parentId = "context-menu";
        result.id = "context-menu";
    }
    else {
        result.type = "secondary-menu";
        result.parentId = div.parentNode.id;
        result.id = div.id;
    }
    Array.from(items).forEach(function (item) {
        if (item.parentNode != div)
            return;
        let itemObj = {};
        itemObj.id = item.id;
        itemObj.text = item.textContent.replace("keyboard_double_arrow_right", "");
        if (item.childElementCount > 0) {
            if (item.firstElementChild.tagName == "A") {
                itemObj.link = item.firstElementChild.href;
            }
            else
                itemObj.link = "";
        }
        result.items.push(itemObj);
    });
    Array.from(subMenus).forEach(function (menu) {
        if (menu.parentNode != div)
            return;
        div2json(json, menu);
    });
    json.menus.push(result);
}
export function html2json(div) {
    let json = new MenuJson();
    json.menus = [];
    div2json(json, div);
    return json;
}
export function createMenuURL() {
    return URL.createObjectURL(new Blob([JSON.stringify(html2json(contextMenu), undefined, 2)], { type: 'application/json' }));
}
