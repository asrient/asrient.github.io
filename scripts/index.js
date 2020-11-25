var controller = new ScrollMagic.Controller();

var screenHt = window.innerHeight;

// build tween
var s2_bg_tween = TweenMax.to("#bg", 1, { 'background-color':'rgb(0, 23, 38)' });


// build scene
var s1_fade_scene = new ScrollMagic.Scene({ triggerElement: "#s1", triggerHook: 0, duration: screenHt, offset: 0 })
	.setTween(s2_bg_tween)
	//.addIndicators({ name: "sec1 fade" }) // add indicators (requires plugin)
	.addTo(controller);

