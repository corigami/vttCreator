/*globals document,view,VttOutput,$:false */
var PlayerState = function(view) {
    this.name = "BaseState";
};

//Defines behavior when we are a standard html5 player.
//It extends the PlayerState prototype
var StandardState = function(view) {
    this.name = "StandardState";
    this.setTime = function(time) {
        view.videoPlayer[0].currentTime = view.workingSeg.segStartTime;
    };

    view.videoPlayer[0].addEventListener("seeked", function() {
         view.videoPlayer[0].play();
    });

    view.videoPlayer[0].addEventListener("timeupdate", function() {
        let stopTime = view.currentDuration + view.workingSeg.segStartTime;
        if(view.videoPlayer[0].currentTime >= stopTime){
            view.videoPlayer.get(0).currentTime = view.workingSeg.segStartTime;
        }
    });

};
StandardState.prototype = Object.create(PlayerState.prototype);

//Defines behavior when we are a youTube player.
//It extends the PlayerState prototype
var YouTubeState = function(view) {
    this.name = "YouTubeState";
    this.setTime = function(time) {
        view.youTubePlayer.seekTo(time, true);
    };
    this.videoSeeked = function() {
        // self.videoPlayer[0].play();
    }
};
YouTubeState.prototype = Object.create(PlayerState.prototype);