const DOWNLOAD_ROOT = '/download/';


function extract($) {
    
    var obj =  {};

    obj.id = UID();
    obj.url = $.query.url || '';
    obj.name = $.query.filename || '';
    obj.content = $.query.content || '';
    obj.foldername = $.query.to === 'pdf' ? 'pdf' : 'docs';
    obj.filename = obj.foldername + '/' + (obj.name || 'document_' + obj.id) + '.docx';
    obj.path = PATH.public(obj.filename);
    PATH.mkdir(PATH.public(obj.foldername));
    return obj;
}


FUNC.fromurl = function($) {

    var obj = extract($);

    var command = 'pandoc -f html -t docx -o ' + obj.path + ' ' + obj.url;
    var hostname = $.controller.hostname();
    SHELL(command, function(err, ) {
        if (err)
            $.success({ success: false, resonse: err });
        else 
            $.success( hostname + DOWNLOAD_ROOT + obj.filename);
        
    });
};

// FUNC.fromtext = function($) {
//     var obj = extract($);


//     savefile(obj, function(filename) {

//         var command = 'pandoc -f ' + obj.from + ' -t '+ obj.to +' -o ' + obj.path + ' ' + PATH.public(filename);

//         SHELL(command, function(err, response) {
//             console.log(obj);
//             if (err)
//                 $.json({ success: false, resonse: err });
//             else
//                 $.redirect( DOWNLOAD_ROOT + obj.filename);
            
//         });
//     });
// };


// FUNC.fromfile = function($) {

//     var obj = extract($);
//     var file = $.files[0];
//     savefile(file, obj, function(meta) {

//         var command = 'pandoc -f ' + obj.from + ' -t '+ obj.to +' -o ' + obj.path + ' ' + PATH.public(meta.filename);

//         SHELL(command, function(err, response) {
//             console.log(obj);
//             if (err)
//                 $.json({ success: false, resonse: err });
//             else
//                 $.redirect( DOWNLOAD_ROOT + obj.filename);
            
//         });
//     });


// };



var savefile = async function (file, opt, callback) {
    PATH.mkdir(PATH.public(opt.foldername));

    if (callback === undefined) {
        callback = opt;
        opt = file;
        file = null;
    }


    if (file && typeof(file) === 'object') {
        
        F.Fs.readFile(file.path, function(err, bin) {
            console.log(file);
            var filename = PATH.public(opt.foldername + '/' + U.getName(file.path).split('.')[0] + '.' + U.getExtension(file.filename));
            F.Fs.writeFile(filename, bin, function(err, res){
                callback({ filename: filename });
            });
        });

    } else {

        var obj = {};
        obj.id = UID();
        obj.filename = opt.foldername + '/' + (opt.name || 'document') + '_' + obj.id  + '.' + opt.to;
        obj.path = PATH.public(obj.filename);
        
        if (!opt.content && opt.url) {
            obj.filename2 = opt.foldername + '/' + (opt.name || 'document') + '_' + obj.id  + '.' + opt.from;
            obj.path2 = PATH.public(obj.filename2);

            console.log(opt);
            RESTBuilder.GET(opt.url).callback(function(err, response, output) {
                F.Fs.writeFile(obj.path2, output.response, function(err, res){
                    callback(obj);
                });
            });
        } else {
            F.Fs.writeFile(obj.path, opt.content, function(err, res){
                callback(obj);
            });
        }

        
    }
};