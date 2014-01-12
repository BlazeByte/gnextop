Gnextop.CheckGenuine = function (c) {
  if(c.innerHTML.indexOf("Free software from BlazeByte.org")==-1)
    Gnextop.ShowGenuineMsg();
  Gnextop.Checked = true;
}

Gnextop.ShowGenuineMsg = function() {
  CommonDialog.ShowMsg(false,"Not Genuine!","This copy of Gnextop may not be genuine. Gnextop can be downloaded for FREE at BlazeByte.org.");
}