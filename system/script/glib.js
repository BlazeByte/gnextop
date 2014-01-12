function isset(varname){
  return(typeof(varname)!='undefined');
}

function $(id) {
  return document.getElementById(id);
} 


var strGETVarName = new Array();
var strGETVarValue = new Array();
var objGETLocation = null;

function GetURLVars(){
  objGETLocation = location;
  var strParams = objGETLocation.hash.split("#");
  if (strParams.length<2) return;
  var strVars = strParams[1].split("&");
  for ( var i = 0 ; i < strVars.length ; i++ ) {
    var strVar = strVars[i].split("=");
    strGETVarName[strGETVarName.length] = strVar.shift();
    strGETVarValue[strGETVarValue.length] = strVar.join("=");
  }
  blnGotGetVars = true;
} 

function GET(strVar, objLocation){
  if (typeof objLocation == 'undefined') objLocation = location;
  if (objGETLocation != objLocation) {
    objGETLocation = objLocation;
    GetURLVars();
  }
  for ( var i = 0 ; i < strGETVarName.length ; i++ )
    if ( strGETVarName[i] == strVar )
      return strGETVarValue[i];
      
  return null;
}

GetURLVars();

