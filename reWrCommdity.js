window.onload = function() {
    initControl.init();
}



var initControl = (function() {
    var my = {};
    stopBubble = false;
    rightSCroll = 0;

    function stopPop(e) {
        var e = e || event;
        e.stopPropagation();
    }



    function mianScrollAnimate() {
        var y = this.y >> 0;

        if (y <= -100) {
            $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            $(this.scroller).css('margin-top', 200);

            $(this.scroller).css('transform', 'translate(0,-100px)');
            $('.right').css('transform', 'translate(0,' + (y + 100) + 'px)');
        } else {
            $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            $(this.scroller).css('margin-top', 0);
            $('.right').css('transform', 'translate(0,' + rightSCroll + 'px)');

        }


        if (y <= -100) {
            if (my.leftScroll) {
                $('.goddsListWrapper').css({ overflow: 'unset' });
                this.options.fixed = true;
                this._translate(0, rightSCroll - 100);
                $('.right').css('transform', 'translate(0,0)');
                console.log('进来了')
            }
            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.subWrapper').addEventListener(item, stopPop, false)
            })
        } else {
            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.subWrapper').removeEventListener(item, stopPop, false)
            })
            if (rightSCroll) {
                $('.goddsListWrapper').css({ overflow: 'hidden' });
            }
        }
        console.log(y, '右边', mianScrollAnimate.caller.arguments[0], my.leftScroll)
    }





    function subScrollAnimate() {
        var y = this.y >> 0;
        my.leftScroll = true;

        // 到达位置
        if (my.mainScroll.y > -100) {
            this._translate(0, 0);
        } else {
            my.leftScroll = false;
        }

        if (y === 0 && this.directionY < 0) {
            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.subWrapper').removeEventListener(item, stopPop, false)
            })
            if (!my.leftScroll) {
                rightSCroll = my.mainScroll.y + 100;
                my.mainScroll.y = -99;
            }
        }


        console.log(y, '左边===============', this.directionY, subScrollAnimate.caller.arguments[0]);

    }


    return {

        init: function() {
            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.right').addEventListener(item, function() {
                    my.leftScroll = false;
                    console.log('阻止了没')
                })
            })

            var mainScroll = my.mainScroll = new IScroll('.wrapper', {
                probeType: 3,
                bounce: false
            })

            mainScroll.on('beforeScrollStart', mianScrollAnimate);
            mainScroll.on('scroll', mianScrollAnimate);
            mainScroll.on('scrollEnd', mianScrollAnimate);
            mainScroll.on('scrollCancel', mianScrollAnimate);

            //我是分割---------------------------------------------------
            subScroll = new IScroll('.subWrapper', {
                probeType: 3,
                bounce: false
            });

            // subScroll.on('beforeScrollStart', subScrollAnimate);
            subScroll.on('scroll', subScrollAnimate);



        }


    }
})()