/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Common Dialog API
=================

Nothing fancy, just a function to update the clock on the panel.


Functions:
---------

UpdateClock ()
- Updates the clock

*/

function UpdateClock(){
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  if(Setting.GetSetting(false, "Gnextop", "12hr") == 12){
    if(h>11) h = h - 12;
    if(h==0) h = 12;
    if(h<10) h = "0" + h;
    if(m<10) m = "0" + m;
  } else {
    if(h<10) h = "0" + h;
    if(m<10) m = "0" + m;
  }
  
  document.getElementById("applet-clock").innerHTML = h+":"+m;
}