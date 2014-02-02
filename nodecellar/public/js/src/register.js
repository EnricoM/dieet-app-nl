requirejs.config({
    baseUrl: 'js/lib',
	shim: {
        'jquery.validate': ['jquery'],
		'jquery.validate.override' : ['jquery.validate']
	}
});


require(["bootstrap", "../src/serviceAgent", "jquery", "jquery.validate", "jquery.validate.override"], function(bootstrap, serviceAgent, $) {
	$(document).ready(function() {
		$("[rel=tooltip]").tooltip({ placement: 'right'});
		$(".alert").addClass('hide');
		$('#contactForm').validate({
			rules: {
				firstName: {
					required: true
				},
				lastName: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				pwd1: {
					minlength: 6,
					required: true
				},
				pwd2: {
					equalTo: pwd1,
					required: true
				}
			},
			highlight: function(element) {
				$(element).closest('.control-group').removeClass('success').addClass('error');
			},
			success: function(element) {
				element
				.text('OK!').addClass('valid')
				.closest('.control-group').removeClass('error').addClass('success');
			},
			submitHandler: function(form) {
				var registration = {
					"firstName" : $("#firstName").val(),
					"lastName" : $("#lastName").val(),
					"email" : $("#email").val(),
					"pwd" : $("#pwd1").val()
				};
				serviceAgent.doSubmit("POST", "/registration", "json", "application/json; charset=utf-8", JSON.stringify(registration), function(response) {
					if(response && response.messages && response.messages[0]) {
						var message;
						if (response.messages) {
							message = response.messages[0];
						}
						switch(message.messageType) {
							case "ERROR" : {
								$(".alert").removeClass('hide');
								$(".alert").removeClass("alert-success").addClass("alert-danger");
								$("#messageText").text(message.messageText);
								$("#messageType").text(message.messageType);
								$('.alert').attr('title', message.messageCode);
								break;
							}
							case "SUCCESS" : {
								window.location.href = "../settings.html"
								break;
							}
						};
					} else {
						
					}
				});
			}
		});
	});
});