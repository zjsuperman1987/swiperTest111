window.onload = function() {
    initControl.init();
}



var initControl = (function() {
    var my = {};


    function mianScrollAnimate() {
        var y = this.y >> 0;

        // if (mianScrollAnimate.caller.arguments[0] === '')



        if (y < -100) {
            $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            $(this.scroller).css('margin-top', 200);

            $(this.scroller).css('transform', 'translate(0,-100px)');
            $('.right').css('transform', 'translate(0,' + (y + 100) + 'px)');


        } else {
            $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            $(this.scroller).css('margin-top', 0);
            $('.right').css('transform', 'translate(0,0)');

        }


        if (my.leftScroll) {
            if (y < -100) {
                this.options.fixed = true;
                this.options.position = true;
                this._translate(0, -100);
            }

            $('.right').css('transform', 'translate(0,0px)');
        } else {
            this.options.fixed = false;
            this.options.position = false;
        }







        console.log(y, '右边', mianScrollAnimate.caller.arguments[0], my.leftScroll)
    }

    var switchStop = true;

    function stopPop(e) {
        var e = e || event;
        e.stopPropagation();
    }




    function subScrollAnimate() {
        var y = this.y >> 0;
        my.leftScroll = true;
        if (my.mainScroll.options.position && switchStop) {
            switchStop = false;
            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.subWrapper').addEventListener(item, stopPop)
            })

        }

        if (!my.mainScroll.options.position) {
            this._translate(0, 0);
        }


        if (y >= 0 && subScrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
        	['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.subWrapper').removeEventListener(item, stopPop)
            })
             switchStop = true;
        }


        console.log(y, '左边===============', this.directionY, subScrollAnimate.caller.arguments[0]);

    }


    return {

        init: function() {
            var mainScroll = my.mainScroll = new IScroll('.wrapper', {
                probeType: 3,
                bounce: false
            })

            mainScroll.on('beforeScrollStart', mianScrollAnimate);
            mainScroll.on('scroll', mianScrollAnimate);
            mainScroll.on('scrollEnd', mianScrollAnimate);
            mainScroll.on('scrollCancel', mianScrollAnimate);









            subScroll = new IScroll('.subWrapper', {
                probeType: 3,
                bounce: false
            });

            subScroll.on('beforeScrollStart', subScrollAnimate);
            subScroll.on('scroll', subScrollAnimate);
            subScroll.on('scrollEnd', subScrollAnimate);



            // ['touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointermove', 'mousedown', 'mousemove','MSPointerDown','MSPointerMove'].forEach(function(item, i) {
            //     document.querySelector('.subWrapper').addEventListener(item, function(e) {
            //         var e = e || event;
            //         e.stopPropagation();
            //     })
            // })



            document.querySelector('.right').addEventListener('touchstart', function() {
                my.leftScroll = false;
            })


        }


    }
})()