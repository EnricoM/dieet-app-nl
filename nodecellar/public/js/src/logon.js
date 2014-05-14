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
		$('#contact-form').validate({
			rules: {
				email: {
					required: true,
					email: true
				},
				pwd1: {
					minlength: 6,
					required: true
				},
			},
			highlight: function(element) {
				$(element).closest('.control-group').removeClass('success').addClass('error');
			},
			success: function(element) {
				element
				.text('OK!')
				.addClass('valid')
				.closest('.control-group').removeClass('error').addClass('success');
			},
			submitHandler: function(form) {
				var session = {
					"email" : $("#email").val(),
					"pwd" : $("#pwd1").val()
				};
				serviceAgent.doSubmit("POST", "/session", "json", "application/json; charset=utf-8", JSON.stringify(session), function(response) {
					if(response && response.messages && response.messages[0]) {
						var message;
						$(".alert").removeClass('hide');
						if (response.messages) {
							message = response.messages[0];
						}
						switch(message.messageType) {
							case "ERROR" : {
								$(".alert").removeClass("alert-success").addClass("alert-danger");
								$("#messageText").text(message.messageText);
								$("#messageType").text(message.messageType);
								$('.alert').attr('title', message.messageCode);
								break;
							}
							case "SUCCESS" : {
								window.location.href = "../diary.html"
								break;
							}
						};
					}
				});
			}
		});
	});
});