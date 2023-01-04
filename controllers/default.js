exports.install = function() {
    ROUTE('GET /', home);
    //ROUTE('GET /convert/html2docx/         *Converter --> html2docx', [60000]);
    ROUTE('GET /convert/         *Converter --> html2docx', [60000]);
    FILE('/download/*', download);
}

function download(req, res) {
    var url = req.url.split('/docs/')[1];
    var path = PATH.public('docs/' + url)

    res.file(path);
};


function home() {
    var self = this;

    self.plain('home')
}
