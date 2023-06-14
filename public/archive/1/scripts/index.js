var controller = new ScrollMagic.Controller();

var screenHt = window.innerHeight;

// build tween
var s1_hi_tween = TweenMax.to("#hi", 1, { 'opacity': 0.4, scale: 0.7, top: '-60px' });
var s1_intro_tween = TweenMax.to("#intro", 1, { 'opacity': 1, scale: 1.2, top: '60px' });
var s2_bg_tween = TweenMax.to("#bg", 1, { 'background-color': 'rgb(0, 23, 38)' });
var s3_bg_tween = TweenMax.to("#bg", 1, { 'background-color': 'rgb(18, 0, 20)' });
var appcards_tween = TweenMax.to(".appcard", 1, {'background-color': 'rgb(37, 17, 35)' });
var s2_bar_tween = TweenMax.to("#s2box", 1, { 'background-color': 'rgb(18, 0, 20)', width: '100vw', height: '100vh' });

// build scene
var s1_hi_scene = new ScrollMagic.Scene({ triggerElement: "#s1", triggerHook: 0, duration: screenHt / 4, offset: 0 })
	.setTween(s1_hi_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

var s1_intro_scene = new ScrollMagic.Scene({ triggerElement: "#s1", triggerHook: 0, duration: screenHt / 4, offset: 0 })
	.setTween(s1_intro_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

var s1_fade_scene = new ScrollMagic.Scene({ triggerElement: "#s1", triggerHook: 0, duration: screenHt, offset: 0 })
	.setTween(s2_bg_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

var s2_bar_scene = new ScrollMagic.Scene({ triggerElement: "#s2", triggerHook: 0, duration: screenHt / 3, offset: -100 })
	.setTween(s2_bar_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

var appcards_scene = new ScrollMagic.Scene({ triggerElement: "#s3", triggerHook: 0, duration: screenHt / 2, offset: 0 })
	.setTween(appcards_tween)
	//.addIndicators({ name: "appcard" }) // add indicators (requires plugin)
	.addTo(controller);

var s3_bg_scene = new ScrollMagic.Scene({ triggerElement: "#s2", triggerHook: 0, duration: screenHt / 4, offset: 100 })
	.setTween(s3_bg_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

$(".appcard").each(function(){
	var elem=$(this)
	var isActive=false;
	elem.hover( ()=>{
		//mouse enter
		isActive=true
	}, ()=>{
		elem.css({transform: `perspective(870px) rotateX(0deg) rotateY(0deg) scale3d(1.015, 1.015, 1.015)`})
		isActive=false
	} )
	var midY=elem.outerHeight()/2
	var midX=elem.outerWidth()/2
	elem.mousemove((e)=>{
		var rotX=(-midX-e.offsetX)/(midX/1.5)
		var rotY=(midY-e.offsetY)/(midY/1.5)
		elem.css({transform: `perspective(870px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`})
	})
})