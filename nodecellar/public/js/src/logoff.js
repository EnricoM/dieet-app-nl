requirejs.config({
    baseUrl: 'js/lib',
	shim: {
        'jquery.validate': ['jquery'],
		'jquery.validate.override' : ['jquery.validate']
	}
});


require(["bootstrap", "../src/serviceAgent", "jquery", "jquery.validate", "jquery.validate.override"], function(bootstrap, serviceAgent, $) {
	$(document).ready(function(){
		serviceAgent.doDelete("DELETE", "/session", "json", "application/json; charset=utf-8", function(response) {
			window.location.href = "../index.html"
		});
	});
});