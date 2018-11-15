window.onload = function() {
    commdityDetail.initSwiper();
    commdityDetail.initScroll();
}

var oneScroll,
    twoScroll,
    threeScroll;

var commdityDetail = (function() {
    return {
        initSwiper: function() {
            var mySwiper = new Swiper('.swiper-container', {
                resistanceRatio: 0,
                freeMode: false,
                on: {
                    slideChange: function() {
                        commdityDetail.initScroll(this.activeIndex);
                    }
                }
            })
        },
        initScroll: function(index) {
            var index = index ? index : 0;

            function scrollAnimate() {
                var y = this.y >> 0;
                console.log(this);

                if (this.scroller.className === 'one_scroller') {
                    this.scroller.style.transform = 'translate(0,0)';
                }

                if (y < -213) {
                	$('.container').css('transform','translate(0,-213px)');
                	if (this.scroller.className === 'one_scroller') {
                		$('.rightNav').css('transform','translate(0,' + (y + 213) + 'px)');
                	}else {
                		this.scroller.style.transform = 'translate(0,' + (y + 213) + 'px)'; 
                	}
                }else {
                	$('.container').css('transform', 'translate(0,' + y + 'px)');

                	if (this.scroller.className === 'one_scroller') {
	                	$('.rightNav').css('transform', 'translate(0,' + 0 + 'px)');
                	}else {
                		this.scroller.style.transform = 'translate(0,0)';
                	}
                }

            }

            if (index === 0) {
                if (!oneScroll) {
                    oneScroll = new IScroll('.one_scrollWrapper', {
                        probeType: 3,
                        bounce: false
                    })
                }
                oneScroll.on('scroll', scrollAnimate);
                oneScroll.on('scrollEnd', scrollAnimate);
                oneScroll.on('scrollCancel', scrollAnimate);
            }


            if (index === 1) {
                if (!twoScroll) {
                    twoScroll = new IScroll('.two_scrollWrapper', {
                        probeType: 3,
                        bounce: false
                    })
                }
                twoScroll.on('scroll', scrollAnimate);
                twoScroll.on('scrollEnd', scrollAnimate);
                twoScroll.on('scrollCancel', scrollAnimate);
            }

            if (index === 2) {
                if (!threeScroll) {
                    oneScroll = new IScroll('.three_scrollWrapper', {
                        probeType: 3,
                        bounce: false
                    })
                }
                oneScroll.on('scroll', scrollAnimate);
                oneScroll.on('scrollEnd', scrollAnimate);
                oneScroll.on('scrollCancel', scrollAnimate);
            }




        }

















    }
}())