$(document).ready(function() {
	
	$("#loginButton").click(function() {
		var password = $('#passwordLogin').val();
		var email = $('#emailLogin').val();
		window.location.href="/application?param1="+email+"&param2="+password;
	});
});