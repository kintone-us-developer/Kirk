jQuery.noConflict();

(function($, PLUGIN_ID) {
  var config=kintone.plugin.app.getConfig(PLUGIN_ID);
  if(config&&config.activation!='active'){
    return;
  }
  var text='';
  var textField=config.textField;
  var countField=config.countField;

  var load=['app.record.edit.show',
            'app.record.create.show',
            'app.record.index.edit.show'];
  var change=['app.record.create.change.'+countField];
  var i = 0;

  document.onkeyup=function(e){
    count = document.getElementById("31_5521622-:14-text").value;
    if(e.keyCode==8){

    document.getElementById("31_5521622-:14-text").value=document.getElementById("31_5521622-:14-text").value-1;
  }
  else{
     e = e || window.event;
    document.getElementById("31_5521622-:14-text").value=i+1;

    i++;
  }

  }

      /*<textarea name="31_5521618" id="31_5521618-textarea"
       class="textarea-cybozu" style="box-sizing: border-box;
        width: 297px; height: 123px;"></textarea>*/

        /* <input id="31_5521622-:14-text" type="text"
        class="input-text-cybozu input-number-cybozu"
         min="null" max="null" step="null" disabled=""> */

  kintone.events.on(change,function(event){
    console.log('hi');
  });

  kintone.events.on(load,function(event){
  event.record[countField].disabled=true;


  return event;
});






})(jQuery, kintone.$PLUGIN_ID);
