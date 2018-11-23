window.onload = function() {
    commdityDetail.initSwiper();
    commdityDetail.initScroll();
    commdityDetail.initLeftScroll();
    commdityDetail.initClickTab();
}

// 影子
function shadow(arrEl) {
    $.each(arrEl, function (i,item){
        item.addEventListener('touchstart',function(){
            $(this).css('background', 'rgba(0,0,0,.5)');
        })
        item.addEventListener('touchend',function(){
            $(this).css('background', 'unset');
        })
    })
}



var commdityDetail = (function() {
    var my = {};

    return {
        spec: my,
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
                        var contentTransform = $('.container').css('transform') !== 'none' ? parseInt($('.container').css('transform').match(/-?\d+/g)[5], 10) : 0;

                        my.scrollTransform[this.previousIndex] = parseInt($(my.scrollers[this.previousIndex].scroller).css('transform').match(/-?\d+/g)[5], 10);
                        // 如果是特殊的第一页
                        if (this.previousIndex === 0) {
                            my.thirdTransform = $('.goodsList_right').css('transform') !== 'none' ? parseInt($('.goodsList_right').css('transform').match(/-?\d+/g)[5], 10) : 0;
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



            //原始
            var scaleValue = 10,
                searchOpacity = 0;

            function setStatus(status) {
                if (status) {
                    // 开启 模糊 缩小 等
                    $('.header img').css('filter', 'blur(10px)');
                    $('.brandIcon').css('transform', 'scale(0)');
                    $('.favoriteIcon').css('transform', 'scale(0)');
                    $('.spell').css('opacity', 0).hide();
                    $('.header').addClass('headerPosition');
                    $('.hswm_search').css({ 'display': 'block', 'opacity': 1 })
                } else {
                    // 关闭 模糊 缩小 等
                    $('.header img').css('filter', 'blur(0px)');
                    $('.brandIcon').css('transform', 'scale(1)');
                    $('.favoriteIcon').css('transform', 'scale(1)');
                    $('.spell').css('opacity', 1).show();
                    $('.header').removeClass('headerPosition');
                    $('.hswm_search').css({ 'display': 'none', 'opacity': 0 })
                    $('.container').css('transform', 'translateY(0px)');
                }
            }
            //结束


            function scrollAnimate() {
                var y = this.y >> 0;

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
                     
                        $('.oneScrollerWrapper, .twoScrollerWrapper, .threeScrollerWrapper').css({overflow: 'hidden', height: 488})

                } else if (y <= my.firstPosition) {
                        $('.oneScrollerWrapper, .twoScrollerWrapper, .threeScrollerWrapper').css({overflow: 'unset', height: 275})

                    if (y === my.firstPosition) {
                        if (this.options.isChangeY) {
                            if (index === 0) {
                                y = this.y = this.startY = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition + my.thirdTransform;
                                my.thirdTransform = 0;
    
                            } else {
                                y = this.y = this.startY = my.scrollTransform[my.mySwiper.activeIndex] + my.firstPosition;
                            }

                            my.scrollTransform[my.mySwiper.activeIndex] = 0;
                            this.options.isChangeY = false;
                            if (index ===0) {
                                my.thirdTransform = 0;
                            }
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

                        $('.goodsList_right').css('transform', 'translate(0,' + (y - my.secondPosition) + 'px)');
                        $(this.scroller).css('transform', 'translate(0,' + (my.secondPosition - my.firstPosition) + 'px)');
                        my.thirdTransform = 0;

                        // 初始化头部定位
                        if (isSwitch) {
                            isSwitch = false;
                            $('.rn_title').eq(my.titleIndex).insertAfter('.goodsList_left').addClass('active_rn_title').next().find('li:first-child').addClass('goodsList_right_li_loseHead');
                        }

                        if (y < my.secondPosition - my.listHeight[my.titleIndex]) { // 1743
                            $('.active_rn_title').prependTo($('.goodsList_right li').eq(my.titleIndex)).addClass('active_rn_title_middle');
                            my.prevIndex = my.titleIndex
                            if (y < my.secondPosition - my.listHeight[my.titleIndex] - titleHeight) { //1783
                                my.titleIndex = my.titleIndex + 1;
                                $('.active_rn_title').removeClass('active_rn_title');
                                $('.rn_title').eq(my.titleIndex).addClass('active_rn_title').insertAfter('.goodsList_left').next().find('li').eq(my.titleIndex).addClass('goodsList_right_li_loseHead');

                            }
                        }



                        if (y > my.secondPosition - my.listHeight[my.prevIndex] - titleHeight) { // 1783
                            if (my.prevIndex !== my.titleIndex) {
                                $('.active_rn_title').prependTo($('.goodsList_right li').eq(my.titleIndex).removeClass('goodsList_right_li_loseHead')).removeClass('active_rn_title');
                                $('.rn_title').eq(my.prevIndex).addClass('active_rn_title');
                                my.titleIndex = my.titleIndex - 1;
                            }
                            if (y > my.secondPosition - my.listHeight[my.prevIndex]) { // 1743
                                $('.active_rn_title').insertAfter('.goodsList_left').removeClass('active_rn_title_middle');
                                my.prevIndex = my.prevIndex ? my.prevIndex - 1 : 0;

                            }
                        }
                        
                        // console.log(my.titleIndex);
                    } else {
                        if (my.thirdTransform) {
                            $('.goodsList_right').css('transform', 'translate(0,' + my.thirdTransform + 'px)');
                        } else {
                            $('.goodsList_right').css('transform', 'translate(0,0)');
                            $('.rn_title').eq(my.titleIndex).prependTo($('.goodsList_right li').eq(my.titleIndex).removeClass('goodsList_right_li_loseHead')).removeClass('active_rn_title');
                            my.titleIndex = my.prevIndex = 0;
                            isSwitch = true;
                        }
                    }
                }

                // scrollEnd exec code 
                if (scrollAnimate.caller.arguments[0] === 'scrollEnd') {
                    this.options.fixed = false;
                }

                $('.goodsList_left li').removeClass('activeLeft').eq(my.titleIndex).addClass('activeLeft')

                // 左右滚动切换
                if (my.clickLeft) {
                    if (y <= -553 && this.startY > -553) {
                        this._translate(0, -553);
                        y = this.y = -553;
                        $('.goodsList_right').css('transform', 'translate(0,0)');
                        $('.container').css('transform', 'translate(0,' + my.firstPosition + 'px)');
                        $(this.scroller).css('transform', 'translate(0,' + (y - my.firstPosition) + 'px)');

                        if (scrollAnimate.caller.arguments[0] !== 'scrollEnd' && scrollAnimate.caller.arguments[0] !== 'beforeScrollStart') {
                            this.options.fixed = true;
                        }
                    }
                }

                //原始
                // 模糊
                if (y >= -10) {
                    $('.header img').css('filter', 'blur(' + -y + 'px)');
                }
                // 缩小
                if (y <= -10 && this.directionY > 0 && scaleValue) {
                    // 确保在通过 10px 移动后 模糊终值
                    $('.header img').css('filter', 'blur(' + 10 + 'px)');

                    //图标缩小
                    scaleValue -= 1;
                    $('.brandIcon').css('transform', 'scale(.' + scaleValue + ')');
                    $('.favoriteIcon').css('transform', 'scale(.' + scaleValue + ')');
                    $('.spell').css('opacity', '.' + scaleValue);
                    if (scaleValue == 0) {
                        $('.spell').hide();
                    }
                }
                // 放大
                if (y >= -20 && this.directionY < 0 && scaleValue < 10) {
                    //图标放大
                    scaleValue += 1;
                    $('.brandIcon').css('transform', 'scale(' + (scaleValue == 10 ? 1 : '.' + scaleValue) + ')');
                    $('.favoriteIcon').css('transform', 'scale(' + (scaleValue == 10 ? 1 : '.' + scaleValue) + ')');
                    $('.spell').css({ display: 'block', opacity: scaleValue == 10 ? 1 : '.' + scaleValue });
                    if (scaleValue == 10) {
                        $('.spell').show();
                    }
                }
                // 搜索栏 透明度 显示
                if (y <= -30 && this.directionY > 0 && searchOpacity < 10) {
                    searchOpacity += 1;
                    $('.hswm_search').css({ 'display': 'block', 'opacity': (searchOpacity == 10 ? 1 : '.' + searchOpacity) })
                }
                // 搜索栏 透明度 隐藏
                if (y > -30 && this.directionY < 0 && searchOpacity) {
                    searchOpacity -= 1;
                    $('.hswm_search').css({ 'display': 'block', 'opacity': (searchOpacity == 0 ? 0 : '.' + searchOpacity) })
                    if (searchOpacity == 0) {
                        $('.hswm_search').hide();
                    }
                }
                // 头部 模糊
                if (y <= -50) {
                    $('.header').addClass('headerPosition').css('clip', 'rect(0,' + window.document.body.offsetWidth + 'px, .5rem, 0)');
                    $('.container').css('margin-top', '100px');
                    // 开启 所有 效果 最终值 例如 opacity 1 scale 1
                    setStatus(1);

                } else {
                    $('.header').removeClass('headerPosition').css('clip', 'unset');
                    $('.container').css('margin-top', '0');
                }

                if (y <= -213) {
                    $('.selectWrapper').appendTo('body').addClass('con_top_position');
                } else {
                    $('.selectWrapper').insertAfter($('.container_inner_bottom')).removeClass('con_top_position');
                }

                if (y < -213 && this.startY > -213 || y > -213 && this.startY < -213) {
                    this.options.subMargin = -213;
                    this._translate(0, -213);
                    $('#scroller').css('transform', 'translate(0,0)');
                    $('.container').css('transform', 'translateY(' + -213 + 'px)');
                }
                if (y === 0) {
                    // 关闭 所有 效果 最终值 opacity 0 scale 0
                    setStatus();
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
        },
        initLeftScroll: function() {
            var switchStop = false;
            // // 阻止冒泡
            function stopEvent(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            // 初始化左边滚动
            function leftScroll_one() {
                var y = this.y >> 0;
                // 开启 左滚动 固定坐标
                my.clickLeft = true;

                if (my.scrollers[0].y <= my.secondPosition) {
                    if (!switchStop && leftScroll_one.caller.arguments[0] !== 'scroll') {
                        ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                            document.querySelector('.goodsList_left').addEventListener(item, stopEvent)
                        });
                        switchStop = true;
                    }
                } else {
                    this._translate(0, -1);
                    switchStop = false;

                }
                if (y === 0) {
                    this._translate(0, -1);
                }
                if (y >= 0 && switchStop && leftScroll_one.caller.arguments[0] === 'scroll') {
                    ['touchstart', 'pointerdown', 'MSPointerDown', 'mousedown'].forEach(function(item, i) {
                        document.querySelector('.goodsList_left').removeEventListener(item, stopEvent)
                    });
                }
            }

            var leftScroll = new IScroll('.leftWrapper', {
                probeType: 3,
                bounce: false
            })

            leftScroll.on('beforeScrollStart', leftScroll_one);
            leftScroll.on('scrollEnd', leftScroll_one);
            leftScroll.on('scroll', leftScroll_one);

            ['.advertsingImg', '.specialPriceShowImg', '.today_good_special_price', '.goodsList_right'].forEach(function(item, index) {
                document.querySelector(item).addEventListener('touchstart', function() {
                    // 关闭 左滚动 固定坐标
                    my.clickLeft = false;
                })
            })

            // 点击方法
        },
        initClickTab: function () {
            shadow($('.selectTabItem'));          
            $('.selectTabItem').on('click', function(){
                my.mySwiper.slideTo($(this).index());
            })
        }
    }
}())