/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Settings API
============

The Settings API allows application to save settings to disk, and retrieve them later. It's similar to the Windows registry (*shudder*).
The settings are stored in a database (systemsettings) - thus the API relies on the Database API.

The structure of the settings database:
- User
- - Application
- - - Key
- - - - Value

For example:
- Global
- Marvin
- - imageviewer
- - maps
- - webbrowser
- - - showbookmarks
- - - homepage
- - - - http://google.com
- - - showsearch
- - Application


Functions:
---------

Setting.LoadSettingsFromDisk ()
- This is called when the virtual disk has finished loading
- It loads the systemsettings database
- If the database exists, the login screen will be shown or, if autologin is enabled, show the desktop.
- If the database does not exist, the setup screen will be shown
- Finally, it determines whether to use standard <input> or gnextop inputs.

Setting.SaveSetting (boolean Global, string Application, string Key, string Value)
- Function to save a setting to the database
- If Global is true, the setting will apply to every user on Gnextop. If false, it will only
  apply to the current user
- Application is the application the setting is for (eg. "webbrowser")
- Key is the setting name (eg. "homepage")
- Value is the value of the setting (eg. "http://google.com")
- Returns true on success

Setting.GetSetting (boolean Global, string Application, string Key, string Default)
- Function to get setting from database
- If Global is true, get the global setting. If false, get setting for current user
- Application is the application the setting is for (eg. "webbrowser")
- Key is the setting name (eg. "homepage")
- Default is the value is the value to return if no setting is found
- Returns the value of the setting. If the setting does not exist, Default is returned.

Setting.SettingExists (boolean Global, string Application, string Key)
- Function to check for existence of a setting
- If Global is true, check in global settings. If false, check in settings for current user
- Application is the application the setting is for (eg. "webbrowser")
- Key is the setting name (eg. "homepage")
- Returns true if setting exists, false if it doesn't

Setting.DeleteSetting (boolean Global, string Application, string Key)
- Function to delete a setting from the database
- If Global is true, delete from global settings. If false, delete from settings for current user
- Application is the application the setting is for (eg. "webbrowser")
- Key is the setting name (eg. "homepage")
- Returns true on success

*/

var Setting = new Object();

Setting.LoadSettingsFromDisk = function () {
  
  if(!Base.LoadBase("system","sys")) { // Load database. If it does not exist, then make it
     Gnextop.Setup();
  }
  
  var PSetting = Setting.GetSetting(true, "Gnextop", "pspkeyboard", true);
  Gnextop.UseStandardControls = PSetting;
  
  if (!PSetting) {
    //top.frames['kb'].location = Gnextop.Root + 'system/keyboard/kbgui.html';
  }
}

Setting.SaveSetting = function (blnGlobal, strApp, strKey, strValue) {
  var strUser = (blnGlobal==true) ? "Global" : Gnextop.User;
  var FoundRecords = Base.FindRecords("sys","settings","user="+strUser+",application="+strApp+",key="+strKey);
  if (FoundRecords.length>0)                              // if the setting exists already...
    Base.DeleteRecords("sys","settings", FoundRecords);   // ...delete it
  intRecord = Base["sys"].Table["settings"].Field["user"].Record.length;
  Base.CreateRecord("sys","settings","user="+strUser+",application="+strApp+",key="+strKey+",value="+strValue);
  return true;
}

Setting.GetSetting = function (blnGlobal, strApp, strKey, vdefault) {
  var strUser = (blnGlobal==true) ? "Global" : Gnextop.User;          // If Global is true, then find global setting. Else find setting for current user.
  var FoundRecords = Base.FindRecords("sys","settings","user="+strUser+",application="+strApp+",key="+strKey);    // Get an array of records (there should only ever be 1 returned)
  if (FoundRecords.length>0) {
    var strValue = Base["sys"].Table["settings"].Field["value"].Record[FoundRecords[0]].Value;
    strValue = strValue=="true" ? true : strValue=="false" ? false : strValue;
    return strValue;
  } else 
    return vdefault;
}

Setting.SettingExists = function (blnGlobal, strApp, strKey) {
  var strUser = (blnGlobal==true) ? "Global" : Gnextop.User;
  var keys = Base.FindRecords("sys","settings","user="+strUser+",application="+strApp+",key="+strKey);
  return (keys[0]) ? true : false;
}

Setting.DeleteSetting = function (blnGlobal, strApp, strKey) {
  var FoundRecords = Base.FindRecords("sys","settings","user="+strUser+",application="+strApp+",key="+strKey);
  if (FoundRecords.length>0)                              // if the settings exist...
    Base.DeleteRecords("sys","settings", FoundRecords);   // ...delete it
  return true;
}