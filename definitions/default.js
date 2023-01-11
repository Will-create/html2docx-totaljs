var foldername = NOW.format('dd.MM.yyyy');
PATH.mkdir(PATH.public('docs/'+ foldername));
PATH.mkdir(PATH.public('html/'+ foldername));
MAIN.foldername = foldername

function extract($) {
    
    var obj =  {};

    obj.id = UID();
    obj.url = $.body.url || '';
    obj.content = $.body.html || '';
    obj.dpi = $.body.dpi || '';
    obj.toc = $.body.toc || false;
    obj.page = $.body.page || 'a4';
    obj.orientation = $.body.orientation || 'portrait';
    obj.reference = obj.page + '-' + obj.orientation + '.docx';
    obj.filename = NOW.format('HH:mm') + 'document_' + obj.id + '.docx';
    obj.path = PATH.public('docs/' + MAIN.foldername + '/' + obj.filename);
    return obj;
}


FUNC.fromurl = function($) {

    var obj = extract($);

    var command = 'pandoc -f html -t docx -o ' + obj.path + ' --reference-doc=' + PATH.public('refs/' + obj.reference);

    obj.toc && (command += ' --toc');
    obj.dpi && (command += ' --dpi=' + obj.dpi);
    obj.url && (command += ' ' + obj.url);


    console.log('Here object --->', obj);

    return new Promise(function(resolve, reject) {
        SHELL(command, function(err, response) {
            if (err) {
                $.invalid(err);
                reject();
            } else 
                resolve(obj.path);
        });
    });
};

FUNC.fromhtml = async function($) {

    var obj = extract($);

    var command = 'pandoc -f html -t docx -o ' + obj.path + ' --reference-doc=' + PATH.public('refs/' + obj.reference);

    obj.toc && (command += ' --toc');
    obj.dpi && (command += ' --dpi=' + obj.dpi);

    var filename = await savefile(obj, $);

    filename && (command += ' ' + filename);

    console.log('Here object --->', obj);

    return new Promise(function(resolve, reject) {
        SHELL(command, function(err, response) {
            if (err) {
                $.invalid(err);
                reject();
            } else 
                resolve(obj.path);
        });
    });
};


var savefile = function (opt, $) {
    return new Promise(function(resolve, reject) {
        var file = PATH.public('html/' + MAIN.foldername + '/' + opt.filename.replace('.docx', '.html'));
        F.Fs.writeFile(file, opt.content, function(err){
            if (err) {
                $.invalid(err);
                reject();
            } else 
                resolve(file);
        });
    });

};


ON('service', function() {
    if (NOW.format('HH:mm') === '00:00') {
        var foldername = NOW.format('dd.MM.yyyy');
        PATH.mkdir(PATH.public('docs/'+ foldername));
        PATH.mkdir(PATH.public('html/'+ foldername));
        MAIN.foldername = foldername
    }
});