/*globals document,view,VttOutput,$:false */
var PlayerState = function(view) {
    self = this;
    self.isAtEnd = function(){
    }
    this.name = "BaseState";
};

//Defines behavior when we are a standard html5 player.
//It extends the PlayerState prototype
var StandardState = function(view) {
    self = this;
    self.name = "StandardState";
    self.setTime = function(time) {
        view.videoPlayer[0].currentTime = view.workingSeg.segStartTime;
    };

    self.isAtEnd = function(){
        return (view.videoPlayer[0].duration < view.workingSeg.segStopTime)
    };

    self.setMaxDuration = function(){
         view.currentDuration = view.videoPlayer[0].duration - view.workingSeg.segStartTime
    }

    //TODO need to add logic to check for nearest segment
    view.videoPlayer[0].addEventListener("seeked", function() {
        view.videoPlayer[0].play();
    });

    view.videoPlayer[0].addEventListener("timeupdate", function() {
        let stopTime = view.currentDuration + view.workingSeg.segStartTime;
        if (view.videoPlayer[0].currentTime >= stopTime) {
            self.setTime(view.workingSeg.segStartTime);
        }
    });

};
StandardState.prototype = Object.create(PlayerState.prototype);

//Defines behavior when we are a youTube player.
//It extends the PlayerState prototype
var YouTubeState = function(view) {
    self = this;
    self.name = "YouTubeState";
    self.videoTime = 0;
    self.setTime = function(time) {
        view.youTubePlayer.seekTo(time, true);
        view.youTubePlayer.playVideo();
        self.checkTime();
    };

    self.isAtEnd = function(){
        return (view.youTubePlayer.getDuration() < view.workingSeg.segStopTime)
    };

    self.setMaxDuration = function(){
         view.currentDuration = view.youTubePlayer.getDuration() - view.workingSeg.segStartTime
    }

    //You tube doesn't have an time Event trigger, so we have to make check periodically
    self.checkTime = function() {
        setTimeout(function() {
            let stopTime = view.currentDuration + view.workingSeg.segStartTime;
            var videotime = view.youTubePlayer.getCurrentTime();
            if (videotime < stopTime) {
                self.checkTime(); //Recursive call.
            } else {
                self.setTime(view.workingSeg.segStartTime);
            }
        }, 100);
    }
};
YouTubeState.prototype = Object.create(PlayerState.prototype);