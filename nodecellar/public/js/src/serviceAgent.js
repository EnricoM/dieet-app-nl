define(['jquery'], function($) {

	return {
		doSubmit: function(type, url, dataType, contentType, data, yourCallback) {
			$.ajax({
				type		: type,
				url			: url,
				dataType 	: dataType,
				contentType	: contentType,
				data		: data,
				success: function (data, textStatus, xhr) {
					yourCallback(data);
				},
				error: function (xhr, textStatus, errorThrown) {
					if (xhr.status === 401) {
						window.location.href = "../logon.html"
						var	data = { "messages" : [] };
						var message = {	
							"messageType" : "SUCCESS",
							"messageCode" : "SERVICE_9998",
							"messageText" : url + " responded with " + xhr.status
						};								
					} else {
						var	data = { "messages" : [] };
						var message = {	
							"messageType" : "ERROR",
							"messageCode" : "SERVICE_9999",
							"messageText" : url + " responded with " + xhr.status
						};		
						data.messages.push(message);	
					}
					yourCallback(data);
				}
			});
		},
	
		doDelete: function(type, url, dataType, contentType, yourCallback) {
			$.ajax({
				type		: type,
				url			: url,
				dataType 	: dataType,
				contentType	: contentType,
				success: function (data, textStatus, xhr) {
					yourCallback(data);
				},
				error: function (xhr, textStatus, errorThrown) {
					if (xhr.status === 401) {
						window.location.href = "../login.html"
						var	data = { "messages" : [] };
						var message = {	
							"messageType" : "SUCCESS",
							"messageCode" : "SERVICE_9998",
							"messageText" : url + " responded with " + xhr.status
						};		
						data.messages.push(message);						
					} else {
						var	data = { "messages" : [] };
						var message = {	
							"messageType" : "ERROR",
							"messageCode" : "SERVICE_9999",
							"messageText" : url + " responded with " + xhr.status
						};		
						data.messages.push(message);	
					}
					yourCallback(data);
				}
			});
		},
		
		doGet: function(type, url, dataType, contentType, yourCallback) {
			$.ajax({
				type		: type,
				url			: url,
				dataType 	: dataType,
				contentType	: contentType,
				success: function (data, textStatus, xhr) {
					yourCallback(data);
				},
				error: function (xhr, textStatus, errorThrown) {
					if (xhr.status === 401) {
						window.location.href = "../login.html"
						var	data = { "messages" : [] };
						var message = {	
							"messageType" : "SUCCESS",
							"messageCode" : "SERVICE_9998",
							"messageText" : url + " responded with " + xhr.status
						};								
					} else {
						var	data = { "messages" : [] };
						var message = {	
							"messageType" : "ERROR",
							"messageCode" : "SERVICE_9999",
							"messageText" : url + " responded with " + xhr.status
						};		
						data.messages.push(message);
					}
					yourCallback(data);
				}
			});	
		}
	};
});