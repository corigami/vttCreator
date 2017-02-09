/*
 * File: controller.js
 * Author: Corey Willinger
 * Description: Logic controller for main page.
 */

var View = function() {
    var self = this;
    self.DEFAULT_DURATION = 3;
    self.vttObj;
    self.currentState;
    self.currentDuration;
    self.currentIndex = 0;
    self.fileName = "";

    //initializes the program on page load.
    self.init = function() {
        //define inital view objects based on starting dom
        self.urlInput = $('#videoUrl');
        self.loadVidButton = $('#loadVidButton');
        self.videoPlayer = $('#video-player');
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
        self.outputObj = new VttOutput(self);

        //create our state objects
        self.START_STATE = new StartState(self);
        self.HEAD_STATE = new HeadState(self);
        self.NOT_HEAD_STATE = new NotHeadState(self);
        self.END_STATE = new EndState(self);

        //create our model objects;
        self.vttObj = new VttObject(self);
        self.vttObj.addSegment(new SegObject(0, 0, self.currentDuration, self.currentDuration));
        self.workingSeg = self.vttObj.get(self.currentIndex);
        self.currentState = new StartState(self);
        self.currentState.setUI();

        //add event listeners to our UI
        self.videoPlayer[0].addEventListener("seeked", function() {
            self.videoSeeked();
        });
        self.videoPlayer[0].addEventListener("timeupdate", function() {
            let stopTime = self.currentDuration + self.workingSeg.segStartTime;
            self.timeUpdated(self.videoPlayer[0].currentTime, stopTime);
        });

        // ***********Remove for widget version **********************************
            self.fileSelector = $('<input type="file" id="fileSelector" />');
             $('#file-contain').append(self.fileSelector);
            self.fileSelector.change(function() {
            self.fileName = document.getElementById('fileSelector').value.replace(/.*[\/\\]/, '');
            self.loadVideoFile(self.fileName);
        });

        // ***********Remove for widget version **********************************

        self.loadVidButton.click(function(){
            self.fileName = self.urlInput.val();
            self.loadVideoFile(self.fileName);
            console.log("here")
        });

        self.urlInput.keyup(function(){
            if(validUrl(self.urlInput.val())){
                 $('#loadVidButton').prop('disabled',false);
            }
        });

        self.loadVideoFile = function(src){
            console.log("here:1");
            self.videoPlayer.attr('src',src);
            self.vttObj = new VttObject(view);
            self.vttObj.addSegment(new SegObject(0, 0, self.currentDuration, self.currentDuration));
            self.workingSeg = self.vttObj.get(self.currentIndex);
            self.currentState = new StartState(self);
            self.currentState.setUI();
        };

        self.durationInput.change(function() {
            self.currentDuration = self.durationInput.val();
        });

        self.durationPlusButton.click(function() {
            let time = parseFloat(self.currentDuration) + 0.5;
            self.currentDuration = time;
            self.durationInput.val(self.currentDuration);
        });
        self.durationMinusButton.click(function() {
            let time = parseFloat(self.currentDuration) - 0.5;
            self.currentDuration = time;
            self.durationInput.val(self.currentDuration);
        });

        self.nextButton.click(function() {
            self.currentIndex++;
            self.currentState.updateWorkingSegment();
            self.currentState.clickNext();
            self.generateVTT();
        });
        self.prevButton.click(function() {
            self.currentIndex--;
            self.currentState.updateWorkingSegment();
            self.currentState.clickPrev();
            self.generateVTT();
        });
        self.finishButton.click(function() {
            self.currentState.updateWorkingSegment();
            self.generateVTT();
        });
    };

    //plays the video when the time has changed.
    self.videoSeeked = function() {
        self.videoPlayer[0].play();
    };

    //sets the player to the current segment start time
    //TODO need to add logic to check for nearest segment
    self.timeUpdated = function(time, sTime) {
        if (time >= sTime) {
            self.videoPlayer.get(0).currentTime = self.workingSeg.segStartTime;
        }
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

};

validUrl = function(str) {
var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
    return pattern.test(str);
}

var view = new View();
view.init();
//view.videoPlayer.attr('src', "Slide 10.mp4");

/*
$(document).keypress(function(e) {
    if (e.which == 13) {
        view.nextButton.click();
    } else if (e.which == 13) {

    }
    e.stopPropagation();
}); */