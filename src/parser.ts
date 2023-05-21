import * as Editor from "./editor";

const contextMenu = document.getElementById("context-menu");

class MenuJson {
  menus: MenuObject[];
};

class MenuObject {
  type: string;
  parentId: string;
  id: string;
  items: ItemObject[];
};

class ItemObject {
  id: string;
  text: string;
  link: string;
};

export function initMenu(): void {
  if (localStorage.getItem("swamplinks") == null) {
    fetch('public/swamplinks.json')
      .then(response => response.text())
      .then(responseText => {
        let json = JSON.parse(responseText);
        localStorage.setItem("swamplinks", JSON.stringify(json));
        json2html(localStorage.getItem("swamplinks"));
      });
  } else {
    json2html(localStorage.getItem("swamplinks"));
  }

  Editor.init();
  document.getElementById("editor-control-edit").addEventListener("dragstart", Editor.onDragItem);
  document.getElementById("editor-control-newMenu").addEventListener("dragstart", Editor.onDragItem);
  document.getElementById("editor-control-newItem").addEventListener("dragstart", Editor.onDragItem);
}

export function items2html(parent: HTMLElement, items: ItemObject[]): void {
  items = items.reverse();
  [].forEach.call(items, function (item: ItemObject) {
    let div: HTMLElement;
    if (item.link != "") {
      div = createItemHTML(item.text, item.link);
    } else {
      div = createMenuHTML(item.text, item.id);
    }

    div.addEventListener("dragstart", Editor.onDragItem);
    div.draggable = true;
    parent.prepend(div);
  });
}

export function createItemHTML(text: string, link: string): HTMLElement {
  let div: HTMLElement = document.createElement("div");
  let a: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
  div.className = "item";
  a.href = link;
  a.textContent = text;
  div.addEventListener("dragstart", Editor.onDragItem);
  div.draggable = true;
  div.appendChild(a);
  div.style.cursor = "pointer";
  return div;
}

export function createMenuHTML(text: string, menuID: string): HTMLElement {
  let div: HTMLElement = document.createElement("div");
  div.className = "item";
  div.id = menuID;
  div.textContent = text;

  let iconDiv: HTMLElement = document.createElement("div");
  let icon: HTMLLIElement = document.createElement("i") as HTMLLIElement;
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

export function createSubMenuDIV(menuID: string): HTMLElement {
  let div: HTMLElement = document.createElement("div");
  div.className = "secondary-menu";
  div.id = menuID + "-menu";
  return div;
}

export function createSubMenuHTML(divId: string, items: ItemObject[]): HTMLElement {
  let div: HTMLElement = document.createElement("div");
  div.id = divId;
  div.className = "secondary-menu";
  items2html(div, items);
  return div;
}

export function json2html(json: string): void {
  let obj: MenuJson = JSON.parse(json);
  let contextMenus: MenuObject[] = obj.menus;

  // TODO make these their own functions

  let header: HTMLDivElement = document.createElement("div") as HTMLDivElement;
  let fox: HTMLImageElement = document.createElement("img") as HTMLImageElement;
  let hr: HTMLHRElement = document.createElement("hr") as HTMLHRElement;
  let topHr: HTMLHRElement = document.createElement("hr") as HTMLHRElement;
  fox.src = "public/assets/fox.png";
  header.className = "header";
  header.appendChild(fox);
  header.appendChild(hr);
  header.prepend(topHr);

  while (contextMenus.length > 0) {
    [].forEach.call(contextMenus, function (menu: MenuObject, index: number) {
      if (menu.type == "context-menu") {
        items2html(contextMenu, menu.items);
        contextMenu.prepend(header);
        contextMenus.splice(index, 1);
      } else {
        let parentDiv: HTMLElement = document.getElementById(menu.parentId);
        if (parentDiv != null) {
          let menuDiv: HTMLElement = createSubMenuHTML(menu.id, menu.items);
          parentDiv.appendChild(menuDiv);
          contextMenus.splice(index, 1);
        }
      }
    });
  }
}

function div2json(json: MenuJson, div: HTMLElement): void {
  let result: MenuObject = new MenuObject();
  let subMenus: HTMLCollection = div.getElementsByClassName("secondary-menu");
  let items: HTMLCollection = div.getElementsByClassName("item");
  result.items = [];

  if (div.id == "context-menu") {
    result.type = "context-menu";
    result.parentId = "context-menu";
    result.id = "context-menu";
  } else {
    result.type = "secondary-menu";
    result.parentId = (div.parentNode as HTMLElement).id;
    result.id = div.id;
  }

  Array.from(items).forEach(function (item) {
    if (item.parentNode != div) return;
    let itemObj: ItemObject = {} as ItemObject;
    itemObj.id = item.id;
    itemObj.text = item.textContent.replace("keyboard_double_arrow_right", "");
    if (item.childElementCount > 0) {
      if (item.firstElementChild.tagName == "A") {
        itemObj.link = (item.firstElementChild as HTMLAnchorElement).href;
      } else itemObj.link = "";
    }

    result.items.push(itemObj);
  });

  Array.from(subMenus).forEach(function (menu) {
    if (menu.parentNode != div) return;
    div2json(json, menu as HTMLElement);
  });

  json.menus.push(result);
}

export function html2json(div: HTMLElement): MenuJson {
  let json = new MenuJson();
  json.menus = [];
  div2json(json, div);
  return json;
}

export function createMenuURL(): string {
  return URL.createObjectURL(new Blob([JSON.stringify(html2json(contextMenu), undefined, 2)], { type: 'application/json' }));
}