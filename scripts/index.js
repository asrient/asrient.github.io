var controller = new ScrollMagic.Controller();

var screenHt = window.innerHeight;

// build tween
var s1_hi_tween = TweenMax.to("#hi", 1, { 'opacity': 0.4, scale: 0.7, top:'-60px' });
var s1_intro_tween = TweenMax.to("#intro", 1, { 'opacity': 1, scale: 1.2, top:'60px' });
var s2_bg_tween = TweenMax.to("#bg", 1, { 'background-color': 'rgb(0, 23, 38)' });
var s3_bg_tween = TweenMax.to("#bg", 1, { 'background-color': 'rgb(38, 27, 0)' });
var s2_bar_tween = TweenMax.to("#s2box", 1, { 'background-color': 'rgb(38, 27, 0)', width: '100vw', height: '100vh' });

// build scene
var s1_hi_scene = new ScrollMagic.Scene({ triggerElement: "#s1", triggerHook: 0, duration: screenHt/4, offset: 0 })
	.setTween(s1_hi_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

	var s1_intro_scene = new ScrollMagic.Scene({ triggerElement: "#s1", triggerHook: 0, duration: screenHt/4, offset: 0 })
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

var s3_bg_scene = new ScrollMagic.Scene({ triggerElement: "#s2", triggerHook: 0, duration: screenHt / 4, offset: 100 })
	.setTween(s3_bg_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);