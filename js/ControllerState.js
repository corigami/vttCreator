/*globals document,view,VttOutput,$:false */
var ControllerState = function(view) {
    this.name = "BaseState";
};

ControllerState.prototype.setState = function() {
    console.log(view.controllerState.name);
    //check conditions of current segment vs. player time and assign appropriate state.
    if (view.currentIndex === 0) {
        view.controllerState = view.START_STATE;
        //if we are not the first one, are we at the end?
    } else if (!view.timelineObj.segArray[view.currentIndex + 1]) {
        //check to see if we'd be the last segment in the video...
        if (view.playerState.isAtEnd()) {
            view.controllerState = view.END_STATE;
        } else { //we're not,
            view.controllerState = view.HEAD_STATE;
        }
    } else { //we're not at the end, or the first
        view.controllerState = view.NOT_HEAD_STATE;
    }
    view.controllerState.setUI();
    console.log(view.controllerState.name);
    view.playerState.setTime(view.workingSeg.segStartTime);
};

//sets the data on the screen
ControllerState.prototype.setUISegData = function() {
    view.text1.val(view.workingSeg.text1);
    view.text2.val(view.workingSeg.text2);
    view.durationInput.val(view.workingSeg.segDuration);
    view.currentDuration = view.workingSeg.segDuration;
};

//updates the working segment with data from the UI
ControllerState.prototype.updateWorkingSegment = function() {
    view.workingSeg.text1 = view.text1.val();
    view.workingSeg.text2 = view.text2.val();
    view.timelineObj.updateSegment(view.workingSeg);
};

//Defines behavior when we are on the first possible segment.
//It extends the ControllerState prototype
var StartState = function(view) {
    this.name = "StartState";
    this.clickNext = function() {
        if (!view.timelineObj.get(view.currentIndex)) {
            //create a new working segment.
            let start = view.workingSeg.segStopTime;
            let stop = view.workingSeg.segStartTime + view.DEFAULT_DURATION;
            view.timelineObj.addSegment(new SegObject(view.currentIndex, start, view.DEFAULT_DURATION));
        }
        view.workingSeg = view.timelineObj.get(view.currentIndex);
        this.setState();
    };
    this.clickPrev = function() {
        //should do nothing, we are at the beginning
    };

    //TODO implement this in the UI
    this.clickInsert = function() {
        //we'll need to update indexes and time
    };

    this.setUI = function() {
        view.prevButton.prop('disabled', true);
        this.setUISegData(view.currentIndex);
    };
};
StartState.prototype = Object.create(ControllerState.prototype);

//Defines behavior when we are on the newest created segment, but not first or last.
//It extends the ControllerState prototype
var HeadState = function(view) {
    this.name = "HeadState";
    this.clickNext = function() {
        let start = view.workingSeg.segStopTime;
        let stop = view.workingSeg.segStartTime + view.DEFAULT_DURATION;
        view.timelineObj.addSegment(new SegObject(view.currentIndex, start, view.DEFAULT_DURATION));
        view.workingSeg = view.timelineObj.get(view.currentIndex);
        this.setState();
    };

    this.clickPrev = function() {
        view.workingSeg = view.timelineObj.segArray[view.currentIndex];
        this.setState();
    };

    this.clickInsert = function() {};

    this.setUI = function() {
        view.prevButton.prop('disabled', false);
        view.nextButton.prop('disabled', false);
        this.setUISegData();
    };
};
HeadState.prototype = Object.create(ControllerState.prototype);

//Defines the behavior when we are not on the first segment, the last segment,
//or the head segment. It extends the ControllerState prototype
var NotHeadState = function(view) {
    this.name = "NotHeadState";
    this.clickNext = function() {
        view.workingSeg = view.timelineObj.get(view.currentIndex);
        this.setState();
    };
    this.clickPrev = function() {
        view.workingSeg = view.timelineObj.get(view.currentIndex);
        this.setState();
    };

    this.clickInsert = function() {};

    this.setUI = function() {
        view.prevButton.prop('disabled', false);
        view.nextButton.prop('disabled', false);
        this.setUISegData();
    };
};
NotHeadState.prototype = Object.create(ControllerState.prototype);

//Defines our behavor when we are on the last possible segment.
//It extends the ControllerState prototype
var EndState = function(view) {
    this.name = "EndState";
    this.clickNext = function() {
        //this should be disabled

    };
    this.clickPrev = function() {
        view.workingSeg = view.timelineObj.get(view.currentIndex);
        this.setState();
    };
    this.clickInsert = function() {

    };
    this.durationChanged = function() {

    };
    this.setUI = function() {
        view.prevButton.prop('disabled', false);
        view.nextButton.prop('disabled', true);
        this.setUISegData();
        view.playerState.setMaxDuration();
        view.durationInput.val(view.currentDuration);
        view.workingSeg.segStopTime = view.workingSeg.segStartTime + view.currentDuration;
    };
};
EndState.prototype = Object.create(ControllerState.prototype);