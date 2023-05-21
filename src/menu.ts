const contextMenu = document.getElementById("context-menu");

export function isTargetInContextMenu(event: MouseEvent): boolean {
  let menuX:number = contextMenu.getBoundingClientRect().x;
  let menuY:number = contextMenu.getBoundingClientRect().y;
  let menuWidth:number = contextMenu.getBoundingClientRect().width;
  let menuHeight:number = contextMenu.getBoundingClientRect().height;
  let x:number = event.clientX;
  let y:number = event.clientY;
  return x >= menuX && x <= menuX + menuWidth && y >= menuY && y <= menuY + menuHeight;
}

// TODO, clean this up.
export function getMenuItem(target: HTMLElement): HTMLElement {
  if (target.tagName == "I" && (target.parentNode.parentNode as HTMLElement).className != "editor") target = target.parentNode.parentNode as HTMLElement;
  if (target.className == "menu-icon") target = target.parentNode as HTMLElement;
  if (target.tagName == "A") target = target.parentNode as HTMLElement;
  return target;
}

export function drawMenu(div: HTMLElement, menu: HTMLDivElement, isSubMenu: boolean): void {
  let parent: HTMLDivElement = menu.parentNode as HTMLDivElement;
  let top: number = 0;
  let ix: number = Array.from(div.parentNode.children).indexOf(div) - 1;
  if (isSubMenu && parent.id != "context-menu") ix++;
  if (ix < 0) ix = 0;
  hideSubMenus();

  if (parent.id == "context-menu") {
    top = document.getElementsByClassName("header")[0].getBoundingClientRect().height + 7;
    menu.style.left = "155px";
  } else {
    top = div.clientTop - 1;
    menu.style.left = `${parent.clientWidth + 5}px`;
    makeParentsVisible(div);
  }

  top += div.getBoundingClientRect().height * ix;
  menu.style.top = `${top}px`;
  menu.style.visibility = "visible";
}

export function makeParentsVisible(div: HTMLElement): void {
  let parent: HTMLElement = div.parentNode as HTMLElement;
  do {
    parent.style.visibility = "visible";
    div = parent;
    parent = div.parentNode as HTMLElement;
  } while (parent != null && parent.id != "context-menu");
}

export function calculateMenuIX(div: HTMLElement): number {
  let parent: HTMLElement = div.parentNode as HTMLElement;
  do {
    div = parent;
    parent = div.parentNode as HTMLElement;
  } while (parent != null && parent.id != "context-menu");

  div = document.getElementById(`${div.id.split("-")[0]}`);
  return Array.from(div.parentNode.children).indexOf(div) - 1;
}

export function hideSubMenus(): void {
  let subMenus = document.getElementsByClassName("secondary-menu");

  [].forEach.call(subMenus, function (menu: HTMLDivElement) {
    menu.style.visibility = "hidden";
  });
}

export function hideAllMenus(): void {
  contextMenu.classList.remove("visible");
  hideSubMenus();
}
