var intPauses = 0;
var password = false;
var blnCaps = false;
var blnShift = true;
var blnActive = false;
var mode = 0;
var MultiLine = false;
var currentFocus;
var control;
var currentScreen;
var Cursor0 = "|";
var Cursor1 = (Gnextop.UsingPSP) ? String.fromCharCode(160) : ".";
var blnCursor = true;
var Lines = new Array();
var currLine = 0;
Lines[0]="";

function showLine() {
  if (password)
    document.getElementById('inputbox').innerHTML = censor().slice(0,intCurrX) + ((blnCursor) ? Cursor0 : Cursor1) + censor().slice(intCurrX,Lines[currLine].length);
  else
    document.getElementById('inputbox').innerHTML = Lines[currLine].slice(0,intCurrX) + ((blnCursor) ? Cursor0 : Cursor1) + Lines[currLine].slice(intCurrX,Lines[currLine].length);
}

function censor(){
  var strCensor = "";
  for (var intChar = 0; intChar < Lines[currLine].length; intChar++) strCensor += String.fromCharCode(9679);
  return strCensor;
}

function kbCursorBlink(){
  blnCursor=!blnCursor;
  showLine();
}

function pauseKbCursorBlink(){
  if (!blnActive) return;
  if(intPauses == 5) {
    kbCursorBlink();
    intPauses = 0;
  }
  intPauses++;
  setTimeout("pauseKbCursorBlink();",100);
}


function moveCursor(intX){
  intPauses=2;
  blnCursor=true;
  
  if(intX<0){
    if(currLine>0) {
      currLine--;
      intCurrX = Lines[currLine].length;
      showLine();
    }
    return;
  }
  if(intX>Lines[currLine].length){
    if(currLine<Lines.length-1) {
      currLine++;
      intCurrX = 0;
      showLine();
    }
    return;
  }

  intCurrX = intX;
  showLine();
}


function kbType(strChar, strCmd){
  intPauses=2;
  blnCursorShow=true;
  
  if (strChar==0) {
    switch(strCmd) {
      case "return":
        currLine ++;
        Lines.splice(currLine,0,"");
        intCurrX=0;
        break;
      case "bkspace":
        if(intCurrX==0) return; // FIX
        Lines[currLine] = Lines[currLine].slice(0,intCurrX-1) + Lines[currLine].slice(intCurrX,Lines[currLine].length);
        intCurrX--;
        showLine();
        break;
        
      case "clear":
        if(confirm("Are you sure want to clear the text box?")){
          Lines.splice(0,Lines.length-1);
          Lines[0]="";
          currLine=0;
          intCurrX=0;
          showLine();
        }
        break;
        
    }
  } else {
    if (blnCaps) strChar = strChar.toUpperCase();
    if (blnShift) { if (blnCaps) strChar = strChar.toLowerCase(); else strChar = strChar.toUpperCase(); }
    
    if (strChar=="space") strChar = " ";
      Lines[currLine] = Lines[currLine].slice(0,intCurrX) + strChar + Lines[currLine].slice(intCurrX,Lines[currLine].length);
    
    intCurrX+=strChar.length;
    showLine();
  }
  if(blnShift) doShift();
  showLine();
}

function doShift() {
  blnShift=!blnShift;
  var strtext=(blnShift)?"SHIFT":"shift";
  document.getElementById("shift1").innerHTML = strtext;
  document.getElementById("shift2").innerHTML = strtext;
}

function doOk(){
  doExit();
  if(password) {
    control.Value = Lines[0];
    currentFocus.innerHTML = censor();
  } else {
    control.Value = Lines.join(Gnextop.BootNewLine);
    currentFocus.innerHTML = control.Value;
  }
  currentFocus.value = control.Value;
  clearLines();
}

function clearLines() {
  Lines = new Array();
}

function doExit(){
  currentScreen.style.visibility='visible';
  top.document.getElementById('kb').style.visibility = 'hidden';
  if (blnCaps) capslock();
  if (!blnShift) doShift();
  document.getElementById('inputbox').innerHTML = "";
}

function capslock(){
  blnCaps=!blnCaps;
  document.getElementById("caps").innerHTML=(blnCaps)?"CAPS":"caps";
}
