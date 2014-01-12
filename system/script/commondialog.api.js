/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Common Dialog API
=================

Common dialogs are dialogs the user will see frequently - such as the open/save dialog.


Functions:
---------

CommonDialog.ShowFile (function CallAfter, string Title)
- Shows the File common dialog (which can be used as both save and open)
- CallAfter is the function to be called when a file has been selected
- Title is the title that will appear at the top of the dialog

CommonDialog.ShowConnect (function CallAfter, function Quit)
- Shows an internet connection dialog
- CallAfter is the function to be called when connection is successful
- Quit is the function to be called if cancel is called.

CommonDialog.CleanUp ()
- Blanks some variables
- Good practice to call after using a common dialog.

*/

var CommonDialog = new Object();
CommonDialog.Filename = null;
CommonDialog.CallAfter = null;
CommonDialog.Quit = null;

CommonDialog.ShowFile = function (CallAfter, Title){
  if(!Title)
    Title = "Open/Save";
  Gnextop.iScreen.frames['cdfile'].document.getElementById('windowTitle').innerHTML = Title;
  Gnextop.iScreen.document.getElementById('cdfile').style.visibility='visible';
  CommonDialog.CallAfter = CallAfter;
}

CommonDialog.ShowConnect = function (CallAfter, CallCancel) {   // Connect to internet dialog
  Gnextop.iScreen.document.getElementById('cdnet').style.visibility='visible';
  CommonDialog.CallAfter = CallAfter;
  CommonDialog.Quit = CallCancel;
}

CommonDialog.ShowMsg = function (Confirm, Title, Msg, CallAfter, CallCancel){
  Gnextop.iScreen.frames['cdmsg'].document.getElementById("msg").innerHTML = Msg;
  Gnextop.iScreen.frames['cdmsg'].document.getElementById("title").innerHTML = Title;
  Gnextop.ShowAuxScreen('cdmsg');
  if(isset(CallAfter)) 
      CommonDialog.CallAfter = CallAfter;
    else 
      CommonDialog.CallAfter = null;
  if(Confirm) {
    Gnextop.iScreen.frames['cdmsg'].document.getElementById("setconfirm").style.visibility='visible';
    Gnextop.iScreen.frames['cdmsg'].document.getElementById("setmsg").style.visibility='hidden';
    if(isset(CallCancel)) 
      CommonDialog.CallCancel = CallCancel;
    else 
      CommonDialog.CallCancel = null;
  } else {
    CommonDialog.CallCancel = -1;
    Gnextop.iScreen.frames['cdmsg'].document.getElementById("setmsg").style.visibility='visible';
    Gnextop.iScreen.frames['cdmsg'].document.getElementById("setconfirm").style.visibility='hidden';
  }
}

CommonDialog.CleanUp = function () {
 CommonDialog.Filename = null;
 CommonDialog.CallAfter = null;
 CommonDialog.Quit = null;
}