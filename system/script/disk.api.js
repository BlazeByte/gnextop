/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Virtual Disk API
================

The virtual disk is the method Gnextop uses to store data on the PSP (or the PC). On the PC, cookies are simple used. However
on the PSP, cookies on offline web pages are not supported. Data can however be stored in the Input History - the PSP saves
the contents of <input> elements inside a form when it is submitted.

This API therefore stores the data in an* <input>, then calls the submit (it does not actually submit anywhere).

* Due to a limitation of the amount of data that can be stored in a single input, the data must be divided into separate inputs.


Functions:
---------

Disk.DiskReady ()
- This is called when the virtual disk page (in an <iframe>) has loaded.
- It is also called when the disk is in the process of saving.
- The function calls Setting.LoadSettingsFromDisk(), which loads the settings database

Disk.WriteFile (string FileName, string Headers, string Contents, boolean Force)
- Writes a file to the disk
- FileName is the name of the file (does not need a suffix (eg .txt))
- Headers is a list of information about the file (eg. "Type=Document,Pages=1")
- Contents is the contents of the file being saved.
- If force is true, files will be overwritten without asking.


Disk.LoadFile (string FileName)
- Loads a file
- FileName is the name of the file to load
- Returns the contents of the file. If the file does not exist, then it returns null.

Disk.DeleteFile = function (string FileName)
- Deletes a file
- FileName is the name of the file to delete

Disk.Clear ()  # this function will to be removed
- Clears every file of the disk WITHOUT CONFIRMATION

Disk.FileExists (string FileName)
- Checks is a file exists
- FileName is the name of the file to look for
- Returns true if found, false otherwise

Disk.Store ()
- Stores the data to Input History (PSP) or cookies (PC)

Disk.RefreshUsers ()
- Refeshes all clients of the disk (eg. file browser)

*/


var Disk = new Object();
Disk.Data = "";
Disk.SectorMax = 1000; // How many characters a sector can contain. It's 200 until the number is established.
Disk.SectorCount = 0;  // How many sectors are in disk.html. As far as I know, this can be anything....
Disk.Debug = false;
Disk.StoreInProgress = false;
Disk.DataLoaded = false;
Disk.Files = new Array();
Disk.Char1 = String.fromCharCode(187);    // Separates file details from contents
Disk.Char2 = String.fromCharCode(176);    // Separates files

Disk.DiskReady = function () {          // Called when virtual disk is ready
  if (Disk.StoreInProgress == true) Disk.Store();
  if (Disk.DataLoaded == false) {       // Only load the data on system boot, never more than once
    Disk.DataLoaded = true;
    if(Gnextop.UsingPSP) {               // If on PSP
      for(var intSector = 0; intSector < Disk.SectorCount; intSector++)
        Disk.Data += top.frames["vdisk"].document.getElementById('txtVDisk'+intSector).value;    // Load from input history (combine each sector)
    } else {                              // If not on PSP
      var cookiedata = unescape(top.document.cookie);  // Load the cookie
      var cookiecontents = cookiedata.split("=");
      cookiecontents.shift(1);
      Disk.Data = cookiecontents.join('=');
    }
    top.DiskReady();
  }
}

Disk.WriteFile = function (strFileName, strHeaders, strContents, blnForce) {
  var now = new Date();
  strHeaders += "Date="+now.getTime()+";";
  if(Disk.FileExists(strFileName)==true) {
    if(typeof blnForce =='undefined') 
      if(!confirm("File \""+strFileName+"\" already exists. Would you like to overwrite it?")) return false;
    Disk.DeleteFile(strFileName);  // if the file exists already, delete it
  }
  Disk.Data += strFileName + Disk.Char1 + strHeaders + Disk.Char1 + strContents + Disk.Char2;              // Write the file to VDisk
 //Disk.RefreshUsers();
  Disk.Store();
}

Disk.LoadFile = function (strFileName) {
  var aFiles = Disk.Data.split(Disk.Char2);
  for (var intFile = 0; intFile < aFiles.length; intFile++) {
    var aFileParts = aFiles[intFile].split(Disk.Char1);
    if (aFileParts[0] == strFileName){
      return aFileParts[2];
      break;
    }
  }
  return null;
}

Disk.DeleteFile = function (strFileName) {
  var aFiles = Disk.Data.split(Disk.Char2);
  for (var intFile = 0; intFile < aFiles.length; intFile++) {
    var aFileParts = aFiles[intFile].split(Disk.Char1);
    if (aFileParts[0] == strFileName){
      aFiles.splice(intFile,1);
      break;
    }
  }
  Disk.Data = aFiles.join(Disk.Char2);
  //Disk.RefreshUsers();
  Disk.Store();
}

Disk.Clear = function () {
  Disk.Data = "";
  Disk.Store();
  top.location=top.location.href;
}

Disk.FileExists = function (strFileName) {
  var aFiles = Disk.Data.split(Disk.Char2);
  for (var intFile = 0; intFile < aFiles.length; intFile++) {
    var aFileParts = aFiles[intFile].split(Disk.Char1);
    if (aFileParts[0] == strFileName){
      return true;
      break;
    }
  }
  return false;
}

Disk.Store = function () {
  if (Gnextop.UsingPSP) {
    var intSectorCount = Math.ceil(Disk.Data.length / Disk.SectorMax);  // Find out the amount of sectors needed
    if (Disk.SectorCount == intSectorCount) {  // If there is already the correct amount of sectors, all is well
      Disk.SectorCount = intSectorCount;
      for (var intSector = 0; intSector < Disk.SectorCount; intSector++) {
        intStart = intSector * Disk.SectorMax;
        intEnd = (intSector + 1) * Disk.SectorMax;
        top.frames["vdisk"].document.getElementById('txtVDisk'+intSector).value = Disk.Data.slice(intStart, intEnd);  // Fill the sector
      }
      Disk.StoreInProgress = false;
      top.frames["vdisk"].document.vdisk.submit();
    } else { // Otherwise, the disk page must be remade
      top.frames["vdisk"].document.getElementById('txtVDiskSectors').value = intSectorCount;
      Disk.StoreInProgress = true;
      top.frames["vdisk"].document.vdisk.submit();
      return; // Storing will continue when Disk is ready (see Disk.DiskReady)
    }
  } else {
    var expiry = new Date();  
    expiry.setTime(expiry.getTime() + (300*24*60*1000));
    top.document.cookie = "cookiedata=" + escape(Disk.Data) + ";" + "expires=" + expiry.toGMTString() + ";" ;
  }
}

Disk.RefreshUsers = function() { // Everytime the disk is modified, make sure the users (eg commondialogs) stay up-to-date
  top.cdfile.location.reload();
}