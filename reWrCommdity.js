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
    my.oneRightSet = true;

    function stopPop(e) {
        var e = e || event;
        e.stopPropagation();
    }


    function sythesizeAnimate(y) {
        if (y < -100) {
            $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            $('.goddsListWrapper').css('overflow', 'unset');
            $(this.scroller).css('margin-top', 200);
        } else {
            $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            $('.goddsListWrapper').css('overflow', 'hidden');
            $(this.scroller).css('margin-top', 0);
        }
    }



    function mainScrollAnimate() {
        var y = this.y >> 0;

        if (mainScrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
            this.options.clickRight = true;
        }


        if (y < -100) {
            // $('.placehold').css({ position: 'fixed', clip: 'rect(0, 320px, 100px, 0)', 'z-index': 1 }).prependTo('body');
            // $('.goddsListWrapper').css('overflow', 'unset');
            // $(this.scroller).css('margin-top', 200);

            $(this.scroller).css('transform', 'translate(0,-100px)');
            $('.right').css('transform', 'translate(0,' + (y + 100) + 'px)');

            if (my.oneRightSet) {
                my.oneRightSet = false;
                my.leftY = -100;
            }


        } else {
            // $('.placehold').css({ position: 'unset', clip: 'unset' }).prependTo($(this.scroller));
            // $('.goddsListWrapper').css('overflow', 'hidden');
            // $(this.scroller).css('margin-top', 0);

            $(this.scroller).css('transfrom', 'translate(0,0)');
            $('.right').css('transform', 'translate(0,' + rightSCroll + 'px)');
        }


        if (!my.leftChange && !this.options.clickRight) {
            // console.log('进来了·····························进来了·····························进来了·····························')
            $(this.scroller).css('transform', 'translate(0,' + my.newY + 'px)');
        }

        console.log(y,'==========================================右边')

    }





    function subScrollAnimate() {
        var y = this.y >> 0,
            e = window.event || e;


        if (subScrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
            my.pointY = e.pageY; // 初始值
            my.mainScroll.options.clickRight = false;
        }

        if (subScrollAnimate.caller.arguments[0] === 'scrollEnd') {
            my.leftY = my.newY;
        }

        if (e && !my.leftChange) {
            my.leftMoveY = e.pageY - my.pointY; //移动值
            my.newY = my.leftY + my.leftMoveY;
            my.newY = my.newY <= -100 ? -100 : my.newY >= 0 ? 0 : my.newY;

            if (subScrollAnimate.caller.arguments[0] === 'scrollEnd') {
                my.leftY = my.newY;
            }
            $(my.mainScroll.scroller).css('transform', 'translate(0,' + my.newY + 'px)');



        }
        if (my.leftY > -100) {
            this._translate(0, 0);
        } else {
            my.leftChange = true;
            if (this.startY === 0 && this.directionY < 0) {
                my.leftChange = false;
            }
        }
        console.log(my.leftY, my.newY, y);
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