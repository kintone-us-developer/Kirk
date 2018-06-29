jQuery.noConflict();
(function($, PLUGIN_ID) {

    'use strict';
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    if(config&&config.activation!='active'){
      return;
    }

    var dateField=config.dateField;
    var dayField=config.dayField;

    var load=['app.record.edit.show',
              'app.record.create.show',
              'app.record.index.edit.show'];

    var set=['app.record.edit.change.'+dateField,
             'app.record.create.change.'+dateField,
             'app.record.index.edit.change'+dateField];

    kintone.events.on(set,function(event){
      var date=event.record[dateField].value;
      event.record[dayField].value=moment(date).format('dddd');
      return event;
    });

    kintone.events.on(load,function(event){
    event.record[dayField].disabled=true;
    return event;
  });
  
})(jQuery, kintone.$PLUGIN_ID);
