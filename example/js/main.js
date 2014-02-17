var Q = new Qiniu({
    runtimes: 'html5,flash,html4',
    browse_button: 'pickfiles',
    container: 'container',
    drop_element: 'container',
    max_file_size: '100mb',
    flash_swf_url: 'js/plupload/Moxie.swf',
    // max_retries: 3,
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/token',
    domain: 'http://qiniu-plupload.qiniudn.com/',
    auto_start: true,
    init: {
        'FilesAdded': function(up, files) {
            $('table').show();
            $('#success').hide();
            console.log(up.runtime);
            plupload.each(files, function(file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setStatus("等待...");
            });
        },
        'BeforeUpload': function(up, file) {
            var progress = new FileProgress(file, 'fsUploadProgress');
            var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            if (up.runtime === 'html5' && chunk_size) {
                progress.setChunkProgess(chunk_size);
            }
        },
        'UploadProgress': function(up, file) {
            var progress = new FileProgress(file, 'fsUploadProgress');
            var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);

        },
        'UploadComplete': function() {
            $('#success').show();
        },
        'FileUploaded': function(up, file, info) {
            // console.log(info);
            // console.log(up);
            var progress = new FileProgress(file, 'fsUploadProgress');
            progress.setComplete(up, parseJSON(info));
        },
        'Error': function(up, err, errTip) {
            $('table').show();
            var progress = new FileProgress(err.file, 'fsUploadProgress');
            progress.setError();
            progress.setStatus(errTip);
            // progress.setCancelled();
        }
    }
});

$(function() {
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });
    $('#show_code').on('click', function() {
        $('pre').toggle();
    });
    $('pre code').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    $('body').on('click', 'table button.btn', function() {
        $(this).next('div').toggle();
    });
});
