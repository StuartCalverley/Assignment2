$(document).ready(function() {
	$("#tweets").click(function() {
		$.ajax({
			type: 'GET',
			url: '/twitterStuff',
			success: function(output) {
				console.log(output);
			}
		})
	});

	
});

//Does the google signin 
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
	//Passes in the id_token to the application route to verify if the id_token ligitiment
	$.ajax({
		type: 'GET',
		url: '/auth',
		data: {token: id_token},
		success: function(output) {
			window.location.href="/application?param1="+id_token;
		}
	});

}

//Redirects the user to the signup page
function signUpPage() {
	window.location.href="/signUp";
}