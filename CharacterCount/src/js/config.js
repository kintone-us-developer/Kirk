jQuery.noConflict();
(function($, PLUGIN_ID) {

    'use strict';

    // params from user specifications
    var USER = kintone.getLoginUser();
    var LANG = USER.language;

    // multi-language settings
    var terms = {
        en: {
            configTitle: 'Settings',
            pluginActivation: 'Plug-in activation',
            pluginActive: 'Active',
            kintoneFieldConfig: 'Kintone field settings',
            kintoneTextAreaField: 'Text Area Field',
            kintoneNumberField: 'Count Field',
            pluginSubmit: 'Save',
            pluginCancel: 'Cancel',
            textRowNum: 'Character Count (plug-in))',
            textKintoneFields: 'Please create the following fields in your app form.',
            textApiError: 'Error occurred.'
        }
    };
    var i18n = LANG in terms ? terms[LANG] : terms.en;

    // append events (call in renderHtml)
    var appendEvents = function appendEvents() {
        // save plug-in settings
        $('#submit').click(function() {
            var config = {};
            config.activation = $('#activation').prop('checked') ? 'active' : 'deactive';
            config.countField = $('#countField').val();
            config.textField = $('#textField').val();
            kintone.plugin.app.setConfig(config);
        });

        // cancel plug-in settings
        $('#cancel').click(function() {
            history.back();
        });
    };

    // create HTML (call in renderHtml)
    var createHtml = function(fields) {
        // template & items settings
        // '#plugin-template' is defined in config.html
        var template = $.templates(document.querySelector('#plugin-template'));
        var templateItems = {
            configTitle: i18n.configTitle,
            // section1 activate plug-in
            pluginActivation: {
                pluginActivation: i18n.pluginActivation,
                pluginActive: i18n.pluginActive
            },
            // section2 kintone fields settings
            kintoneFieldConfig: i18n.kintoneFieldConfig,
            textKintoneFields: i18n.textKintoneFields,
            kintoneFields: [{
                title: i18n.kintoneNumberField,
                require: '*',
                row: '',
                id: 'countField',
                fields: fields['countField']
            }, {
                title: i18n.kintoneTextAreaField,
                require: '*',
                row: '',
                id: 'textField',
                fields: fields['textField']
              }],
            // section3 buttons
            pluginSubmit: i18n.pluginSubmit,
            pluginCancel: i18n.pluginCancel
        };
        // render HTML
        $('#plugin-container').html(template(templateItems));
    };

    // render HTML
    var renderHtml = function() {
        kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {
            'app': kintone.app.getId()
        }, function(resp) {
            var fields = {
                'textField': [],
                'countField': []
            };

            //collect the table fields in the app
            for(var key in resp.properties){
              var field=resp.properties[key];
              switch(field.type){
                case 'MULTI_LINE_TEXT':
                    var item={
                    label: field.label||field.code,
                    code: field.code,
                    type: field.type};
                    fields['textField'].push(item);
                    break;
                case 'NUMBER':
                    var item={
                    label: field.label||field.code,
                    code: field.code,
                    type:field.type};
                    fields['countField'].push(item);
              }
            }

            //sort the options for each dropdown
            Object.keys(fields).forEach(function(f) {
                fields[f].sort(function(a, b) {
                    var aa = a.label + a.code;
                    var bb = b.label + b.code;
                    aa = aa.toUpperCase();
                    bb = bb.toUpperCase();
                    if (aa < bb) {
                        return -1;
                    } else if (aa > bb) {
                        return 1;
                    }
                    return 0;
                });
            });
            //create the page
            createHtml(fields);
            // if previously set, set to existing values
            var config = kintone.plugin.app.getConfig(PLUGIN_ID);

            if (config) {
                $('#activation').prop('checked', config.activation === 'active');
                $('#countField').val(config.countField);
                $('#textField').val(config.textField);


            }
            // append events
            appendEvents();
        });
    };

    // initiated
    $(document).ready(function() {
        renderHtml();
    });
})(jQuery, kintone.$PLUGIN_ID);
