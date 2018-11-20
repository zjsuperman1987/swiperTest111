window.onload = function() {
    commdityDetail.initSwiper();
    commdityDetail.initScroll();
}

 



 
var commdityDetail = (function() {
    var my = {};

    return {
        initSwiper: function() {
            my.scrollTransform = [];
            my.scrollers = [];
            my.scrollersDom = $('.swiper-tab .swiper-slide:not(.not-collection)').children();
            my.firstPosition = -($('.h_searchWrapper').outerHeight() + $('.iw_info').outerHeight());
            my.secondPosition = -553;

            // 创建变量保存scroller对象
            $.each(my.scrollersDom, function(i, item) {
                my[i] = false;
                my.scrollTransform.push(0);
            })
            // 初始化 swiper
            my.mySwiper = new Swiper('.swiper-container', {
                resistanceRatio: 0,
                freeMode: false,
                on: {
                    slideChange: function() {
                        var contentTransform = $('.container').css('transform') !== 'none' ? parseInt($('.container').css('transform').match(/-?\d+/g)[5], 10) : 0;
                        my.scrollTransform[this.previousIndex] = parseInt($(my.scrollers[this.previousIndex].scroller).css('transform').match(/-?\d+/g)[5], 10);

                        my.scrollers[this.previousIndex].disable();
                        commdityDetail.initScroll(this.activeIndex, contentTransform);
                        my.scrollers[this.activeIndex].enable();
                    },
                    setTranslate: function(translate) {
                        $('.border_bottom_line').css('transform', 'translateX(' + (-translate / my.scrollersDom.length) + 'px)');
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
                contentTransform = contentTransform ? contentTransform : 0,
                scrollTransform = my.scrollTransform[index],
                scroller,

                title_index = 0,
                old_goodHeight,
                goodHeight = $('.goodsList_right li').eq(title_index).outerHeight() - titleHeight,
                titleHeight = $('.rn_title').eq(0).outerHeight();






            function scrollAnimate() {
                var y = this.y >> 0;

                console.log(y, scrollAnimate.caller.arguments[0], this.options.fixed, my.scrollTransform[my.mySwiper.activeIndex], this);

                // 初始定位位置 -213 
                if (y < my.firstPosition && this.startY > my.firstPosition || y > my.firstPosition && this.startY < my.firstPosition) {
                    y = this.y = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition;
                    this.options.fixed = true; //进入后不执行动能
                    console.log('骚骚的进入', scrollAnimate.caller.arguments[0], this.startY, y);
                }

                if (y > my.firstPosition) {
                    $('.container').css('transform', 'translate(0,' + y + 'px)');
                    $(this.scroller).css('transform', 'translate(0,' + (my.scrollTransform[my.mySwiper.activeIndex] ? my.scrollTransform[my.mySwiper.activeIndex] : 0) + 'px)');
                } else if (y <= my.firstPosition) {

                    if (y === my.firstPosition) {
                        if (this.options.isChangeY) {
                            y = this.y = this.startY = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition;
                            my.scrollTransform[my.mySwiper.activeIndex] = 0;
                            this.options.isChangeY = false;
                            console.log(y, 'jjjjjjjjjjjjjjjjjjjjj', this.startY);
                        }
                    }

                    if (scrollAnimate.caller.arguments[0] === 'beforeScrollStart') {
                        my.scrollTransform[my.mySwiper.activeIndex] = 0;
                        console.log('我进来设置0了')
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

                        if (this.directionY > 0) {
                            if (!$('.rn_title').hasClass('active_rn_title_middle')) {
                                $('.rn_title').eq(title_index).insertAfter('.goodsList_left').addClass('active_rn_title');
                                $('.goodsList_right li').eq(title_index).addClass('goodsList_right_li_loseHead');
                            }

                            // 零界点
                            if (y <= my.secondPosition - goodHeight) {
                                $('.rn_title').eq(title_index).prependTo($('.goodsList_right li').eq(title_index)).addClass('active_rn_title_middle');
                                title_index = title_index + 1;
                                old_goodHeight = my.secondPosition - goodHeight;
                                goodHeight += $('.goodsList_right li').eq(title_index).outerHeight() - titleHeight;
                                
                            }
                            if (y < old_goodHeight - titleHeight) {
                                alert(999)
                                $('.rn_title').eq(title_index).insertAfter('.goodsList_left').addClass('active_rn_title');
                                $('.goodsList_right li').eq(title_index).addClass('goodsList_right_li_loseHead');
                            }
                        } else {
                            if (y > old_goodHeight - titleHeight) {
                                $('.rn_title').eq(title_index).prependTo($('.goodList_right li').eq(title_index)).removeClass('active_rn_title');
                                $('.goodsList_right li').eq(title_index).removeClass('goodsList_right_li_loseHead');
                            }
                            if (y > old_goodHeight) {
                                $('.rin_title').eq(title_index - 1).insertAfter('.goodsList_left').removeClass('active_rn_title_middle');
                                title_index = title_index - 1;
                                old_goodHeight -= $('.goodsList_right li').eq(title_index).outerHeight();
                            }
                        }


                    } else {
                        $('.goodsList_right').css('transform', 'translate(0,0)');
                        $('.rn_title').eq(title_index).prependTo($('.goodsList_right li').eq(title_index)).removeClass('active_rn_title');
                        $('.goodsList_right li').eq(title_index).removeClass('goodsList_right_li_loseHead');
                        title_index = 0;
                    }
                }













                // scrollEnd exec code 
                if (scrollAnimate.caller.arguments[0] === 'scrollEnd') {
                    this.options.fixed = false;
                }



            }





            // 创建滚动对象
            $.each(my.scrollersDom, function(i, item) {
                if (i === index) {
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
                }
            } else {
                scroller.y = scrollTransform + contentTransform;
            }
        }





    }
}())

















