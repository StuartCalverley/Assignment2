function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    	console.log('User signed out.');
    	console.log(sessionStorage.getItem("email"));
    	$.ajax({
    		type: 'GET',
    		url: '/logout',
    		data: {email: sessionStorage.getItem("email")},
    		success: function(output) {
    			sessionStorage.setItem("email", "");
    			window.location.href="/";

    		}
    	})
    });
}


/*window.setInterval(function() {
	$.ajax({
		type: 'GET',
		url: '/mainPage/currentUsers',
		success: function(output) {
			$('#numOfUsers').html(output);
			//
		}
	})
}, 7000);*/

$(document).ready(function() {
	
	
	$("#submitID").click(function() {
		$(document).ajaxStart(function() {
          	$(document.body).css({'cursor' : 'wait'});
        });
		$('#friendsTable').html("");
		var counter = 0;
		var steamId = $('#steamID').val();
		$.ajax({
			type: 'GET',
			url: '/mainPage/',
			data: {id: steamId},
			success: function(output) {
				var json = JSON.parse(output);
				console.log(json);
				
				
				
				for(var i = 0; i< json.friendslist.friends.length; i++) {
					
					$.ajax({
						type: 'GET',
						url: '/mainPage/userInfo',
						data: {id: json.friendslist.friends[i].steamid},
						success: function(output2) {
							var htmlCode = "";
							counter++;
							var json2 = JSON.parse(output2)
							var pic = json2.response.players[0].avatarfull;
							console.log(json2);
							htmlCode= htmlCode + "<tr style='background-color: #000000;'><td><img src="+pic+"height='100' width='100'/></td>";
							htmlCode = htmlCode + "<td style='color: white' id=user"+counter+"> Users Steam Name: "+json2.response.players[0].personaname+"<br>User's Steam ID: "+json2.response.players[0].steamid+"</td></tr>"
							$('#friendsTable').append(htmlCode);
							if(counter >= json.friendslist.friends.length) {
								
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

	$("#submitIdGame").click(function() {
		$(document).ajaxStart(function() {
          	$(document.body).css({'cursor' : 'wait'});
        });
        $('#gameTable').html("");
		var steamIdGame = $('#steamIdGame').val();
		var count = 0;
		$.ajax({
			type: 'GET',
			url: '/mainPage/gameLib',
			data: {id: steamIdGame},
			success: function(output) {
				var json = JSON.parse(output);
				console.log(json);

				for(var i =0; i <json.response.games.length; i++) {
					count++;
					var pic = "http://media.steampowered.com/steamcommunity/public/images/apps/"+json.response.games[i].appid+"/"+json.response.games[i].img_logo_url+".jpg";
					var htmlCode = "";
					htmlCode = htmlCode+"<tr style='background-color: #000000;'><td><img src="+pic+" height='100' width='100'/></td>";
					htmlCode = htmlCode + "<td style='color: white'> Game Name: "+json.response.games[i].name+"<br>Play Time in minutes: "+json.response.games[i].playtime_forever+"</td></tr>";
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


	$("#submitIdRecent").click(function() {
		var steamIdRecent = $('#steamIdRecent').val();
		var count = 0;
		$.ajax({
			type: 'GET',
			url: '/mainPage/recentGame',
			data: {id: steamIdRecent},
			success: function(output) {
				var json = JSON.parse(output);
				console.log(json);
				for(var i = 0; i < json.response.games.length; i++) {
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
