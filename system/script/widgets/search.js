
Gnextop.Widgets.AddLib('search', {

  GetHTML : function() {
    var html = '';
    html +=
        '<form action="http://www.google.com/search" method="get" target="_blank" />' +
        '  <input maxlength="256" name="q" value="internet search..." style="width: 80%;" />' +
        '  <input type="submit" value="Go" style="width: 15%;"  />' +
        '</form> ';
    return html;
  },

});

