window.onload = function() {
    initControl.init();
}



var initControl = (function() {
    var my = {},
        stopBubble = false,
        rightSCroll = 0,
        leftScroll = 0,
        endBool = false,
        storageCancel = 0;

    function stopPop(e) {
        var e = e || event;
        e.stopPropagation();
    }



    function mianScrollAnimate() {
        var y = this.y >> 0,
            e = window.event || e;

        if (y <= -100) {
            $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            $(this.scroller).css('margin-top', 200);
            if (rightSCroll) { //  || storageCancel
                var temporaryY = y + rightSCroll + 100;
                temporaryY = temporaryY < (this.maxScrollY + 100) ? (this.maxScrollY + 100) : temporaryY;

                // if (mianScrollAnimate.caller.arguments[0] === 'scrollCancel') {
                //     y = this.y = storageCancel - 100;
                //     storageCancel = 0;
                //     console.log('进来了', y, temporaryY);
                //     console.log('scrollcancel=======================================');
                // }
                // if (mianScrollAnimate.caller.arguments[0] === 'scrollEnd' && this.startY > -100) {
                //     storageCancel = temporaryY;
                //     y = this.y = temporaryY - 100;
                //     rightSCroll = 0;
                //     console.log('scrollend=======================================')
                // }

                // 转换Y值
                y = this.y = temporaryY - 100;
                if (mianScrollAnimate.caller.arguments[0] === 'scrollEnd' && this.startY > -100) {
                    rightSCroll = 0;
                }
                if (e) {
                    if (e.type = 'pointermove') {
                        rightSCroll = 0;
                    }
                }
            }



            $(this.scroller).css('transform', 'translate(0,-100px)');
            $('.right').css('transform', 'translate(0,' + (rightSCroll ? temporaryY : (y + 100)) + 'px)');

            if (my.switchLeftScroll && this.startY > -100) {
                this._translate(0, -100);
                this.options.fixed = true;
                $('.right').css('transform', 'translate(0,' + rightSCroll + 'px)');
                if (mianScrollAnimate.caller.arguments[0] === 'scrollEnd') {
                    y = this.y = rightSCroll - 100;
                }
            }
            if (!stopBubble) {
                ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                    document.querySelector('.subWrapper').addEventListener(item, stopPop, false);
                })
                stopBubble = true;
                console.log('添加了--------------------------------------------')
            }
        } else {
            $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            $(this.scroller).css('margin-top', 0);
            $('.right').css('transform', 'translate(0,' + rightSCroll + 'px)');
            $('.goddsListWrapper').css('overflow', 'hidden');

            if (stopBubble) {
                ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                    document.querySelector('.subWrapper').removeEventListener(item, stopPop, false);
                })
                stopBubble = false;
                console.log('删除了--------------------------------------------')
            }
        }

        console.log(y, '右边', mianScrollAnimate.caller.arguments[0], my.switchLeftScroll)
    }





    function subScrollAnimate() {
        var y = this.y >> 0,
            event = window.event || event;
        console.log(event);
        my.switchLeftScroll = true;
        if (stopBubble) {
            my.switchLeftScroll = false;
        }


        if (my.mainScroll.y > -100) {
            this._translate(0, leftScroll);
        } else {
            leftScroll = y;

            if (y === 0 && this.directionY < 0) {
                ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                    document.querySelector('.subWrapper').removeEventListener(item, stopPop, false);
                })
                stopBubble = false;
                rightSCroll = my.mainScroll.y + 100;

                my.mainScroll.y = -99;
                // my.mainScroll._execEvent('scroll');

            }
        }


        console.log(y, '左边===============', this.directionY, subScrollAnimate.caller.arguments[0]);

    }


    return {

        init: function() {
            ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                document.querySelector('.right').addEventListener(item, function() {
                    my.switchLeftScroll = false;
                    my.mainScroll.options.fixed = false;
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
            var subScroll = my.subScroll = new IScroll('.subWrapper', {
                probeType: 3,
                bounce: false
            });

            subScroll.on('beforeScrollStart', subScrollAnimate);
            subScroll.on('scroll', subScrollAnimate);

        }


    }
})()