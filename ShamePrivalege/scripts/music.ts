module Chubbo {

    export class Music extends Phaser.Sound {

        private transitionMarkers: boolean = true;
      
        

        update() {
            if (this.pendingPlayback && this.game.cache.isSoundReady(this.key)) {
                super.update();
            }

            //Actual changes below
            if (this.isPlaying) {
                this.currentTime = this.game.time.now - this.startTime;

                if (this.currentTime >= (this.duration * 1000)) {
                    //console.log(this.currentMarker, 'has hit duration');
                    if (this.usingWebAudio) {
                        if (this.loop) {

                            //  won't work with markers, needs to reset the position
                            this.onLoop.dispatch(this);

                            if (this.currentMarker === '') {
                                // console.log('loop2');
                                this.currentTime = 0;
                                this.startTime = this.game.time.now;
                            }
                            else {
                                // console.log('loop3');
                                this.play(this.currentMarker, 0, this.volume, true, true);
                            }
                        }
                        else {
                            // This is for 
                            this.endMarker();
                        }
                    }
                    else {
                        if (this.loop) {
                            this.onLoop.dispatch(this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        }
                        else {
                            this.endMarker();
                        }
                    }
                }
            }

        }

        private endMarker() {
            //var convertedTime = (this.currentTime / 1000)
            //for (var m in this.markers) {
            //    if (m.start <= convertedTime) {
            //        var endtime = m.start + m.duration
            //        if (convertedTime <= endtime) {
            //            this.play(m.name);
            //        }
            //    }

            //}
            //this.stop();
        }
    }
}