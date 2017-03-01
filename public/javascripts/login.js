$(document).ready(function() {
	//When the login button is clicked
	$("#loginButton").click(function() {
		var password = $('#passwordLogin').val();
		var email = $('#emailLogin').val();
		//Calls the update route which will set the user's active tag to true
		$.ajax({
			type: 'GET',
			url: 'update',
			data: {email: email},
			success: function(output) {
				console.log(output);
				//Stores the email in a session variable for later use
				sessionStorage.setItem("email", email);
				//Calls the route applicition and passes in the email and password to be authenicated
				window.location.href="/application?param1="+email+"&param2="+password;
			}
		})
		
	});
});