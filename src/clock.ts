export function setClock() {
  const today:Date = new Date();
  let h:number = today.getHours();
  let m:number = today.getMinutes();
  let s:number = today.getSeconds();

  let hPad:boolean = false;
  let mPad:boolean = false;
  let sPad:boolean = false;
  let pm:boolean = false;

  if (h > 12) {
    h -= 12;
    pm = true;
  }

  if (h == 12) pm = true;
  if (h == 0) h = 12;

  if (h < 10) hPad = true;
  if (m < 10) mPad = true;
  if (s < 10) sPad = true;

  let timeString:string = "";
  timeString += (hPad ? "0" + h : h)
                + ":" +
                (mPad ? "0" + m : m)
                + ":" +
                (sPad ? "0" + s : s)
                + (pm ? " PM" : " AM");

  document.getElementById("clock").textContent = timeString;
  setTimeout(setClock, 1000);
}
