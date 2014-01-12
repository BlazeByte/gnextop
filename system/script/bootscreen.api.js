/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Boot Screen API
===============

This script allows Gnextop to report boot progress to the user. This allows basic debugging (determine where an error may occur)


Functions:
---------

Gnextop.BootComplete ()
- Hides the boot screen and shows the main screen

Gnextop.StartBoot ()
- Hides the main screen, shows the boot screnn

Gnextop.ReturnLoading (string Text)
- Shows text explaining loading stage

Gnextop.LoadingDot ()
- Shows a "." every x seconds - shows loading

*/
Gnextop.Booted = false;

Gnextop.Boot = new Object();

Gnextop.Boot.Processes = Array();
Gnextop.Boot.StartProg = 10;
// Leave 40% for the after main boot, when images are loading
Gnextop.Boot.EndProg = 60;

Gnextop.Boot.Prog = 0;

// Press X on the bootscreen to show msgs
Gnextop.Boot.OutputMsg = false;
Gnextop.Boot.CurrMsg = '';

Gnextop.Boot.Cmd = function(cmd, msg) {
  var i = Gnextop.Boot.Processes.length;
  Gnextop.Boot.Processes[i] = new Object();
  Gnextop.Boot.Processes[i].Msg = msg;
  Gnextop.Boot.Processes[i].Cmd = cmd;
}

Gnextop.Boot.Execute = function() {
  Gnextop.Boot.StartProg = parseInt(top.$('bootprog').style.width);
  for (i = 0; i < Gnextop.Boot.Processes.length; i++) {
    var Proc = Gnextop.Boot.Processes[i];
    Gnextop.Boot.Msg(Proc.Msg);
    eval(Proc.Cmd);
    Gnextop.Boot.UpdateProg(Gnextop.Boot.StartProg + Math.round((i/(Gnextop.Boot.Processes.length-1)) * (Gnextop.Boot.EndProg - Gnextop.Boot.StartProg)));
  }
}

Gnextop.Boot.UpdateProg = function(percent, add) {
  if (typeof add !== "undefined") {
    percent += Gnextop.Boot.Prog;
  }
  top.$('bootprog').style.width = percent + "%";
  Gnextop.Boot.Prog = percent;
}

Gnextop.Boot.Msg = function (strText){
  Gnextop.Boot.CurrMsg = strText;
  if (Gnextop.Boot.OutputMsg)
    top.$("bootmsg").innerHTML = strText;
}


Gnextop.Boot.Buffer = new Object();
Gnextop.Boot.Buffer.Contents = '';

Gnextop.Boot.Buffer.Add = function(html) {
  Gnextop.Boot.Buffer.Contents += html;
}

Gnextop.Boot.Buffer.Clean = function(html) {
  var contents = Gnextop.Boot.Buffer.Contents;
  Gnextop.Boot.Buffer.Contents = '';
  return contents;
}

Gnextop.Boot.EnableMsgOutput = function () {
  Gnextop.Boot.Msg(Gnextop.Boot.CurrMsg);
  Gnextop.Boot.OutputMsg = true;
}

Gnextop.Boot.Msg('Preparing Boot library...');
Gnextop.Boot.UpdateProg(10, true);