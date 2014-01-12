/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Controls API
============

This allows Gnextop and Applications to use the Gnextop controls.

Buttons are <a> tags, with CSS styling (something that the <input type="button"> cannot have)

Text boxes are either (depending on the users preference)
- Gnextop text boxes - <a> tags with CSS styling, making use of the Gnextop QWERTY keyboard
or
- <input type="text"> - which cannot have CSS, but uses the PSP's default keyboard

Text fields are <a> tags or <textarea> tags

There are also Password boxes - <a> or <input type="password"> 


Functions:
---------

Control.Button.CreateNew (arguments)
- Creates and returns HTML for a button
- Example of use:
        document.write(Control.Button.CreateNew("Value=OK","ID=btnOK","OnClick=doSomething();"));
- Arguments can be any of these, separated by commas (eg "Value=OK","ID=btnOK")
  - "Value=text to appear in button" - this is the text that will appear in the button
  - "ID=button_id" - this is the ID used to change the button's properties
  - "Style=width: 45px; height:20px;" - set some CSS style properties
  - "OnClick=doSomething()" - what to do when button is clicked
- Returns the HTML of the button, ready too be written to the page

Control.TextArea.CreateNew (arguments)


Control.TextBox.CreateNew (arguments)


Control.PassBox.CreateNew (arguments)


