var SegObject = function(index, start, dur) {
    var self = this;
    self.segIndex = index;
    self.segStartTime = start;
    self.segStopTime = start+dur;
    self.segDuration=dur;
    self.text1="I'm Index" + index;
    self.text2="";
}; 

SegObject.prototype.copy =function(){
    var temp = new SegObject(0,0,0);
    temp.segIndex = self.segIndex;
    temp.segStart = self.segStartTime;
    temp.segStart = self.segStopTime;
    temp.segDuration = self.segDuration;
    temp.text1 = self.text1;
    temp.text2 = self.text2;
    return temp;
}; 

var VttObject = function(view) {
    var self = this;
    self.numOfSegments = 0;
    self.vttSegArray=[];

    //adds a segment to our array and increment total count
    self.addSegment = function(segment){
        self.vttSegArray.push(segment);
        self.numOfSegments++;
    }

    //updates the array with the new segment.  If there is a change in segment segDuration
    // a call to updateSegmentTimes() is made
    self.updateSegment = function(segment){
        if(self.vttSegArray[segment.segIndex].segDuration != view.currentDuration){
           let diff = view.currentDuration - segment.segDuration;
            console.log(diff);
            segment.segDuration = view.currentDuration;
            self.updateSegmentTimes(segment,diff);
            
        };
        self.vttSegArray[segment.segIndex] = segment;
    }

    //removes the segment, and calls update segment times accordingly
    self.deleteSegment = function(segment){
        self.updateSegmentTimes(segment, -segment.segDuration);
        self.vttSegArray.forEach(function (seg){
            if(seg.segIndex > segment.segIndex){
                seg.segIndex--;
            }
        });
        vttSegArray.splice(segment.segIndex,1);
        self.numOfSegments--;
    }

    //given the time, update any segments with the time change 
    self.updateSegmentTimes=function(segment,time){
        let i = segment.segIndex;
        console.log("here");
        for(i ; i < self.vttSegArray.length;i++){
            let tempSeg = self.vttSegArray[i];
            if(i==segment.segIndex){
                tempSeg.segStopTime += time;
            }else{
   
                tempSeg.segStartTime += time;
                tempSeg.segStopTime =  tempSeg.segStartTime+ tempSeg.segDuration;
                self.updateSegment(tempSeg);
            }

        }
    } 

    self.get = function(index){
        return self.vttSegArray[index];
    }
};

var VttOutput = function(view){
    var self = this;
    self.HEADER = "WEBVTT\n\n";
    self.output="";

    self.buildOutput = function(){
        
        self.output = self.HEADER;

        view.vttObj.vttSegArray.forEach(function(seg){
            self.output += (seg.segIndex+'\n');
            self.output += (self.formatTime(seg, seg.segStartTime));
            self.output += " --> ";
            self.output += (self.formatTime(seg, seg.segStopTime) + '\n');
            if(seg.text1 != ""){
                self.output += seg.text1.trim() + '\n';
                if(seg.text2 != ""){
                    self.output += seg.text2.trim() + '\n';
                } 
                self.output += '\n';
            }
             
        });

       
    console.log(self.output);
    return self.output;
    }

    self.formatTime = function(seg, time){
        var hr = 0;
        var min = 0;
        var sec = 0;
        var ms = 0;
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
}