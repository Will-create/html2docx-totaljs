NEWSCHEMA('Converter', function(schema) {



    schema.action('html2docx', {
        name: 'Convert html to docx documents',
        query: 'url:URL,filename:String,content:String',
        action: function($, model) {
            if ($.query.url)
                FUNC.fromurl($);
            else 
                FUNC.fromtext($);
        }
    });

    schema.action('html2pdf', {
        name: 'Convert html to docx documents',
        input: 'url:URL, content:String',
        action: function($, model) {

            if (model.url)
                FUNC.fromurl($);
            else 
                FUNC.fromtext($);
        }
    });
});