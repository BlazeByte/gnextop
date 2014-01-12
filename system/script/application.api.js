/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Application API
===============

This API is used with applications


Functions:
---------

LoadingComplete ()
- Tells Gnextop that the application has finished loading, and should be shown

*/

var Me = new Object();

function LoadingComplete(){
  parent.Window.LoadingComplete();
}