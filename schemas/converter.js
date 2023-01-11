const TYPE  = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

NEWSCHEMA('Converter', function(schema) {

    schema.define('html', 'String');
    schema.define('url', 'URL');
    schema.define('dpi', 'Number');
    schema.define('toc', 'Boolean');
    schema.define('orientation', ['portrait', 'landscape']);
    schema.define('page', ['a3', 'a4', 'a5', 'letter']);

    schema.action('exec', {
        name: 'Convert html to docx documents',
        action: async function($, model) {
            var doc;

            if (model.url)
                doc = await FUNC.fromurl($);
            else
                doc = await FUNC.fromhtml($);

            const stream = F.Fs.createReadStream(doc);
            $.res.stream(TYPE,stream);
        }
    });
});