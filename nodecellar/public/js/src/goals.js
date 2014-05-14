requirejs.config({
    baseUrl: 'js/lib',
	shim: {
        'jquery.validate': ['jquery'],
		'jquery.validate.override' : ['jquery.validate']
	}
});


require(["bootstrap", "../src/serviceAgent", "jquery", "jquery.validate", "jquery.validate.override"], function(bootstrap, serviceAgent, $) {
	$(document).ready(function() {
		serviceAgent.doGet("GET", "/settings", "json", "application/json; charset=utf-8", function(response) {
			if (response && response.messages && response.messages[0]) {
				if (response.messages[0].messageType === "SUCCESS") {
					$("#bmr").val(parseInt(response.BMR));
					$("#tdee").val(parseInt(response.TDEE));
					
					$("[rel=tooltip]").tooltip({ placement: 'right'});
					$(".alert").addClass('hide');
					$('#goalsForm').validate(
					{
						rules: {	
							reduceTDEE: {
								selectcheck: true
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
								"reduceTDEE" : $("#reduceTDEE").val()
							};
							serviceAgent.doSubmit("PUT", "/settings", "json", "application/json; charset=utf-8", JSON.stringify(settings), function(response) {
								if(response && response.messages && response.messages[0]) {
									var message;
									$(".alert").removeClass('hide');
									if (response.messages) {
										message = response.messages[0];
									}
									switch(message.messageType) {
										case "ERROR" : {
											console.log('error found');
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
					jQuery.validator.addMethod('selectcheck', function (value) {
						return (value != '0');
					}, "Maak een keuze");
						$("#reduceTDEE").change(function() {
						var selectedOption = $("#reduceTDEE").val();
						var tdee = parseFloat($("#tdee").val());
						var reduction = (tdee / 100) * selectedOption;
						var targetKcal = tdee - reduction;
						$("#dailyKcal").val(parseInt(targetKcal));
					});						
				} else {
					$(".alert").removeClass("alert-success").addClass("alert-error");
					$("#messageText").text(message.messageText);
					$("#messageType").text(message.messageType);
					$('.alert').attr('title', message.messageCode);				
				}
			}
		});
	});
});