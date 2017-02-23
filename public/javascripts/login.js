$(document).ready(function() {
	
	$("#loginButton").click(function() {
		var password = $('#passwordLogin').val();
		var email = $('#emailLogin').val();
		$.ajax({
			type: 'GET',
			url: 'update',
			data: {email: email},
			success: function(output) {
				console.log(output);
				sessionStorage.setItem("email", email);
				window.location.href="/application?param1="+email+"&param2="+password;
			}
		})
		
	});
});