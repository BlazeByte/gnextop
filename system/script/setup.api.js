var Screen = new Array("intro","terms","user","startup","finish");
Screen.Count = Screen.length;
Screen.Current = 0;

Screen.Navigate = function (intNav){
  if ((Screen.Current + intNav < 0) || (Screen.Current + intNav >= Screen.length)) return;
  switch(Screen.Current + intNav){    // For the next screen to show, it must satisfy these requirements
    case 3:
      if(!checkUsername()) return;
      if(!checkPass()) return;
      break;
  }
  
  document.getElementById(Screen[Screen.Current]).style.visibility="hidden";
  Screen.Current += intNav;
  document.getElementById(Screen[Screen.Current]).style.visibility="visible";
  Screen.RefreshButtons();
}

Screen.RefreshButtons = function() {
  document.getElementById("next").style.visibility = (Screen.Current >= Screen.length-1) ? "hidden" : "visible";
  document.getElementById("fin").style.visibility = (Screen.Current == Screen.length-1) ? "visible" : "hidden";
  document.getElementById("prev").style.visibility = (Screen.Current>0) ? "visible" : "hidden";
}

function Exit(){
  location="exitbrowser.html";
}

function checkUsername() {
  // Username must be set and at least 3 characters
  if(document.getElementById("username").value.length<3 && (document.getElementById("username").value.length != 0)) {
    CommonDialog.ShowMsg(false,"Username","Please enter a username at least 3 characters long.");
    return false;
  }
  return true;
}

function checkPass(){
  if(document.getElementById("password1").value!==document.getElementById("password2").value) {
    CommonDialog.ShowMsg(false,"Password","The passwords you entered do not match.");
      return false;
  }
  return true;
}

function Finish(){
  Base.CreateBase("systemsettings");
  Base.LoadBase("systemsettings","sys");
  Base.CreateTable("sys", "handlers", "type,apppath");
  Base.CreateTable("sys", "themes", "title,author,themedir");
  Base.CreateTable("sys", "applications", "title,category,path");
  Base.CreateTable("sys","settings","user,application,key,value");
  Base.CreateRecord("sys","themes","title=Glass,author=BlazeByte,themedir=default");
  Base.CreateRecord("sys", "handlers", "type=Document,apppath=apps/accessories/texteditor.html");
  Base.CreateRecord("sys", "handlers", "type=Database,apppath=apps/office/database/index.html");
  var strPassword = isset(document.getElementById("password1").value) ? document.getElementById("password1").value : '' ;
  //Setting.SaveSetting(false,"Gnextop","Password",strPassword);
  Setting.SaveSetting(false,"Gnextop","Theme","default");
  Setting.SaveSetting(false,"Gnextop","BGImage","../themes/default/images/sharp.png");
  // Now change from admin user to new user
  Gnextop.User = document.getElementById("username").value;
  if(!Gnextop.User) {
      Gnextop.User = 'default';
	  Setting.SaveSetting(true,"Gnextop","singleusermode",true);
	  Setting.SaveSetting(true,"Gnextop","autologin",true);
	  Setting.SaveSetting(true,"Gnextop","autologinuser",Gnextop.User);
  }
  else {
	Base.CreateTable("sys", "users", "name,password");
	Base.CreateRecord("sys", "users", "name="+Gnextop.User+",password="+strPassword);
  }
  Setting.SaveSetting(false,"Gnextop","Theme","default");
  Setting.SaveSetting(false,"Gnextop","BGImage","../themes/system/images/sharp.png");
  Disk.WriteFile("Welcome", "Type=Document;", "Welcome to Gnextop, the free PSP Portal by BlazeByte. To find out more about BlazeByte, get Gnextop updates and extras, visit BlazeByte.org.");
  document.getElementById("finished").style.visibility="visible";
  document.getElementById("finish").style.visibility = "hidden";
  document.getElementById("fin").style.visibility = "hidden";
  document.getElementById("prev").style.visibility = "hidden";
  document.getElementById("setupNav").style.visibility="hidden";
  Base.WriteBase("sys");
}

function bbMember(member) {
  document.getElementById("bbusername").disabled = (member == true) ? false : true;
  document.getElementById("bbpassword").disabled = (member == true) ? false : true;
}