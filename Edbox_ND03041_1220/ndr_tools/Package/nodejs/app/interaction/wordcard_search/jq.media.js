(function ($) {
    'use strict';
    var __bind = 
    function(fn, me){
        return function(){ return fn.apply(me, arguments); };
    },
        __slice = [].slice;

    var MediaPlager  ; 
    MediaPlager = (function(){
        var MediaPlager = function(){} ; 
        MediaPlager.prototype.$ = function(selector){
            return this.$container.find(selector);
        }
                /**
         *
         */
        MediaPlager.prototype.bindEventListener = function(){
            var media = this.media;
            var _this = this ;

            if ( this.supportHTML5 && this.options.supporFullscreen ) {
                if ($.MediaPlager.browser.webkit) {
                    $(document).bind('webkitfullscreenchange', function () {
                        _this.$container.toggleClass("full_video")
                        _this.fullscreenEvent();
                     
                    });
                }
                else if ($.MediaPlager.browser.mozilla) {
                    $(document).bind('mozfullscreenchange', function () {
                        _this.$container.toggleClass("full_video")
                        _this.fullscreenEvent();
                    });
                }else if($.MediaPlager.browser.smie){
                    $(document).bind('msfullscreenchange', function () {
                        _this.$container.toggleClass("full_video")
                        _this.fullscreenEvent();
                    }); 
                }
            }
            else {
                $(document).bind('flash.loaded', function () {
                    _this.eventsToBind();
                });
            }

            media.addEventListener('playing',
                 
                function () {  
                    _this.$('[data-oper="play"]').addClass("btn_pause");
                    if (_this.options.onPlay) {
                        _this.options.onPlay();
                    }
                },
                true
            );

            media.addEventListener('pause', function () {
                _this.$('[data-oper="play"]').removeClass("btn_pause");
                if (_this.options.onPause) {
                    _this.options.onPause();
                }

            }, true);

            media.addEventListener('ended', function () {

                this.currentTime = 0;
                this.pause();

                if (_this.options.onEnd) {
                    _this.options.onEnd.call();
                }

                _this.playing = false;

            }, false);

            media.addEventListener('timeupdate', function () {
                _this.updateVideoData();
                _this.updateCurrentTime();
                if (_this.options.onTimeupdate) {
                    _this.options.onTimeupdate();
                }
            }, false);

            // video.addEventListener('seeked', function () {

            //     if (_this.options.onSeek) {
            //         _this.options.onSeek.call();
            //     }
            // }, true);
        }


        /**
         * Play/Pause action.
         *
         * @method playPause
         */
        MediaPlager.prototype.playPause = function () {
            var mediaObj = this.media;
          
            if (this.supportHTML5) {
                if (mediaObj.paused) {
                    mediaObj.play();
                } else {
                    mediaObj.pause();
                }
            }
            else {
                if (mediaObj.paused()) {
                    mediaObj._play();
                } else {
                    mediaObj._pause();
                }
            }
        }
        MediaPlager.prototype.pause = function () {
            var mediaObj = this.media;
         
            if (this.supportHTML5) {
                if (!mediaObj.paused) {
                    mediaObj.pause();

                }
            }
            else {
                if (!mediaObj.paused()) {
                    mediaObj._pause();
                }
            }
        }
        MediaPlager.prototype.play = function () {
            var mediaObj = this.media;
         
            if (this.supportHTML5) {
                if (mediaObj.paused) {
                    mediaObj.play();
                }
            }
            else {
                if (mediaObj.paused()) {
                    mediaObj._play();
                }
            }
        }

        MediaPlager.prototype.progress = function(){
            var progWrapper = this.$('[data-oper="progress"]');
            var media = this.media ; 
            if (progWrapper.length > 0) {
                var _this = this;
    
                $(document).on('mousemove  touchmove', function (e) {
                        e.preventDefault();
                        _this.seekTo(e.pageX, progWrapper, media);
                });

                $(document).on('mouseup touchend touchcancel', progWrapper,function (e) {
                        e.preventDefault();

                        $(document).off('mousemove');
                        $(document).off('mouseup');
                });
            }
        }
        MediaPlager.prototype.progressMouseup = function(){
                var progWrapper = this.$('[data-oper="progress"]');
                var media = this.media ; 
                var _this = this;
                progWrapper.on('mouseup', function (e) {
                    _this.seekTo(e.pageX, progWrapper, media);
                });            
        }


        MediaPlager.prototype.seekTo = function (xPos, progWrapper, media) {
           
            var progressBar = progWrapper.find('[data-oper="bar"]');

            var progWidth = Math.max(0, Math.min(1, ( xPos - $.MediaPlager.findPosX(progWrapper) ) / progWrapper.width() ));

            var seekTo = progWidth * (this.supportHTML5 ? media.duration : media.duration());

            if (this.supportHTML5) {
                media.currentTime = seekTo;
            }
            else {
                media.seekTo(seekTo);
            }

            var width = Math.round(progWidth * (progWrapper.width()));

            progressBar.width(width);
        }

        MediaPlager.prototype.updateCurrentTime = function () {
            var media =   this.media ;
            var currentTime = this.supportHTML5 ? media.currentTime : media.currentTime();
            var currentTimeElement = this.$('[data-oper="curentTime"]');
            currentTimeElement.html($.MediaPlager.formatTime(currentTime));
        }

        MediaPlager.prototype.updateVideoData = function () {
            var media =   this.media ;
            var scrubbing =this.$('[data-oper="progress"] [data-oper="bar"]');

            var scrubbingWidth = (this.supportHTML5 ? media.currentTime : media.currentTime()) * 100 / (this.supportHTML5 ? media.duration : media.duration());
            scrubbing.width(scrubbingWidth + '%');

        }


   

        MediaPlager.findPosX = function (obj) {
            obj = obj.get(0);
            var curleft = obj.offsetLeft;
            while(obj = obj.offsetParent) {
                curleft += obj.offsetLeft;
            }

            return curleft;
        }

        MediaPlager.formatTime = function (secs) {
            var minutes = Math.floor(secs / 60);
            var seconds = Math.round(secs - (minutes * 60));

            if (seconds == 60) {
                seconds = 0;
                minutes = minutes + 1;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        }
        MediaPlager.uaBrowser = function( userAgent ) {
            var ua = userAgent.toLowerCase();
            // Useragent RegExp
            var rwebkit = /(webkit)[ \/]([\w.]+)/;
            var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
            var rmsie = /(msie) ([\w.]+)/;
            var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

            var match = rwebkit.exec( ua ) ||
                ropera.exec( ua ) ||
                rmsie.exec( ua ) ||
                ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
                [];
            return { browser: match[1] || "", version: match[2] || "0" };
        };

        MediaPlager.browser = {
        };

        var browserMatch = MediaPlager.uaBrowser(navigator.userAgent);
        if ( browserMatch.browser ) {
            MediaPlager.browser[ browserMatch.browser ] = true;
            MediaPlager.browser.version = browserMatch.version;
        }
        return MediaPlager;
    })();

    $.MediaPlager = MediaPlager ; 


    var AudioPlayer  ;

    AudioPlayer = (function(){
        /**
         * 构造函数
         * @param $container
         * @param options
         * @constructor
         */
        var AudioPlayer  = function($container, options){

            this.$container = $container ;

            this.options = $.extend({}, AudioPlayer.DEFAULTS, options);
            this.init = __bind(this.init,this);
            this.start = __bind(this.start,this);
            this.createAudio = __bind(this.createAudio,this);
            this.playPause = __bind(this.playPause,this);
            this.play =  __bind(this.play,this);
            this.pause =  __bind(this.pause,this);
            this.progress =  __bind(this.progress,this);
            this.progressMouseup =  __bind(this.progressMouseup,this);
            this.bindControls = __bind(this.bindControls,this);
            this.bindEventListener = __bind(this.bindEventListener,this);
            this.$ = __bind(this.$,this);
            

            this.init();
            return this;
        }
        /**
         *默认属性
         */
        AudioPlayer.DEFAULTS = {
            onEnd: false,
            onPause: false,
            onPlay: false,
            onSeek: false,
            onStart: false,
            supporFullscreen:false
        };

        AudioPlayer.prototype = new $.MediaPlager();

        AudioPlayer.prototype.init = function () {
            var audioEl = document.createElement('audio');
            if (audioEl.canPlayType) {
                this.supportHTML5 = true;
                return this.start();
            }
            else {
                this.supportHTML5 = false;
            }
        }
        AudioPlayer.prototype.start = function(){

            this.createAudio();//
            this.playing = false;

            this.$media =this.$("audio") ;
            this.media= this.$media.get(0);
            var _this = this;

            setTimeout(function(){
                _this.$('[data-oper="endTime"]').text($.MediaPlager.formatTime(_this.media.duration));
            },500)
            this.bindControls();
            this.bindEventListener();

        }


        /**
         *
         */
        AudioPlayer.prototype.bindControls = function(){
            this.$container['on']('click.play.jq.media','[data-oper="play"]',this.playPause);
            this.$container['on']('mousedown.progress.jq.media','[data-oper="progress"]',this.progress);
            this.$container['on']( 'mouseup.progress.jq.media'       ,'[data-oper="progress"]',this.progressMouseup);
        }

        


        return AudioPlayer;
    })();


    function AudioPlayerPlugin(option) {
        option = option || {};
        return this.each(function () {
            var $this = $(this);

            var data = $this.data('my.audioplayer');
            var options = $.extend({}, $this.data(), typeof option == 'object' && option)
            //插件缓存
            if (!data) {
                data = new AudioPlayer($this, options);
                $this.data('my.audioplayer', data);
            }
        });

    }

    $.fn.audioplayer = AudioPlayerPlugin;
   

    var VideoPlayer  ;

    VideoPlayer = (function(){
        /**
         * 构造函数
         * @param $container
         * @param options
         * @constructor
         */
        var VideoPlayer  = function($container, options){

            this.$container = $container ;
            this.options = $.extend({}, VideoPlayer.DEFAULTS, options);
            this.init = __bind(this.init,this);
            this.start = __bind(this.start,this);
            this.createVideo = __bind(this.createVideo,this);
            this.playPause = __bind(this.playPause,this);
            this.play =  __bind(this.play,this);
            this.pause =  __bind(this.pause,this);
            this.progress =  __bind(this.progress,this);
            this.progressMouseup =  __bind(this.progressMouseup,this);
            this.bindControls = __bind(this.bindControls,this);
            this.bindEventListener = __bind(this.bindEventListener,this);
            this.$ = __bind(this.$,this);
            this.toFullscreen = __bind(this.toFullscreen,this);
            this.fullscreenEvent = __bind(this.fullscreenEvent,this);

            this.init();
            return this;
        }

        VideoPlayer.DEFAULTS = {
            controls: ['play', 'progress', 'time', 'volume', 'fullscreen', 'alternative'],
            onEnd: false,
            onPause: false,
            onPlay: false,
            onSeek: false,
            onStart: false,
            onVideoChange: false,
            supporFullscreen:true
        };

        VideoPlayer.prototype =  new $.MediaPlager();

        VideoPlayer.prototype.init = function () {
            var videoEl = document.createElement('video');
            if (videoEl.canPlayType) {
                this.supportHTML5 = true;
                return this.start();
            }
            else {
                this.supportHTML5 = false;
                var hasFlash = false;
                try {
                    var activeX = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (activeX) {
                        hasFlash = true;
                    }
                } catch (e) {
                    if (navigator.mimeTypes["application/x-shockwave-flash"] != undefined) {
                        hasFlash = true;
                    }
                }

                if (hasFlash) {
                    this.startFallback();
                }
            }
        }
        
        VideoPlayer.prototype.start = function(){
            this.playing = false;
            this.fullscreen = false;
           
            this.$media =this.$('video') ;
            this.media= this.$media.get(0);
            var _this = this;
            setTimeout(function(){
                _this.$('[data-oper="endTime"]').text($.MediaPlager.formatTime(_this.media.duration));
            },300)

            this.bindControls();
            this.bindEventListener();

        }

        /**
         *
         */
        VideoPlayer.prototype.bindControls = function(){
          //  var arrCons =  this.options.controls ;
            this.$container['on']( 'click.play.jq.media'      ,'[data-oper="play"]',this.playPause);
            this.$container['on']( 'click.fullscreen.jq.media','[data-oper="fullscreen"]',this.toFullscreen) ;
            this.$container['on']( 'mousedown.progress.jq.media'       ,'[data-oper="progress"]',this.progress);
            this.$container['on']( 'mouseup.progress.jq.media'       ,'[data-oper="progress"]',this.progressMouseup);


        }

       VideoPlayer.prototype.toFullscreen= function () {
           //   clearTimeout(this.fullscreenTimeout);
            var _this = this;


            if (this.supportHTML5) {
                var container = this.$container.get(0);
                if (!this.fullscreen) {
                    if (container.webkitRequestFullScreen) {
                        container.webkitRequestFullScreen();
                    }
                    else if (container.mozRequestFullScreen) {
                        container.mozRequestFullScreen();
                    }else if(  container.msRequestFullscreen){
                        container.msRequestFullScreen();
                    }
                }
                else {
                    if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }else if(document.msCancelFullScreen){
                        document.msCancelFullScreen();
                    }
                }
            }
            else {

                // TODO
                var video =   this.video;

                if (!this.fullscreen) {
                    this.$container.addClass('fullscreen');
                    $(this.getClass('fullscreen')).removeClass('hover');
                    this.fullscreen = true;
                }
                else {
                    this.$container.removeClass('fullscreen');
                    $(this.getClass('fullscreen')).removeClass('hover');
                    this.fullscreen = false;
                }

                setTimeout(function () {
                    _this.setupProgressBar();
                }, 100);
            }
        }
        VideoPlayer.prototype.fullscreenEvent = function () {
            //var fullScreenBtn = $(this.getClass('fullscreen'));
            //fullScreenBtn.toggleClass('fullscreen');

            if (!this.fullscreen) {
                //this.selector.addClass('fullscreen');
                //fullScreenBtn.removeClass('hover');
                this.fullscreen = true;
            }
            else {
                //this.selector.removeClass('fullscreen');
                //fullScreenBtn.removeClass('hover');
                this.fullscreen = false;
            }

           // this.setupProgressBar();
        }

        return VideoPlayer;
    })();


    function VideoPlayerPlugin(option) {
        option = option || {};
        return this.each(function () {
            var $this = $(this);

            var data = $this.data('my.videoplayer');
            var options = $.extend({}, $this.data(), typeof option == 'object' && option)
            //插件缓存
            if (!data) {
                data = new VideoPlayer($this, options);
                $this.data('my.videoplayer', data);
            }
        });

    }

    $.fn.videoplayer = VideoPlayerPlugin;
   


})(jQuery)
