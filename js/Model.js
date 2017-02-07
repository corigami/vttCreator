/*globals,  false */
/*
* File: Model.js
* Author: Corey Willinger
* Description: Establishes Objects and their behavior
*/


/*
* @Name: VttRepresents
* @Description: Stores and updates vtt segment information
*/
var SegObject = function(index, start, dur) {
    var self = this;
    self.segIndex = index;
    self.segStartTime = start;
    self.segStopTime = start+dur;
    self.segDuration=dur;
    self.text1="";
    self.text2="";

    //Simple copy function
    self.copy = function(){
        var temp = new SegObject(0,0,0);
        temp.segIndex = self.segIndex;
        temp.segStart = self.segStartTime;
        temp.segStart = self.segStopTime;
        temp.segDuration = self.segDuration;
        temp.text1 = self.text1;
        temp.text2 = self.text2;
        return temp;
    };
}; 

/*
* @Name: VttObject
* @Description: Stores and updates vtt file information
*/
var VttObject = function(view) {
    var self = this;
    self.numOfSegments = 0;
    self.vttSegArray=[];

    //adds a segment to our array and increment total count
    self.addSegment = function(segment){
        self.vttSegArray.push(segment);
        self.numOfSegments++;
    };

    //updates the array with the new segment.  If there is a change in segment segDuration
    // a call to updateSegmentTimes() is made
    self.updateSegment = function(segment){
        if(self.vttSegArray[segment.segIndex].segDuration != view.currentDuration){
           let diff = view.currentDuration - segment.segDuration;
            segment.segDuration = view.currentDuration;
            self.updateSegmentTimes(segment,diff);
            
        }
        self.vttSegArray[segment.segIndex] = segment;
    };

    //removes the segment, and calls update segment times accordingly
    self.deleteSegment = function(segment){
        self.updateSegmentTimes(segment, -segment.segDuration);
        self.vttSegArray.forEach(function (seg){
            if(seg.segIndex > segment.segIndex){
                seg.segIndex--;
            }
        });
        self.vttSegArray.splice(segment.segIndex,1);
        self.numOfSegments--;
    };

    //given the time, update any segments with the time change 
    self.updateSegmentTimes=function(segment,time){
        let i = segment.segIndex;
        for(i ; i < self.vttSegArray.length;i++){
            self.vttSegArray[i];
            if(i==segment.segIndex){
                self.vttSegArray[i].segStopTime += time;
            }else{
                self.vttSegArray[i].segStartTime += time;
                self.vttSegArray[i].segStopTime =  self.vttSegArray[i].segStartTime+ self.vttSegArray[i].segDuration;
               //self.updateSegment(tempSeg);
            }

        }
    }; 

    self.get = function(index){
        return self.vttSegArray[index];
    };
};

/*
* @Name: VttOutput
* @Description: Creates VttOuput
*/
var VttOutput = function(view){
    var self = this;
    self.HEADER = "WEBVTT\n\n" +
                "0\n" +
                "00:00:00.000 --> 00:00:00.100\n\n" +
                "NOTE This the Closed Captioning File\n\n";
    self.output="";

    self.buildOutput = function(){
        
        self.output = self.HEADER;

        view.vttObj.vttSegArray.forEach(function(seg){
            
            //offset the index by 1 to account for 0 initial blank cue.
            self.output += (seg.segIndex + 1 +'\n');
            self.output += (self.formatTime(seg, seg.segStartTime));
            self.output += " --> ";
            self.output += (self.formatTime(seg, seg.segStopTime) + '\n');
            
            //if the line is not black, add the output and a carriage return
            if(seg.text1 !== ""){
                self.output += seg.text1.trim() + '\n';
            }      
            if(seg.text2 !== ""){
                self.output += seg.text2.trim() + '\n';
            } 
            self.output += '\n';      
        });
       
    console.log(self.output);
    return self.output;
    };

    self.formatTime = function(seg, time){
        var hr = 0;
        var min = 0;
        var sec = 0;
        var remain = 0;

        //format start time
        hr = parseInt(time / 3600);
        if(hr < 10){
            hr = "0"+ hr;
        }
        remain = time - (hr*3600);
        min = parseInt(remain/60);
        if(min < 10){
           min = "0"+ min;
        }
        remain = remain - (min*60);
        sec = remain.toFixed(3);
        if(sec < 10){
            sec = "0" + sec;
        }
        return (hr + ":" + min + ":" + sec);
    };
};