Control.ShowKB = function (string ID, boolean Pass){
- Shows the Gnextop QWERTY Keyboard
- ID is the ID of the control being changed
- Pass is whether a password is being set (if true, text will be censored)

*/

var Control = new Object();
Control.Button = new Array();
Control.TextArea = new Array();
Control.TextBox = new Array();
Control.PassBox = new Array();
Control.UseStandard = top.Gnextop.UseStandardControls;

Control.Button.CreateNew = function () {           // Create a button
  var intButtonIndex = Control.Button.length;      // How many buttons are there
  Control.Button[intButtonIndex] = new Object();   // Create the new button object
  
  var blnSTYLE = false;
  var blnONCLICK = false;
  var blnVALUE = false;
  var blnID = false;
  
  for (var intArg = 0 ; intArg < arguments.length ; intArg++) {   // Set each property of the button (properties set in function arguments)
    var parts = arguments[intArg].split("=");
    var varname = parts.shift().toUpperCase();
    eval("bln"+varname+"=true;"+
         "Control.Button["+intButtonIndex+"]." + varname + " = \"" + parts.join("=") + "\";");
  }
  
  var strHTML = "<div class=\"control_button\" ";
  if(blnSTYLE) strHTML += "style='"+Control.Button[intButtonIndex].STYLE+"' ";
  if(blnID) strHTML += "id=\""+Control.Button[intButtonIndex].ID+"\"";
  strHTML += ">";
  if(blnVALUE) strHTML += Control.Button[intButtonIndex].VALUE;
  strHTML +=  "<a href='javascript:;' class='' ";
  if(blnONCLICK) strHTML += "onclick=\""+Control.Button[intButtonIndex].ONCLICK+"\" ";
  strHTML += "><img src=\""+Gnextop.Root+"themes/system/images/px.png\" /></a></div>"
  
  return strHTML;
}

Control.TextArea.GetValue = function(textArea) {
	if(Control.UseStandard)
		return textArea.value
	else
		return textArea.innerHTML;
}

Control.TextArea.SetValue = function(textArea, value) {
	if(Control.UseStandard)
		textArea.value = value;
	else
		textArea.innerHTML = value;
}

Control.TextArea.CreateNew = function () {
  var intTextAreaIndex = Control.TextArea.length;
  Control.TextArea[intTextAreaIndex] = new Object();
  Control.TextArea[intTextAreaIndex].Value = "";
  for (var intArg = 0 ; intArg < arguments.length ; intArg++) {
    var parts = arguments[intArg].split("=");
    eval("Control.TextArea["+intTextAreaIndex+"]." + parts.shift() + " = \"" + parts.join("=") + "\";");
  }
  if (!Control.UseStandard) {
	  if (!isset(Control.TextArea[intTextAreaIndex].ID)) return "<div style='color:red;'>Textbox error: No ID set.</div>";
	  var strHTML = "<div class='control_textarea' style='";
	  if(isset(Control.TextArea[intTextAreaIndex].Style)) 
		strHTML += Control.TextArea[intTextAreaIndex].Style;
	  strHTML += "'><div id=\""+Control.TextArea[intTextAreaIndex].ID+"\">";
	  if(isset(Control.TextArea[intTextAreaIndex].Value))
		strHTML += Control.TextArea[intTextAreaIndex].Value;
	  else
		strHTML += "&nbsp;";
	  strHTML += "</div><a href='javascript:;' onclick=\"Control.ShowKB(Control.TextArea["+intTextAreaIndex+"],document.getElementById('" + Control.TextArea[intTextAreaIndex].ID + "'),false);";
	  if (isset(Control.TextArea[intTextAreaIndex].onClick)) 
		strHTML += Control.TextArea[intTextAreaIndex].onClick;
	  strHTML += "\"><img src=\""+Gnextop.Root+"themes/system/images/px.png\" /></a></div>";
	  strHTML += "<script>document.getElementById('"+Control.TextArea[intTextAreaIndex].ID+"').value='";
	  if(isset(Control.TextArea[intTextAreaIndex].Value))
		strHTML += Control.TextArea[intTextAreaIndex].Value;
	  strHTML += "';<"+"/script>"; // Set the value
  }
  else {
	    var strHTML = "<textarea style='"+Control.TextArea[intTextAreaIndex].Style+"' id=\""+Control.TextArea[intTextAreaIndex].ID+"\"'>"+Control.TextArea[intTextAreaIndex].Value+"</textarea>";
  }
  return strHTML;
}

Control.TextBox.CreateNew = function () {      // Single line text box
  var intTextBoxIndex = Control.TextBox.length;
  Control.TextBox[intTextBoxIndex] = new Object();
  Control.TextBox[intTextBoxIndex].Value = "";   // Value is always needed
  for (var intArg = 0 ; intArg < arguments.length ; intArg++) {
    var parts = arguments[intArg].split("=");
    eval("Control.TextBox["+intTextBoxIndex+"]." + parts.shift() + " = \"" + parts.join("=") + "\";");
  }

  // Load the Gnextop control or normal HTML <input> control?
  if (Control.UseStandard) {
    var strHTML = "<input type='text' style='"+Control.TextBox[intTextBoxIndex].Style+"' id=\""+Control.TextBox[intTextBoxIndex].ID+"\" value='"+Control.TextBox[intTextBoxIndex].Value+"' />";
  } else {
    var strHTML = "<div class='control_textbox' style='"+Control.TextBox[intTextBoxIndex].Style+"'>" +
                    "<div id=\""+Control.TextBox[intTextBoxIndex].ID+"\"> " +
                      ((Control.TextBox[intTextBoxIndex].Value=="") ? "&nbsp;" : Control.TextBox[intTextBoxIndex].Value ) +
                    "</div>" +
                    "<a href='javascript:;' onclick=\"Control.ShowKB(Control.TextBox["+intTextBoxIndex+"],document.getElementById('" + Control.TextBox[intTextBoxIndex].ID + "'),false);"+Control.TextBox[intTextBoxIndex].onClick+"\">" +
                      "<img src=\""+Gnextop.Root+"themes/system/images/px.png\" />" +
                    "</a>" +
                  "</div>";
    
    strHTML += "<script>document.getElementById('"+Control.TextBox[intTextBoxIndex].ID+"').value='"+Control.TextBox[intTextBoxIndex].Value+"';<"+"/script>"; // Set the value
  }
  
  return strHTML;
}

Control.PassBox.CreateNew = function () {      // Single line text box
  var intPassBoxIndex = Control.PassBox.length;
  Control.PassBox[intPassBoxIndex] = new Object();
  Control.PassBox[intPassBoxIndex].Value = "";   // Value is always needed
  for (var intArg = 0 ; intArg < arguments.length ; intArg++) {
    var parts = arguments[intArg].split("=");
    eval("Control.PassBox["+intPassBoxIndex+"]." + parts.shift() + " = \"" + parts.join("=") + "\";");
  }

  // Load the Gnextop control or normal HTML <input> control?
  if (Control.UseStandard) {
    var strHTML = "<input type='password' style='"+Control.PassBox[intPassBoxIndex].Style+"' id=\""+Control.PassBox[intPassBoxIndex].ID+"\" value='"+Control.PassBox[intPassBoxIndex].Value+"' />";
  } else {
  
    function censor(strValue){
      if(strValue="") return "&nbsp;";  // Can' be blank, so use non-breaking space
      var strCensor = "";
      for (var intChar = 0; intChar < strValue.length; intChar++) strCensor += String.fromCharCode(9679);
      return strCensor;
    }
    
    var strHTML = "<div class='control_passbox' style='"+Control.PassBox[intPassBoxIndex].Style+"'>" +
                    "<div id=\""+Control.PassBox[intPassBoxIndex].ID+"\"> " +
                      censor(Control.PassBox[intPassBoxIndex].Value) +
                    "</div>" +
                    "<a href='javascript:;' onclick=\"Control.ShowKB(Control.PassBox["+intPassBoxIndex+"],document.getElementById('" + Control.PassBox[intPassBoxIndex].ID + "'),true);"+Control.PassBox[intPassBoxIndex].onClick+"\">" +
                      "<img src=\""+Gnextop.Root+"themes/system/images/px.png\" />" +
                    "</a>" +
                  "</div>";
    
    strHTML += "<script>document.getElementById('"+Control.PassBox[intPassBoxIndex].ID+"').value='"+Control.PassBox[intPassBoxIndex].Value+"';<"+"/script>"; // Set the value (the password) and create refresh() function
    
  }
  return strHTML;
}

Control.ShowKB = function (control, currentFocus, blnPass){
  var currentscreen;
  var kb = top.frames['kb'];
  kb.control = control;
  kb.currentFocus = currentFocus;        // Current focus is the control that is focus
  if (top.document.getElementById('screen').style.visibility == 'visible') {  // Make sure the kb knows whether the focus is on the screen, or a common dialog
    kb.currentScreen = top.document.getElementById('screen');
    currentscreen = top.document.getElementById('screen');
  } else if(top.document.getElementById('cdfile').style.visibility == 'visible'){
    kb.currentScreen = top.document.getElementById('cdfile');
    currentscreen = top.document.getElementById('cdfile');
  }

  if (!blnPass){
    kb.password = false;
    kb.Lines[0] = control.Value;

  } else { 
    kb.password = true;
    kb.strPassword = "";
    kb.Lines[0] = "";
  }
  
  kb.intCurrX = kb.Lines[0].length;
  kb.MultiLine = false;
  kb.blnActive = true;
  kb.showLine();
  top.document.getElementById('kb').style.visibility='visible';
  currentscreen.style.visibility='hidden';
}
