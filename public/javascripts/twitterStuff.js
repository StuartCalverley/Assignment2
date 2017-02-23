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

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
	$.ajax({
		type: 'GET',
		url: '/auth',
		data: {token: id_token},
		success: function(output) {
			window.location.href="/application?param1="+id_token;
		}
	});

}

function signUpPage() {
	window.location.href="/signUp";
}