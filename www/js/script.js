var pictureSource;   // picture source
var destinationType; // sets the format of returned value

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    // Now safe to use device APIs
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function getPhoto() {
    navigator.camera.getPicture(onImageRetrieve, onImageOrPhotoFail, {quality: 50,
        correctOrientation: true,
        destinationType: destinationType.FILE_URI});
}

function getImage(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onImageRetrieve, onImageOrPhotoFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        correctOrientation: true,
        sourceType: source});
}

function onImageRetrieve(imageURI) {

    var pass = function (r) {
        clearCache();
        $('#p-img').attr('src', '');
        $('#p-img').attr('src', 'http://www.primefield.co/jobsearch/pictureurl/' + localStorage.getItem("userID") + '.jpg');


    }

    var fail = function (error) {
        clearCache();

    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.png';
    options.mimeType = "text/plain";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://www.primefield.co/jobsearch/uploadimage.php?userid=" + localStorage.getItem("userID")), pass, fail, options);


    //socket.emit('user image', "data:image/jpeg;base64," + imageData, thisClientID, currentGroupID);
}

// REUSABLE PHOTO FUNCTION
function onImageOrPhotoFail(message) {
    //alert('Failed because: ' + message);
}

function clearCache() {
    navigator.camera.cleanup();
}

function backsignout() {
    if (localStorage.getItem("setupvialinkedin") == "true") {
        localStorage.setItem("setupvialinkedin", "false");
        localStorage.clear();
        location.replace('signin.html');
        //IN.User.logout(callbackFunction, callbackScope);
    }
    else {
        localStorage.clear();
        location.replace('signin.html');
    }

}

/*
 * VIDEO FUNCTIONS
 * 
 */

function captureVideo(highquality, frontcamera, duration) {

    window.plugins.videocaptureplus.captureVideo(
            captureSuccess,
            captureError,
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

function captureSuccess(mediaFiles) {
    var videoName = localStorage.getItem("userID");
    $('#videoEtakingbtn').text('Retake');
    $('#postjobvideo').show();
    var i, len;

    for (i = 0, len = mediaFiles.length; i < len; i++) {
        var mediaFile = mediaFiles[i];
        mediaFile.getFormatData(getFormatDataSuccess, getFormatDataError);

        if (device.platform == 'Android') {
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fileSystem) {
                var tempURL = fileSystem.root.toURL();
                var videoPath = mediaFile.fullPath.substring(0, 5) + "//" + mediaFile.fullPath.substring(5, mediaFile.fullPath.length);
                var thumbFile = tempURL + videoName + '.jpg';
                window.PKVideoThumbnail.createThumbnail(videoPath, thumbFile, function (s) {
                    sendVideoThumbnail(mediaFile.fullPath, thumbFile, videoName);
                }, function (e) {
                });
            });
        } else if (device.platform == 'iOS') {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                var tempURL = cordova.file.tempDirectory;
                var videoPath = "file://" + mediaFile.fullPath;
                var thumbFile = tempURL + videoName + '.jpg';
                window.PKVideoThumbnail.createThumbnail(videoPath, thumbFile, function (s) {
                    sendVideoThumbnail(videoPath, thumbFile, videoName);
                }, function (e) {
                });
            });
        }
    }
}

function sendVideoThumbnail(videoPath, thumbSrc, vidThumbName) {
    var options = new FileUploadOptions();
    var ft = new FileTransfer();
    options.fileKey = "file";
    $('#videothumbnail').hide();
    $('#videotakingbtn').hide();
    $('#videothumbnail').attr('src', '" "');
    if (device.platform == 'Android') {
        // upload the file to the server
        ft.upload(thumbSrc, encodeURI("http://www.primefield.co/jobsearch/uploadthumbnail.php?imgid=" + vidThumbName), function (resp) {
            $('#videothumbnail').attr('src', 'http://www.primefield.co/jobsearch/videos/' + vidThumbName + '.jpg');
            $('#videothumbnail').show();
            
            sendVideo(videoPath, vidThumbName);
        }, function (error) {
        }, options);
    } else if (device.platform == 'iOS') {
        // upload the file to the server
        ft.upload(thumbSrc, encodeURI("http://www.primefield.co/jobsearch/uploadthumbnail.php?imgid=" + vidThumbName), function (resp) {
             $('#videothumbnail').attr('src', 'http://www.primefield.co/jobsearch/videos/' + vidThumbName + '.jpg');
            $('#videothumbnail').show();
            sendVideo(videoPath, vidThumbName);
        }, function (error) {
        }, options);
    }
}

function getFormatDataSuccess(mediaFileData) {
    //document.getElementById('video_meta_container').innerHTML = mediaFileData.duration + ' seconds, ' + mediaFileData.width + ' x ' + mediaFileData.height;
}

function captureError(error) {
    // code 3 = cancel by user
    //alert('Returncode: ' + JSON.stringify(error.code));
    $('#postjobvideo').hide();
    $('#videoEtakingbtn').text('Camera');
}

function getFormatDataError(error) {
    alert('A Format Data Error occurred during getFormatData: ' + error.code);
}

function sendVideo(videoSrc, videoName) {
    var options = new FileUploadOptions();
    var ft = new FileTransfer();
    options.fileKey = "file";

    if (device.platform == 'Android') {
        // upload the file to the server
        
         //$('#videothumbnail').attr('src', 'img/dummy.png');
        ft.upload(videoSrc, encodeURI("http://www.primefield.co/jobsearch/uploadvideo.php?videoid=" + videoName), function (resp) {
           //$('#videotakingbtn').hide();
            //$('#videothumbnail').removeAttr('src');
          
            $('#videothumbnail').attr('onclick', 'openFile(\'http://www.primefield.co/jobsearch/videos/' + videoName + '.mp4\')');

            //$('#videodiv').append('<img onclick="openFile(\'http://www.primefield.co/jobsearch/videos/'+ videoName + '.mp4\');"  src="http://www.primefield.co/jobsearch/videos/' + videoName + '.jpg" alt=""/>');

        }, function (error) {

        }, options);
    } else if (device.platform == 'iOS') {
        // upload the file to the server
      
        ft.upload(videoSrc, encodeURI("http://www.primefield.co/jobsearch/uploadvideo.php?videoid=" + videoName), function (resp) {
             
         
            
            $('#videothumbnail').attr('onclick', 'openFile(\'http://www.primefield.co/jobsearch/videos/' + videoName + '.mp4\')');

            //$('#videodiv').append('<img onclick="openFile(\'http://www.primefield.co/jobsearch/videos/'+ videoName + '.mp4\');"  src="http://www.primefield.co/jobsearch/videos/' + videoName + '.jpg" alt=""/>');


        }, function (error) {
        }, options);
    }
}


function openFile(src) {
    cordova.plugins.disusered.open(src, function () {
        console.log('open success');
    }, function () {
        console.log('open failed');
    });
}