//Gnextop.Boot.Msg('Preparing Desktop Icons library...');
//Gnextop.Boot.UpdateProg(10, true);

Gnextop.Widgets.AddLib('apps', {
  Items : new Array(),


  DefineDesktopIcon : function (strTitle, strIcon, strAction, strCss) {
    var item = new Object();
    item.Title = strTitle;
    item.Icon = strIcon;
    item.Action = strAction;
    item.CSS = (isset(strCss)) ? strCss : "";
    this.Items.push(item);
  },

  GetHTML : function () {
    this.DefineDesktopIcon("File Browser","images/icons/large/file.png","Window.Open('apps/accessories/filebrowser.html');");
    this.DefineDesktopIcon("Web Browser","images/icons/large/webbrowser.png","Window.Open('apps/internet/webbrowser/index.html');");
    this.DefineDesktopIcon("Word Processor","images/icons/large/wordpro.png","Window.Open('apps/accessories/texteditor.html');");
    this.DefineDesktopIcon("Instant Messenger","images/icons/large/im.png","Window.Open('apps/internet/messenger.html');");
    this.DefineDesktopIcon("Image Organiser","images/icons/large/imageviewer.png","Window.Open('apps/graphics/imageorganiser/index.html');");
    
    var html = '<div id="divDesktopIcons"><div class="title">Apps</div>';

    for (var intItem in this.Items) {
      var item = this.Items[intItem];
      var intLeft = Math.floor(intItem / 3) * 80;
      var intTop = (intItem - (Math.floor(intItem / 3) * 3)) * 85;
      html += '<div class="DesktopIcon" style="left:' + intLeft + 'px;top:' + intTop + 'px;' + item.CSS + '" onclick="Menu.Hide(\'all\');' + item.Action + '"><a href="javascript:;"><img src="../themes/' + Gnextop.ThemeDir + '/' + item.Icon + '" /></a>' +
              '<div class="DesktopIconTextShadow">' + item.Title + '</div>' +
              '<div class="DesktopIconText">' + item.Title + '</div></div>\n';
    }

    html += '</div>\n';
    return html;
    
  }
});