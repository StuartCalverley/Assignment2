//When the signout button on the application page is clicked
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	//If the user was signed in with google sign in it will sign them out
    auth2.signOut().then(function () {
    	console.log('User signed out.');
    	console.log(sessionStorage.getItem("email"));
    	//This ajax call is for setting the active tag and setting it to false when the user logs out
    	$.ajax({
    		type: 'GET',
    		url: '/logout',
    		//Uses a sessionStorage variable to get the email that is currently logged in 
    		data: {email: sessionStorage.getItem("email")},
    		success: function(output) {
    			sessionStorage.setItem("email", "");
    			//Redirect the user to the home page
    			window.location.href="/";

    		}
    	})
    });
}

//This funciton queries the database every 7 seconds to see how many current users are connected
window.setInterval(function() {
	$.ajax({
		type: 'GET',
		url: '/currentUsers',
		success: function(output) {
			//Displays the number of users on the web page
			$('#numOfUsers').html("Number of users: "+output[1]);
			//
		}
	})
}, 7000);

$(document).ready(function() {
	
	//When the submitId button is clicked this will execute
	$("#submitID").click(function() {
		//Turns you cursor into a loading circle
		$(document).ajaxStart(function() {
          	$(document.body).css({'cursor' : 'wait'});
        });
        //Clears the current informaiton that is shown on the webpage
		$('#friendsTable').html("");
		var counter = 0;
		var steamId = $('#steamID').val();
		//Calls the steam API to get a list of your friends steamid
		$.ajax({
			type: 'GET',
			url: '/mainPage/',
			data: {id: steamId},
			success: function(output) {
				//The data that is returned contains a list of steamId's
				var json = JSON.parse(output);
				console.log(json);
				
				
				//For every steamId in the list I will do an ajax call to get more deatiled infomration relating to that id
				for(var i = 0; i< json.friendslist.friends.length; i++) {
					//Makes a request to steam by providing an id and in return gets the users information
					$.ajax({
						type: 'GET',
						url: '/mainPage/userInfo',
						data: {id: json.friendslist.friends[i].steamid},
						success: function(output2) {
							//Here is were I start writing html code which will create a table dynamically with all the users friends information
							var htmlCode = "";
							counter++;
							var json2 = JSON.parse(output2)
							//Saves the users display picture
							var pic = json2.response.players[0].avatarfull;
							console.log(json2);
							htmlCode= htmlCode + "<tr style='background-color: #000000;'><td><img src="+pic+"height='100' width='100'/></td>";
							htmlCode = htmlCode + "<td style='color: white' id=user"+counter+"> Users Steam Name: "+json2.response.players[0].personaname+"<br>User's Steam ID: "+json2.response.players[0].steamid+"</td></tr>"
							//Append the code to the table 
							$('#friendsTable').append(htmlCode);
							if(counter >= json.friendslist.friends.length) {
								//If all friends information has been gathered change the mouse cursor back to normal
								 $(document).ajaxStop(function() {
                     				 $(document.body).css({'cursor' : 'default'});
                   				 });
							}
						}
					})
				}
				
				
			}
		});
	})

	//If the user clicks the game button
	$("#submitIdGame").click(function() {

		//Mostly the same code as mentioned above with the execption to the ajax calls
		$(document).ajaxStart(function() {
          	$(document.body).css({'cursor' : 'wait'});
        });
        $('#gameTable').html("");
		var steamIdGame = $('#steamIdGame').val();
		var count = 0;

		//Passes in a steamID and gets a list of games that user owns back
		$.ajax({
			type: 'GET',
			url: '/mainPage/gameLib',
			data: {id: steamIdGame},
			success: function(output) {
				var json = JSON.parse(output);
				console.log(json);
				//Creates a dynamic table based off the number of games the user owns
				for(var i =0; i <json.response.games.length; i++) {
					count++;
					//Retrieves the picture of the game by useing the appid and img url
					var pic = "http://media.steampowered.com/steamcommunity/public/images/apps/"+json.response.games[i].appid+"/"+json.response.games[i].img_logo_url+".jpg";
					var htmlCode = "";
					//Display game info in the table 
					htmlCode = htmlCode+"<tr style='background-color: #000000;'><td><img src="+pic+" height='100' width='100'/></td>";
					htmlCode = htmlCode + "<td style='color: white'> Game Name: "+json.response.games[i].name+"<br>Play Time in minutes: "+json.response.games[i].playtime_forever+"</td></tr>";
					//Adds the html code to the table
					$('#gameTable').append(htmlCode);
					if(count >= json.response.games.length) {
						$(document).ajaxStop(function() {
                     		$(document.body).css({'cursor' : 'default'});
                   		});
					}
				} 
			}
		})
	})


	//When the recent button is clicked
	$("#submitIdRecent").click(function() {
		//Very similar to the calls listed above
		var steamIdRecent = $('#steamIdRecent').val();
		var count = 0;
		$('#recentTable').html("");

		//Calls the steam API with the id and in return you will get a list of games the user recently played (2 Weeks)
		$.ajax({
			type: 'GET',
			url: '/mainPage/recentGame',
			data: {id: steamIdRecent},
			success: function(output) {
				var json = JSON.parse(output);
				console.log(json);
				//Creates a table based of the number of recently played games
				for(var i = 0; i < json.response.games.length; i++) {
					//Code here is all the exact same as the game section listed above
					count++;
					var pic = "http://media.steampowered.com/steamcommunity/public/images/apps/"+json.response.games[i].appid+"/"+json.response.games[i].img_logo_url+".jpg";
					var htmlCode ="";
					htmlCode = htmlCode+"<tr style='background-color: #000000;'><td><img src="+pic+" height='100' width='100'/></td>";
					htmlCode = htmlCode + "<td style='color: white'> Game Name: "+json.response.games[i].name+"<br>Play Time in the last two weeks: "+json.response.games[i].playtime_2weeks+"<br>Play Time in minutes: "+json.response.games[i].playtime_forever+"</td></tr>";
					$('#recentTable').append(htmlCode);
					if(count >= json.response.games.length) {
						$(document).ajaxStop(function() {
                     		$(document.body).css({'cursor' : 'default'});
                   		});
					}
				}
			}
		})
	})

});
