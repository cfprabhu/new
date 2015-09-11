/*
 * VIDEO FUNCTIONS
 * 
 */

function captureEVideo(highquality, frontcamera, duration) {
    window.plugins.videocaptureplus.captureVideo(
            captureESuccess,
            captureEError,
            {
                limit: 1,
                duration: duration,
                highquality: highquality,
                frontcamera: frontcamera,
                // you'll want to sniff the useragent/device and pass the best overlay based on that.. assuming iphone here
                portraitOverlay: 'www/img/cameraoverlays/overlay-iPhone-portrait.png',
                landscapeOverlay: 'www/img/cameraoverlays/overlay-iPhone-landscape.png'
            }
    );
}

function captureESuccess(mediaFiles) {
    var videoName = localStorage.getItem("jobID");
    var i, len;

    for (i = 0, len = mediaFiles.length; i < len; i++) {
        var mediaFile = mediaFiles[i];
        mediaFile.getFormatData(getFormatEDataSuccess, getFormatEDataError);

        if (device.platform == 'Android') {
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fileSystem) {
                var tempURL = fileSystem.root.toURL();
                var videoPath = mediaFile.fullPath.substring(0, 5) + "//" + mediaFile.fullPath.substring(5, mediaFile.fullPath.length);
                var thumbFile = tempURL + videoName + '.jpg';
                window.PKVideoThumbnail.createThumbnail(videoPath, thumbFile, function (s) {
                    sendVideoEThumbnail(mediaFile.fullPath, thumbFile, videoName);
                }, function (e) {
                });
            });
        } else if (device.platform == 'iOS') {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                var tempURL = cordova.file.tempDirectory;
                var videoPath = "file://" + mediaFile.fullPath;
                var thumbFile = tempURL + videoName + '.jpg';
                window.PKVideoThumbnail.createThumbnail(videoPath, thumbFile, function (s) {
                    sendVideoEThumbnail(videoPath, thumbFile, videoName);
                }, function (e) {
                });
            });
        }
    }
}

function sendVideoEThumbnail(videoPath, thumbSrc, vidThumbName) {
    var options = new FileUploadOptions();
    var ft = new FileTransfer();
    options.fileKey = "file";
    //$('#videoEthumbnail').hide();
    //$('#videoEtakingbtn').hide();
    $('#videoEthumbnail').attr('src', ' ');
    if (device.platform == 'Android') {
        // upload the file to the server
        ft.upload(thumbSrc, encodeURI("http://www.primefield.co/jobsearch/uploadthumbnail.php?imgid=" + vidThumbName), function (resp) {
            
            $('#videoEthumbnail').attr('src', 'http://www.primefield.co/jobsearch/videos/' + vidThumbName + '.jpg');
            $('#videoEthumbnail').show();
            
            sendEVideo(videoPath, vidThumbName);
        }, function (error) {
        }, options);
    } else if (device.platform == 'iOS') {
        // upload the file to the server
        ft.upload(thumbSrc, encodeURI("http://www.primefield.co/jobsearch/uploadthumbnail.php?imgid=" + vidThumbName), function (resp) {
             $('#videoEthumbnail').attr('src', 'http://www.primefield.co/jobsearch/videos/' + vidThumbName + '.jpg');
            $('#videoEthumbnail').show();
            sendEVideo(videoPath, vidThumbName);
        }, function (error) {
        }, options);
    }
}

function getFormatEDataSuccess(mediaFileData) {
    //document.getElementById('video_meta_container').innerHTML = mediaFileData.duration + ' seconds, ' + mediaFileData.width + ' x ' + mediaFileData.height;
}

function captureEError(error) {
    // code 3 = cancel by user
    //alert('Returncode: ' + JSON.stringify(error.code));
}

function getFormatEDataError(error) {
    alert('A Format Data Error occurred during getFormatData: ' + error.code);
}

function sendEVideo(videoSrc, videoName) {
    var options = new FileUploadOptions();
    var ft = new FileTransfer();
    options.fileKey = "file";

    if (device.platform == 'Android') {
        // upload the file to the server
        
         //$('#videothumbnail').attr('src', 'img/dummy.png');
        ft.upload(videoSrc, encodeURI("http://www.primefield.co/jobsearch/uploadvideo.php?videoid=" + videoName), function (resp) {
           //$('#videotakingbtn').hide();
            //$('#videothumbnail').removeAttr('src');
          
            $('#videoEthumbnail').attr('onclick', 'openFile(\'http://www.primefield.co/jobsearch/videos/' + videoName + '.mp4\')');

            //$('#videodiv').append('<img onclick="openFile(\'http://www.primefield.co/jobsearch/videos/'+ videoName + '.mp4\');"  src="http://www.primefield.co/jobsearch/videos/' + videoName + '.jpg" alt=""/>');

        }, function (error) {

        }, options);
    } else if (device.platform == 'iOS') {
        // upload the file to the server
      
        ft.upload(videoSrc, encodeURI("http://www.primefield.co/jobsearch/uploadvideo.php?videoid=" + videoName), function (resp) {
             
         
            
            $('#videoEthumbnail').attr('onclick', 'openFile(\'http://www.primefield.co/jobsearch/videos/' + videoName + '.mp4\')');

            //$('#videodiv').append('<img onclick="openFile(\'http://www.primefield.co/jobsearch/videos/'+ videoName + '.mp4\');"  src="http://www.primefield.co/jobsearch/videos/' + videoName + '.jpg" alt=""/>');


        }, function (error) {
        }, options);
    }
}


// function openEFile(src) {
//     cordova.plugins.disusered.open(src, function () {
//         console.log('open success');
//     }, function () {
//         console.log('open failed');
//     });
// }