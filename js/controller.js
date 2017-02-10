/*
 * File: controller.js
 * Author: Corey Willinger
 * Description: Logic controller for main page.
 */

var View = function() {
    var self = this;
    self.DEFAULT_DURATION = 3;
    self.vttObj;
    self.controllerState;
    self.playerState;
    self.currentDuration;
    self.currentIndex;
    self.fileName = "";

    //initializes the program on page load.
    self.init = function() {
        //define inital view objects based on starting dom
        self.urlInput = $('#videoUrl');
        self.loadVidButton = $('#loadVidButton');
        self.videoPlayer;
        self.durationInput = $('#durationInput');
        self.durationPlusButton = $('#durationPlusButton');
        self.durationMinusButton = $('#durationMinusButton');
        self.nextButton = $('#nextButton');
        self.prevButton = $('#prevButton');
        self.finishButton = $('#finishButton');
        self.text1 = $('#textline1');
        self.text2 = $('#textline2');
        self.currentDuration = parseFloat($('#durationInput').val());
        self.outputText = $('#vttOutputText');

        //create our state objects
        self.START_STATE = new StartState(self);
        self.HEAD_STATE = new HeadState(self);
        self.NOT_HEAD_STATE = new NotHeadState(self);
        self.END_STATE = new EndState(self);


        self.initGUI = function() {
            self.text1.val('');
            self.text2.val('');
            self.outputText.val('');
            self.initModel();
            self.controllerState.setUI();
        };

        self.initModel = function() {
            self.currentIndex = 0;
            self.vttObj = new VttObject(self);
            self.vttObj.addSegment(new SegObject(0, 0, self.DEFAULT_DURATION, self.DEFAULT_DURATION));
            self.workingSeg = self.vttObj.get(0);
            self.controllerState = new StartState(self);
            self.outputObj = new VttOutput(self);
            self.controllerState = new StartState(self);

        };

        // ***********Remove for widget version **********************************
        self.loadFileSelector();
        // ***********Remove for widget version **********************************

        self.loadVidButton.click(function() {
            self.fileName = self.urlInput.val();
            self.loadVideoFile(self.fileName);
        });

        self.urlInput.keyup(function() {
            if (validUrl(self.urlInput.val())) {
                $('#loadVidButton').prop('disabled', false);
            }
        });

        self.loadVideoFile = function(src) {
            self.loadFileSelector();
             if (src.indexOf("youtube") >= 0) {
                self.addYouTubePlayer(src);
            } else {
                self.addMp4Player(src);
            }

            self.initGUI();
        };

        self.durationInput.change(function() {
            self.currentDuration = self.durationInput.val();
        });

        self.durationPlusButton.click(function() {
            let time = parseFloat(self.currentDuration) + 0.25;
            self.currentDuration = time;
            self.durationInput.val(self.currentDuration);
        });
        self.durationMinusButton.click(function() {
            let time = parseFloat(self.currentDuration) - 0.25;
            self.currentDuration = time;
            self.durationInput.val(self.currentDuration);
        });

        self.nextButton.click(function() {
            self.currentIndex++;
            self.controllerState.updateWorkingSegment();
            self.controllerState.clickNext();
            self.generateVTT();
        });
        self.prevButton.click(function() {
            self.currentIndex--;
            self.controllerState.updateWorkingSegment();
            self.controllerState.clickPrev();
            self.generateVTT();
        });
        self.finishButton.click(function() {
            self.controllerState.updateWorkingSegment();
            self.generateVTT();
        });

    };

    self.printCurrentSeg = function() {
        console.log("------Current Segment-------")
        console.log(self.workingSeg);
        console.log(" ");
        console.log("Index: " + self.workingSeg.segIndex);
        console.log("StartTime: " + self.workingSeg.segStartTime);
        console.log("StopTime: " + self.workingSeg.segStopTime);
        console.log("Duration: " + self.workingSeg.segDuration);
        console.log("------End Segment-------")
    };

    self.generateVTT = function() {
        self.outputText.val(self.outputObj.buildOutput());
    };

    self.loadFileSelector = function() {
        $('#local-file').empty();
        $('#local-file').append('<br>or<br><br><input type="file" id="fileSelector" />');
        self.fileSelector = $('#fileSelector');
        self.fileSelector.change(function() {
            self.fileName = $('#fileSelector').val().replace(/.*[\/\\]/, '');
            self.loadVideoFile(self.fileName);
            self.urlInput.val('');
        });

    }

    self.addYouTubePlayer = function(src) {
        $('#vid-contain').empty();
        $('#vid-contain').append('<div id="youTube-contain"></div>');
        var onPlayerReady = function(event) {
            event.target.playVideo();
        };

        //get vid id from youTube src
        var video_id = src.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }

        // The first argument of YT.Player is an HTML element ID. YouTube API will replace my <div id="player"> tag with an iframe containing the youtube video.
        self.youTubePlayer = new YT.Player('youTube-contain', {
            height: 480,
            width: 640,
            videoId: video_id,
            events: {
                'onReady': function() {
                    self.playerState = new YouTubeState(self);
                    self.youTubePlayer.playVideo();
                    self.playerState.checkTime();
                }
            }
        });

    };

    self.addMp4Player = function(src) {
        var vidContainer = $('#vid-contain');
        vidContainer.empty();
        vidContainer.append('<video id="video-player" width="640" height="480" controls>' +
            '<source src="" type="video/mp4"/>' +
            '</video>');
        self.videoPlayer = $('#video-player');
        self.videoPlayer = $('#video-player');
        view.videoPlayer.attr('src', src);
        self.playerState = new StandardState(self);
        self.videoPlayer[0].play();

        //add event listeners to our UI
    };

};

validUrl = function(str) {
    var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
    return pattern.test(str);
}

var view = new View();
view.init();