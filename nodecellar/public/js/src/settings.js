requirejs.config({
    baseUrl: 'js/lib',
	shim: {
        'jquery.validate': ['jquery'],
		'jquery.validate.override' : ['jquery.validate']
	}
});


require(["bootstrap", "../src/serviceAgent", "jquery", "jquery.validate", "jquery.validate.override"], function(bootstrap, serviceAgent, $) {
	$(document).ready(function(){
		$('#dateOfBirth').val(new Date(1970, 1, 0).toJSON().slice(0,10));
		$("[rel=tooltip]").tooltip({ placement: 'right'});
		$(".alert").addClass('hide');
		$('#settingsForm').validate(
		{
			rules: {	
				dateOfBirth : {
					required : true,
					date : true
				},
				length : {
					required: true,
					digits: true
				},
				weight : {
					required: true,
					number: true
				},
				desiredWeight : {
					required: true,
					number: true
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
				var settings = {
					"dateOfBirth" : $("#dateOfBirth").val(),
					"sexe" : $("#male").is(':checked') ? "M" : "F",
					"length" : $("#length").val(),
					"weight" : $("#weight").val(),
					"desiredWeight" : $("#desiredWeight").val(),
					"exercise" : $("#exercise").val()
				};
				serviceAgent.doSubmit("POST", "/settings", "json", "application/json; charset=utf-8", JSON.stringify(settings), function(response) {
					if(response && response.messages && response.messages[0]) {
						var message;
						if (response.messages) {
							message = response.messages[0];
						}
						switch(message.messageType) {
							case "ERROR" : {
								console.log('error found');
								$(".alert").removeClass('hide');
								$(".alert").removeClass("alert-success").addClass("alert-danger");
								$("#messageText").text(message.messageText);
								$("#messageType").text(message.messageType);
								$('.alert').attr('title', message.messageCode);
								break;
							}
							case "SUCCESS" : {
								window.location.href = "../goals.html"
								break;
							}
						};
					}
				});
			}
		});
	});
});