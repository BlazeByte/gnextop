Gnextop.Widgets = {
  WidgetsLibs : Array(),
  
  Widgets : Array(
    {"name" : "panel",
     "x" : 0,
     "y" : 0,
     "width" : 480,
     "height": 20
    },
    {"name" : "apps",
     "x" : 4,
     "y" : 24,
     "width" : 75,
     "height": 244
    },
    {"name" : "news",
     "x" : 83,
     "y" : 24,
     "width" : 170,
     "height": 135
    },
    {"name" : "cal",
     "x" : 83,
     "y" : 163,
     "width" : 170,
     "height": 105
    },
    {"name" : "mail",
     "x" : 257,
     "y" : 24,
     "width" : 219,
     "height": 109
    },
    {"name" : "notes",
     "x" : 257,
     "y" : 137,
     "width" : 219,
     "height": 109
    },
    {"name" : "search",
     "x" : 257,
     "y" : 250,
     "width" : 153,
     "height": 18
    },
    {"name" : "logo",
     "x" : 418,
     "y" : 255,
     "width" : 58,
     "height": 13,
     "css" : "background: transparent"
    }
  ),

  LoadLibs : function () {
    var html = '';
    
    for (var i in this.Widgets) {
      html += Gnextop.LinkScripts("script/widgets/" + this.Widgets[i].name + ".js");
    }
    
    return html;
  },
  
  AddLib : function (name, widget) {
    this.WidgetsLibs[name] = widget;
  },

  GetHTMLof : function (name) {
    var html = '';
    
    if (this.WidgetsLibs[name] !== undefined) {
      html += this.WidgetsLibs[name].GetHTML();
    }
    
    return html;
  },

  Write : function () {
    var html = "", unit = "px";
    
    for (var i in this.Widgets) {
      widget = this.Widgets[i];
      
      var css = 'css' in widget ? widget.css : '';
      
      html += '<div class="widget" style="left: ' + widget.x + unit + ';top: ' + widget.y + unit + 
                ';width: ' + widget.width + unit + ';height: ' + widget.height + unit + ';' + css + '">';
      
      html += this.GetHTMLof(widget.name);

      
      html += '</div>';
    }
    
    return html;
  }
}


document.write(Gnextop.Widgets.LoadLibs());