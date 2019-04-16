$(document).ready(() => {
	let uploadType = sessionStorage.getItem("upload_type");
	$.ajax(`http://localhost:8080/list/getCompetitions/${uploadType}`, {
		success: (data) => {
			if (data === "No documents found.") {
				return;
			}
			for (const competition of data) {

				$('#listByCompetitions').append(
					$('<li>').attr('class','list-group-item').append(
						`<a href="list/comp/${competition.competition_id}.${uploadType}"><h4>${competition.competition}</h4> <p>${competition.location}</p></a>`
					)
				);
			}

			initMap(data);
		}
	});

	function initMap(data) {
		//- map options
		var options = {
			zoom:2,
			center:{lat:25, lng:0}
		}
		//- new map
		var map = new google.maps.Map(document.getElementById('map'), options);
		// console.log("check: " + data);
		for (const competition of data) {
			console.log(competition)
			addMarker({
				coords:{lat:competition.latitude, lng: competition.longitude},
				content:`<a href="list/comp/${competition.competition_id}.${uploadType}">${competition.competition}</a>`
			});
		}
		function addMarker(props) {
			var marker = new google.maps.Marker({
					position:props.coords,
					map:map
				});
			var infoWindow = new google.maps.InfoWindow({
				content:props.content

			});
			marker.addListener('click', function(){
				infoWindow.open(map, marker);
			});
		}

	}
	// $('#listByCompetitions').on('click', '.competition-item', (e) => {
	// 	e.preventDefault();
	// 	let uploadType = sessionStorage.getItem("upload_type");
	// 	$.ajax(`http://localhost:8080/list/getRoutines/${e.target.id}.${uploadType}`, {
	// 		success: (data) => {
	// 			$('#listByCompetitions').html('');
	// 			for (const routine of data) {
	// 				$('#listByCompetitions').append(
	// 					$('<li>').attr('class', 'list-group-item bg-primary').append(
	// 						$(`<a href="../judge?id=${routine.id}">`)
	// 						.attr('class', 'text-white')
	// 						.append(
	// 							`${routine.dance}`
	// 						)
	// 					)
	// 				);
	// 			}
	// 		}
	// 	});
	// })
})