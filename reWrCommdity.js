window.onload = function() {
    initControl.init();
}



var initControl = (function() {
    var my = {},
        lastLeftEvent,
        stopBubble = false,
        rightSCroll = 0,
        leftScroll = 0,
        storageCancel = 0;

    my.pointY = 0;
    my.leftMoveY = 0;
    my.leftY = 0;
    my.leftChange = false;

    function stopPop(e) {
        var e = e || event;
        e.stopPropagation();
    }



    function mianScrollAnimate() {
        var y = this.y >> 0;
        my.newY = my.leftY = y < -100 ? -100 : y;
        
        console.log(y);

        if (y < -100) {
            $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            $(this.scroller).css('margin-top', 200);

            $(this.scroller).css('transform', 'translate(0,-100px)');
            $('.right').css('transform', 'translate(0,' + (y + 100) + 'px)');

        } else {
            $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            $(this.scroller).css('margin-top', 0);
            $('.right').css('transform', 'translate(0,' + rightSCroll + 'px)');
            my.leftChange = false;
            leftScroll = my.subScroll.y;
        }

        // console.log(y, '右边', mianScrollAnimate.caller.arguments[0],this.y);
    }





    function subScrollAnimate() {
        var y = this.y >> 0,
            e = window.event || e;

        if (subScrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
            my.pointY = e.pageY; // 初始值
        }

        if (e && !my.leftChange) {
            my.leftMoveY = e.pageY - my.pointY; //移动值
            my.newY = my.leftY + my.leftMoveY;
            my.newY = my.newY <= -100 ? -100 : my.newY >= 0 ? 0 : my.newY;

            if (subScrollAnimate.caller.arguments[0] === 'scrollEnd') {
                my.leftY = my.newY;
            }
            my.mainScroll.y = my.newY;
            my.mainScroll._execEvent('scroll');
            console.log(my.newY, 'pppppppppppppppppppppppppppp');
            $(my.mainScroll.scroller).css('transform', 'translate(0,' + my.newY + 'px)');
            
        }

        if (my.leftY > -100) {
            this._translate(0, leftScroll);
        } else if (my.leftY <= -100) {
            my.leftChange = true;
            if (this.startY === 0 && this.directionY < 0 && my.leftChange) {
                rightSCroll = my.mainScroll.y + 100;
                my.leftChange = false;
            }
        }
    }


    return {

        init: function() {
            var mainScroll,
                subScroll;

            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.subWrapper').addEventListener(item, stopPop, false);
            });


            mainScroll = my.mainScroll = new IScroll('.wrapper', {
                probeType: 3,
                bounce: false
            })

            mainScroll.on('beforeScrollStart', mianScrollAnimate);
            mainScroll.on('scroll', mianScrollAnimate);
            mainScroll.on('scrollEnd', mianScrollAnimate);
            mainScroll.on('scrollCancel', mianScrollAnimate);

            //我是分割---------------------------------------------------
            subScroll = my.subScroll = new IScroll('.subWrapper', {
                probeType: 3,
                bounce: false
            });

            subScroll.on('beforeScrollStart', subScrollAnimate);
            subScroll.on('scroll', subScrollAnimate);
            subScroll.on('scrollEnd', subScrollAnimate);


        }


    }
})()