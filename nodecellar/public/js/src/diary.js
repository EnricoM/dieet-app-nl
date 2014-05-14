requirejs.config({
    baseUrl: 'js/lib',
	shim: {
        'jquery.validate': ['jquery'],
		'jquery.validate.override' : ['jquery.validate']
	}
});

require(["require_json_template", "bootstrap", "../src/serviceAgent", "jquery", "jquery.validate", "jquery.validate.override"], function(jsontemplate, bootstrap, serviceAgent, $) {
	$(document).ready(function(){
	
		var searchResultScreenNonXS =	
			"{.section products}" + 
			"<div class='row'>"+
			"<div id='resultsNonXS'>" +			
			"{.repeated section @}" + 
			"<div class='col-xs-6 col-sm-4 col-md-3 col-lg-2 column'>"+
        		"<a data-toggle='modal' href='#diaryDetails' class='searchResult' _id='{_id}'>" +
					"<img src='img/{product}.jpg' class='thumbnail img-responsive' alt='{product}' title='{product}' product='{product}' category='{category}' _id='{_id}'/>" +
					"<h4>{product}</h4>" +
				"</a>" +
			"</div>"+
			"{.end}" +
			"{.end}"; +
			"</div>";
			
		var productDetailsHeader = 
			"{.section products}" + 
			"<h3 class='productDetailsHeader'>{product}" +
			"<button class='btn pull-right btn-small' data-dismiss='modal' aria-hidden='true' id='closeModal'>Close</button>" +
			"</h3>" +
			"{.end}";

		var productDetailsContent = 
			"{.section products}" + 
			"<form class='productDetailsContent' id='detailsId' detailsId={_id} >"+
			"<fieldset>"+
			"<input type='number' id='quantityInput' min='1' max='9999'/>"+
			"<select name='Eenheden' id='unitsDiary'>"+
			"{.repeated section Eenheden}" + 
			"<option value={hoeveelheid}>{omschrijving}</option>"+
			"{.end}" +
			"</select><br/><br/>"+
			"<input type='button' value='dagboek' id='addToDiary' class='details-button'/>"+
			"</fieldset>"+
			"</form>" +
			"{.end}";

		var tableContentNonXS = 
			"<table id='dailyResultsTableNonXS' class='table table-striped'>" +
				"<thead>" +
					"<tr>" +
						"<th>Product</th>" +
						"<th class='tnr'>Kcal</th>" +
						"<th class='tnr'>Eiwit</th>" +
						"<th class='tnr'>Koolh</th>" +
						"<th class='tnr'>Vet</th>" +
						"<th></th>" +
					"</tr>" +
					"{.section actuals}" +
					"<tr>" +
						"<th>{type}</th>" +
						"<th id='totalKcal' class='tnr'>{totalKcal}</th>" +							
						"<th class='tnr'>{totalProtein}</th>" +
						"<th class='tnr'>{totalCarbon}</th>" +
						"<th class='tnr'>{totalFat}</th>" +
						"<th></th>" +
					"</tr>" +
					"{.end}" +
					"</thead>" +
			
				"<tbody>" +
					"{.repeated section result}" +
					"<tr>" +
						"<td>{product}</td>" +
						"<td class='tnr'>{totalKcal}</td>" +
						"<td class='tnr'>{totalEiwit}</td>" +
						"<td class='tnr'>{totalKoolh}</td>" +
						"<td class='tnr'>{totalVet}</td>" +					
						"<td class='tnr'>" +
							"<img src='img/delete.jpg' title='Verwijderen' alt='Verwijderen' height=20 width=20 data-val={_id} class='removeFromDiary'> " + 
						"</td>" +
					"</tr>" +
					"{.end}" +
				"</tbody>" +
				"<tfoot>" +					
					"{.repeated section totals}" +
					"<tr>" +
						"<th>{type}</th>" +
						"<th class='tnr'>{total}</th>" +							
						"<th></th>" +
						"<th></th>" +
						"<th></th>" +
						"<th></th>" +
					"</tr>" +
					"{.end}" +
				"</tfoot>" +
			"</table>";		

		serviceAgent.doGet("GET", "/settings", "json", "application/json; charset=utf-8", function(response) {
			if (response && response.messages && response.messages[0]) {
				if (response.messages[0].messageType === "SUCCESS") {
					$("#userName").text(response.firstName);
				}
			}
		});
		
		$('#diaryDatePicker').val(new Date().toJSON().substring(0,10));
		var diaryDate = $('#diaryDatePicker').val();
		getDiary(diaryDate);
		
		$("#diaryDatePicker").change(function(event) {
			var diaryDate = $('#diaryDatePicker').val();
			$(".alert").removeClass("alert-error").addClass("hide");
			getDiary(diaryDate);
		});
		
		$("#clearInput").bind('click', function(event) {
			clearInput();
		});
		
		$("#showTable").bind('click', function(event) {
			var containsTable = $("#tableResults").hasClass("hide").toString();
			if ($("#tableResults").hasClass("hidden")) {
				$("#tableResults").removeClass("hidden");
			} else {
				$("#tableResults").addClass("hidden")
			}
		});
		
		function clearInput() {
			var category = $("#categories").val(-1);
			var product = $("#product").val("");
			$("#resultsNonXS").remove();
		};
		
		function removeFromDiary(_id) {
			var diaries = {
				"diaryDate" : $('#diaryDatePicker').val(),
				"_id" : _id,
			};
			serviceAgent.doSubmit("DELETE", "/diaries", "json", "application/json; charset=utf-8", JSON.stringify(diaries), function(response) {
				if (response && response.messages && response.messages[0] && response.messages[0].messageType === "SUCCESS") {
					getDiary($('#diaryDatePicker').val());
				} else {
					$(".alert").removeClass("hide").addClass("alert-danger");
					$("#messageText").text(response.messages[0].messageText);
					$("#messageType").text(response.messages[0].messageType);
					$('.alert').attr('title', response.messages[0].messageCode);																						
				}
			});
		};
		
		function getDiary(diaryDate) {
			var url = "/diaries?diaryDate=" + diaryDate;
			$('#diaryDetails').modal('hide');
			serviceAgent.doGet("GET", url, "json", "application/json; charset=utf-8", function(response) {
				if (response && response.messages && response.messages[0]) {
					var messageType = response.messages[0].messageType;
					switch(messageType) {
						case "SUCCESS" : {
							$('#dailyResultsTableNonXS').remove();
							clearInput();
							var _t4 = jsontemplate.Template(tableContentNonXS);
							var fragment4 = _t4.expand(response);
							$('#tableResults').append(fragment4);
							var totalKcal = $("#totalKcal").text();
							$("#totalKcalCopy").val("Totaal kCal: " + totalKcal);
							break;
						}
						case "ERROR" : {
							$(".alert").removeClass("hide").addClass("alert-danger");
							$("#messageText").text(response.messages[0].messageText);
							$("#messageType").text(response.messages[0].messageType);
							$('.alert').attr('title', response.messages[0].messageCode);																						
							break;
						}
					}
				} else {
					$(".alert").removeClass("hide").addClass("alert-danger");
					$("#messageText").text(response.messages[0].messageText);
					$("#messageType").text(response.messages[0].messageType);
					$('.alert').attr('title', response.messages[0].messageCode);												
				}
			});
		};
		
		function addSearchResultHandlers() {
			$('.searchResult').bind('click', function(event) {
				var _id = $(this).attr('_id');
				console.log('id: ', _id);
				getDetails(_id);
			});
		};
		
		function modalHandlers() {
			$('#addToDiary').bind('click', function(event) {
				var _id = $('#detailsId').attr('detailsId');
				var unit = $("#unitsDiary").val();
				var quantity = $('#quantityInput').val();
				var diaryDate = $('#diaryDatePicker').val()
				var url = "/diaries?diaryDate=" + diaryDate;
				var diaries = {
					"diaryDate" : diaryDate,
					"productId" : _id,
					"totalQuantity" : quantity * unit
				};
				serviceAgent.doSubmit("POST", "/diaries", "json", "application/json; charset=utf-8", JSON.stringify(diaries), function(response) {
					if (response && response.messages && response.messages[0] && response.messages[0].messageType === "SUCCESS") {
						getDiary(diaryDate);
					}
				});
			});
		}; 
		
		function getDetails(_id) {
			$('.productDetailsHeader').remove();
			$('.productDetailsContent').remove();
			var url;
			if (_id) {
				url = "/products?_id=" + _id;
				serviceAgent.doGet("GET", url, "json", "application/json; charset=utf-8", function(response) {
					if (response && response.products) {
						$('#diaryDetails').modal('show' );
						var _t1 = jsontemplate.Template(productDetailsHeader);
						var fragment1 = _t1.expand(response);
						var _t2 = jsontemplate.Template(productDetailsContent);
						var fragment2 = _t2.expand(response);
						$('.modal-header').append(fragment1);
						$('.modal-body').append(fragment2);
						$('#addToDiary').focus();
						modalHandlers();
					}
				});
			}
		}
				
		function getProducts() {
			var category = $("#categories").val();
			var product = $("#product").val();
			var url =  "/products?category=" + category + "&product=" + product;
			serviceAgent.doGet("GET", url, "json", "application/json; charset=utf-8", function(response) {
				if (response && response.products) {
					$("#resultsNonXS").remove();
					var _t2 = jsontemplate.Template(searchResultScreenNonXS);
					var fragment2 = _t2.expand(response);
					$("#searchResult").append(fragment2);
					addSearchResultHandlers();
				}
			});
		}			
		
		serviceAgent.doGet("GET", "/categories", "json", "application/json; charset=utf-8", function(response) {
			if (response.messages[0].messageType === "SUCCESS") {
				if (response.categories) {
					$.each(response.categories, function(index, item) {
						$("#categories").append($("<option></option>").text(item._id).val(item._id));
					});
					$('#diary_datePicker').val(new Date().toJSON().slice(0,10));
					$(".container-categories").removeClass("hide");
				}
			} else {
					$(".alert").removeClass("hide").addClass("alert-danger");
					$("#messageText").text(response.messages[0].messageText);
					$("#messageType").text(response.messages[0].messageType);
					$('.alert').attr('title', response.messages[0].messageCode);				
			}
		});		
		
		$("#product").bind('keyup', function(event) {
			getProducts();
		});		
		
		$("#categories").change(function() {
			getProducts();
		});	
		
		$('#diaryDetails').on('hidden', function(){
			console.log('got here');
			$(this).data('modal', null);
		});
		
		$(".removeFromDiary").live('click', function( event ){
			removeFromDiary($(this).data('val'));
		});		
	});
});
		