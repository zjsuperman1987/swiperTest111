window.onload = function() {
    initControl.init();
}



var initControl = (function() {
    var my = {},
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



    function mainScrollAnimate() {
        var y = this.y >> 0;

        if (mainScrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
            this.options.clickRight = true;
        }
        if (this.options.clickRight) {
            my.leftY = y < -100 ? -100 : y;
            leftScroll = my.subScroll.y;
        }







        if (y < -100) {
            $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            $('.goddsListWrapper').css('overflow', 'unset');
            $(this.scroller).css('margin-top', 200);
            // console.log(mainScrollAnimate.caller.arguments[0]);

            // 转换Y值
            if (rightSCroll || storageCancel) {
                // 滚动左边停止右边
                if (this.moved && !this.options.clickRight && !leftScroll) {
                    my.leftChange = false;
                    y = this.y;
                    this.options.fixed = true;
                    return;
                } 




                y = y + rightSCroll < this.maxScrollY ? this.maxScrollY : y + rightSCroll;
                if (mainScrollAnimate.caller.arguments[0] === 'scrollEnd') {
                    this.y = y;
                    storageCancel = rightSCroll;
                    rightSCroll = 0;
                }
                if (mainScrollAnimate.caller.arguments[0] === 'scroll' && !this.moved) {
                    y = this.y = y + storageCancel;
                    storageCancel = 0;
                }

                if (y === this.maxScrollY && mainScrollAnimate.caller.arguments[0] === 'scroll') {
                    this.y = this.maxScrollY;
                    this.options.fixed = true;
                }

            }




            $(this.scroller).css('transform', 'translate(0,-100px)');
            $('.right').css('transform', 'translate(0,' + (y + 100) + 'px)');
            my.leftChange = true;


        } else {
            $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            $('.goddsListWrapper').css('overflow', 'hidden');
            $(this.scroller).css('margin-top', 0);

            $('.right').css('transform', 'translate(0,' + rightSCroll + 'px)');
            // console.log(rightSCroll, 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
            my.leftChange = false;
        }

        // console.log(y, '右边', mainScrollAnimate.caller.arguments[0],this.y);
    }





    function subScrollAnimate() {
        var y = this.y >> 0,
            e = window.event || e;

        console.log(y, this.directionY);

        if (subScrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
            my.pointY = e.pageY; // 初始值
            my.mainScroll.options.clickRight = false;
        }

        if (e && !my.leftChange) {
            my.leftMoveY = e.pageY - my.pointY; //移动值
            my.newY = my.leftY + my.leftMoveY;
            my.newY = my.newY <= -100 ? -100 : my.newY >= 0 ? 0 : my.newY;

            if (subScrollAnimate.caller.arguments[0] === 'scrollEnd') {
                my.leftY = my.newY;
            }

            my.mainScroll.y = my.newY;
            my.mainScroll._execEvent('scrollEnd');
            $(my.mainScroll.scroller).css('transform', 'translate(0,' + my.newY + 'px)');
            // console.log(my.mainScroll.y, 'middlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddlemiddle')
        }

        if (my.leftY > -100) {
            this._translate(0, leftScroll);
        } else {
            my.leftChange = true;
            if (this.startY === 0 && this.directionY < 0) {
                rightSCroll = my.mainScroll.y + 100;
                my.leftChange = false;
                my.leftY = -99;
                leftScroll = 0;
                my.rightSCroll = my.mainScroll.y;
                // console.log(my.rightSCroll, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', leftScroll)
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

            mainScroll.on('beforeScrollStart', mainScrollAnimate);
            mainScroll.on('scroll', mainScrollAnimate);
            mainScroll.on('scrollEnd', mainScrollAnimate);
            mainScroll.on('scrollCancel', mainScrollAnimate);

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