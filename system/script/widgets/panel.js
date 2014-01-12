/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Panel API
=========

This creates and operates the panel (Windows calls it a taskbar)


Functions:
---------

Panel.Write (integer Panel)
- Writes the Panel (called on boot)
- Panel is not currently used, but may be used to allow multiple panels.

Panel.Tray.UpdateConnectionIcon () {
- Update the network connection icon in the tray

*/

//Gnextop.Boot.Msg('Preparing Panel library...');
//Gnextop.Boot.UpdateProg(4, true);

Gnextop.Widgets.AddLib('panel', {

  GetHTML : function() {
    var html = '';
    html += '<div id="panel">' +
        //'<div id="applet-menu"><a href="javascript:Menu.Toggle();" style="position:relative;"></a></div>' +
        '<div id="applet-taskbar">';
    for (var i = 0 ; i < Window.length ; i++ ) {
      html += "<div id=\"windowTab"+i+"\" class=\"windowTab\" onclick='Window.Toggle("+i+");' style=\"left:"+(119*i)+"px;\"><img src='' class='windowTabIcon' id='windowTabIcon" + i + "' align='left' /><div id='windowTabTitle"+i+"'>Loading...</div></div>";
    }
    html += "</div>"+
       // "<div id=\"applet-tray\"><img id='traynet' src='"+Gnextop.Root+"themes/"+Gnextop.ThemeDir+"/images/icons/tray/net"+((Gnextop.Connected)?"on":"off")+".png"+"' /></div>"+
        "<div id=\"applet-clock\">00:00</div>"+
      "</div>";
    return html;
  },

  //Panel.Tray = new Object();

  //Panel.Tray.UpdateConnectionIcon = function() {
  //  document.getElementById("traynet").src=Gnextop.Root+"themes/"+Gnextop.ThemeDir+"/images/icons/tray/net"+((Gnextop.Connected)?"on":"off")+".png";
  //}
});