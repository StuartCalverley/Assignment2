$( document ).ready(function(){
	$('#completeSignUp').click(function() {
		var name = $('#SignUp-name').val();
		var email = $('#email-name').val();
		var password = $('#SignUp-pass').val();

		/**
		 * Creates an account for the user, if the account is valid (email account not in use)
		 * they will be redirected to the home page.
		 */
		$.ajax({
			type: 'GET',
			url: '/registerUser',
			data: {userName:name, emailAcc: email, pass: password},
			success: function(output){
				console.log(output);
				if(output == "OK") {
					alert("Successfully created an account");
					window.location.href="/";
				} else {
					alert("We are experiencing difficulties.");
				}
			}
		});
	});
});