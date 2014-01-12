Gnextop = {

  UsingPSP : (navigator.userAgent.indexOf('PlayStation Portable') == -1) ? false : true,
  UseStandardControls : false, //Set later in settings.api.js
  User : 'default',
  Checked : true,
  Connected : 0,
  ThemeDir : 'default',
  Root : '',

  GetRoot : function() {
    var strAddr = new Array();
    strAddr = location.href.split("/");
    strAddr.pop();
    strAddr.pop();
    return strAddr.join("/") + "/";
  },
  
  

  About : function() {
    CommonDialog.ShowMsg(false, 'About Gnextop', 'Version: ' + this.Version + '                   Released: ' + this.ReleaseDate + '.               blazebyte.org');
  },

  Logout : function() {
    alert("Not yet implemented");
  },
    
  LaunchHandler : function(file, fileType, windowAPI) {
    var handles = Base.FindRecords("sys", "handlers", "type="+fileType);
    if(handles.length != 1) {
      CommonDialog.ShowMsg(false, "Gnextop", "No handlers for filetype '"+fileType+"'.");
      return;
    }
    var apppath = Base["sys"].Table["handlers"].Field["apppath"].Record[handles[0]].Value;
    apppath = apppath + "#file="+file;
    windowAPI.Open(apppath);
  },

  ReportConnection : function (Connection) {
    this.Connected = Connection;
    if (frames["iscreen"].location.href == this.Root + "system/desktop.html") 
      frames["iscreen"].Panel.Tray.UpdateConnectionIcon();
  },

  Setup : function() {
    this.Boot.Msg("Setting up for first boot...");
    
    // Create the system database
    Base.CreateBase("system");
    Base.LoadBase("system", "sys");
    
    // Create the tables
    Base.CreateTable("sys", "users",        "name,password");
    Base.CreateTable("sys", "handlers",     "type,apppath");
    Base.CreateTable("sys", "themes",       "title,author,themedir");
    Base.CreateTable("sys", "applications", "title,category,path");
    Base.CreateTable("sys", "settings",     "user,application,key,value");
    
    // A few things for the database...
    Base.CreateRecord("sys", "users",    "name=default,password=");
    Base.CreateRecord("sys", "handlers", "type=Document,apppath=apps/accessories/texteditor.html");
    Base.CreateRecord("sys", "handlers", "type=Database,apppath=apps/office/database/index.html");
    Base.CreateRecord("sys", "themes",   "title=Air,author=BlazeByte,themedir=default");

    // And a few settings
    //Setting.SaveSetting(true,"Gnextop","autologin",true);
    //Setting.SaveSetting(true,"Gnextop","autologinuser",'default');
    Setting.SaveSetting(false,"Gnextop","Theme","default");

   // Done with the database, write it
    Base.WriteBase("sys");

    // Let's make another file too...
    Disk.WriteFile("Welcome", "Type=Document;", "Welcome to Gnextop, the free PSP Portal by BlazeByte. To find out more about BlazeByte, get Gnextop updates and extras, visit BlazeByte.org.");
  },
  
  CheckTheme : function() {
    if (!Base.LoadBase("system","sys")) {
       this.ThemeDir = "default";  
    }else{
       this.ThemeDir = Setting.GetSetting(this.User, "Gnextop", "Theme", "default");
    }
  },

  CheckCompatibility : function() {
    if (!('clientHeight' in document.body)) {
      alert('Incompatible browser. Some features may not function.');
    }
  },

  LinkScripts : function() {
    document.write(Head.LinkScripts(arguments[0]));
  },

  ShowAuxScreen : function(id) {
    this.iScreen.$(id).style.left = '0';
    this.iScreen.$(id).style.visibility = 'visible';
  },

  HideAuxScreen : function(id) {
    $(id).style.left = '-100%';
    $(id).style.visibility = 'hidden';
  },

  LinkScripts : function () {
    var strOutput = '';
    for (var i in arguments) {
      strOutput += '<script src="' + arguments[i] + '" type="text/javascript"></script>';
    }
    return strOutput;
  },

  LinkStyles : function () {
    var strOutput = '';
    for (var i in arguments) {
      strOutput += '<link rel="stylesheet" href="' + arguments[i] + '" type="text/css">';
    }
    return strOutput;
  }
}

Gnextop.Root = Gnextop.GetRoot();