window.onload = function() {
    commdityDetail.initSwiper();
    commdityDetail.initScroll();
}


var commdityDetail = (function() {
    var my = {};

    return {
        initSwiper: function() {
            my.listHeight = [];
            my.scrollTransform = [];
            my.thirdTransform = 0;
            my.scrollers = [];
            my.scrollersDom = $('.swiper-tab .swiper-slide:not(.not-collection)').children();
            my.firstPosition = -($('.h_searchWrapper').outerHeight() + $('.iw_info').outerHeight());
            my.secondPosition = -(-my.firstPosition + $('.advertsingImg').outerHeight() + $('.today_good_special_price').outerHeight() + $('.specialPriceShowImg').outerHeight() + parseInt($('.goodsList').css('margin-top'), 10));

            // 创建变量保存scroller对象
            $.each(my.scrollersDom, function(i, item) {
                my[i] = false;
                my.scrollTransform.push(0);
            })

            // 初始化 商品列表高度
            $.each($('.goodsList_right li'), function(i, item) {
                if (i === 0) {
                    my.listHeight.push($(item).outerHeight() - 40);
                } else {
                    var height = $(item).outerHeight() + my.listHeight[i - 1];
                    my.listHeight.push(height);
                }
            })
            console.log(my.listHeight)
            // 初始化 swiper
            my.mySwiper = new Swiper('.swiper-container', {
                resistanceRatio: 0,
                freeMode: false,
                on: {
                    slideChange: function() {
                        var contentTransform = $('.container').css('transform') !== 'none' ? parseInt($('.container').css('transform').match(/-?\d+/g)[5], 10) : 0,
                            thirdTransform = $('.goodsList_right').css('transform') !== 'none' ? parseInt($('.goodsList_right').css('transform').match(/-?\d+/g)[5], 10) : 0;
                        my.scrollTransform[this.previousIndex] = parseInt($(my.scrollers[this.previousIndex].scroller).css('transform').match(/-?\d+/g)[5], 10);
                        // 如果是特殊的第一页
                        if (this.previousIndex === 0) {
                            my.thirdTransform = thirdTransform;
                        }
                        // 调用IScroll
                        my.scrollers[this.previousIndex].disable();
                        commdityDetail.initScroll(this.activeIndex, contentTransform);
                        my.scrollers[this.activeIndex].enable();

                        // 转换下划线
                        $('.border_bottom_line').appendTo($('.selectTabItem').eq(this.activeIndex).find('span'));
                        $('.border_bottom_line').css('transform', 'translateX(0)');
                        $('.selectTabItem span').removeClass('active_selectTabItem').eq(this.activeIndex).addClass('active_selectTabItem');
                    },
                    setTranslate: function(translate) {
                        translate = -(translate + (this.width * this.activeIndex)) / $('.swiper-slide:not(.not-collection)').length;
                        $('.border_bottom_line').css('transform', 'translateX(' + translate + 'px)');
                    }
                }
            })

            // 二级 轮播
            var mySwiperNest = new Swiper('.swiper-container-nest', {
                autoplay: false, //可选选项，自动滑动
                slidesPerView: 2.1,
                spaceBetween: 10,
                freeMode: true,
                nested: true,
                resistanceRatio: 0
            });


        },
        initScroll: function(index, contentTransform) {
            var index = index ? index : 0,
                titleHeight = $('.rn_title').eq(0).outerHeight(),
                contentTransform = contentTransform ? contentTransform : 0,
                scrollTransform = my.scrollTransform[index],
                thirdTransform = my.thirdTransform,
                scroller,
                isSwitch = true;

            my.titleIndex = my.titleIndex ? my.titleIndex : 0;
            my.prevIndex = my.prevIndex ? my.prevIndex : 0;

            function scrollAnimate() {
                var y = this.y >> 0;

                // console.log(y, scrollAnimate.caller.arguments[0], this.options.fixed, my.scrollTransform[my.mySwiper.activeIndex], this);
                // console.log(y);

                // 初始定位位置 -213 
                if (y < my.firstPosition && this.startY > my.firstPosition || y > my.firstPosition && this.startY < my.firstPosition) {
                    if (index === 0) {
                        y = this.y = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition + my.thirdTransform;
                    } else {
                        y = this.y = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition;
                    }
                    this.options.fixed = true; //进入后不执行动能
                }

                if (y > my.firstPosition) {
                    $('.container').css('transform', 'translate(0,' + y + 'px)');
                    $(this.scroller).css('transform', 'translate(0,' + (my.scrollTransform[my.mySwiper.activeIndex] ? my.scrollTransform[my.mySwiper.activeIndex] : 0) + 'px)');

                } else if (y <= my.firstPosition) {

                    if (y === my.firstPosition) {
                        if (this.options.isChangeY) {
                            if (index === 0) {
                                y = this.y = this.startY = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition + my.thirdTransform;
                            } else {
                                y = this.y = this.startY = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition;
                            }

                            my.scrollTransform[my.mySwiper.activeIndex] = 0;
                            this.options.isChangeY = false;
                        }
                    }

                    if (scrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
                        my.scrollTransform[my.mySwiper.activeIndex] = 0;
                    }

                    $('.container').css('transform', 'translate(0,' + my.firstPosition + 'px)');
                    $(this.scroller).css('transform', 'translate(0,' + (y - my.firstPosition) + 'px)');
                }


                // 二级定位
                if (my.mySwiper.activeIndex === 0) {


                    if (y < my.secondPosition) {
                        $('.container').css('transform', 'translate(0,' + my.firstPosition + 'px)');
                        $(this.scroller).css('transform', 'translate(0,' + (my.secondPosition - my.firstPosition) + 'px)');
                        $('.goodsList_right').css('transform', 'translate(0,' + (y - my.secondPosition) + 'px)');


                        if (isSwitch) {
                            isSwitch = false;
                            $('.rn_title').eq(my.titleIndex).addClass('active_rn_title').insertAfter('.goodsList_left');
                            $('.goodsList_right li').eq(my.titleIndex).addClass('goodsList_right_li_loseHead');
                        }


                        if (this.directionY > 0) {
                            if (y < my.secondPosition - my.listHeight[my.titleIndex]) {
                                $('.active_rn_title').prependTo($('.goodsList_right li').eq(my.titleIndex)).removeClass('active_rn_title').addClass('active_rn_title_middle');
                                my.prevIndex = my.titleIndex;
                            }
                            if (y < my.secondPosition - my.listHeight[my.titleIndex] - titleHeight) {
                                my.titleIndex = my.titleIndex + 1;

                                $('.rn_title').eq(my.titleIndex).insertAfter('.goodsList_left').addClass('active_rn_title');
                                $('.goodsList_right li').eq(my.titleIndex).addClass('goodsList_right_li_loseHead');

                            }
                        }
                        if (this.directionY < 0) {
                            if (my.prevIndex === my.titleIndex) {
                                if (y > my.secondPosition - my.listHeight[my.titleIndex]) {
                                    $('.rn_title').eq(my.titleIndex).insertAfter('.goodsList_left').addClass('active_rn_title').removeClass('active_rn_title_middle');
                                    my.prevIndex = my.prevIndex === 0 ? 0 : my.titleIndex - 1;
                                }
                            } else {
                                if (y > my.secondPosition - my.listHeight[my.titleIndex - 1] - titleHeight) {
                                    $('.active_rn_title').prependTo($('.goodsList_right li').eq(my.titleIndex).removeClass('goodsList_right_li_loseHead')).removeClass('active_rn_title');

                                }
                                if (y > my.secondPosition - my.listHeight[my.titleIndex - 1]) {
                                    $('.rn_title').eq(my.titleIndex - 1).insertAfter('.goodsList_left').addClass('active_rn_title').removeClass('active_rn_title_middle');
                                    my.titleIndex = my.titleIndex - 1;
                                    my.prevIndex = my.prevIndex === 0 ? 0 : my.titleIndex - 1;
                                }
                            }
                        }
                    } else if (y > my.secondPosition && this.startY < my.secondPosition) {

                        $('.goodsList_right').css('transform', 'translate(0,0)');
                        $('.container').css('transform', 'translate(0,' + my.firstPosition + 'px)');
                        $(this.scroller).css('transform', 'translate(0,' + (y - my.firstPosition) + 'px)');

                        $('.rn_title').eq(my.titleIndex).prependTo($('.goodsList_right li').eq(my.titleIndex)).removeClass('active_rn_title');
                        $('.goodsList_right li').eq(my.titleIndex).removeClass('goodsList_right_li_loseHead');
                        // my.titleIndex = 0;
                        isSwitch = true;

                    }
                }

                // scrollEnd exec code 
                if (scrollAnimate.caller.arguments[0] === 'scrollEnd') {
                    this.options.fixed = false;
                }

                $('.goodsList_left li').removeClass('activeLeft').eq(my.titleIndex).addClass('activeLeft')
            }


            function scrollerLeft() {
                console.log(this.y);
            }

            // 创建滚动对象
            $.each(my.scrollersDom, function(i, item) {
                if (i === index) {
                    // 初始左边滚动
                    if (i === 0) {
                        if (!my.leftScroller) {
                            my.leftScroller = new IScroll('.leftWrapper', {
                                probeType: 3,
                                bounce: false
                            })
                            my.leftScroller.on('scroll', scrollerLeft);
                            my.leftScroller.on('scrollEnd', scrollerLeft);
                        }
                     }



                    if (!my.scrollers[i]) {
                        my.scrollers[i] = new IScroll(my.scrollersDom[i], {
                            probeType: 3,
                            bounce: false,
                            subMargin: my.firstPosition
                        })
                        my.scrollers[i].on('scroll', scrollAnimate);
                        my.scrollers[i].on('scrollEnd', scrollAnimate);
                        my.scrollers[i].on('scrollCancel', scrollAnimate);
                        my.scrollers[i].on('beforeScrollStart', scrollAnimate);
                    } else {
                        // 已初始化scroller
                    }
                    scroller = my.scrollers[i];
                }
            })

            $('.container').css('transform', 'translate(0,' + contentTransform + 'px)');

            // 设置 初始化 y 值
            if (contentTransform > my.firstPosition) {
                scroller.y = contentTransform;
                // 第二级滚动如果有值
                if (scrollTransform) {
                    $(scroller.scroller).css('transform', 'translate(0,' + scrollTransform + 'px)');
                    scroller.options.isChangeY = true;
                    // 第三级滚动
                    if (thirdTransform) {
                        $('.goodsList_right').css('transform', 'translate(0,' + my.thirdTransform + 'px)');
                    }
                }
            } else {
                scroller.y = scrollTransform + contentTransform;
                if (index === 0) {
                    scroller.y = scrollTransform + contentTransform + my.thirdTransform;
                }
            }
        }

    }
}())