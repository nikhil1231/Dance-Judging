$(document).ready(() => {
	let uploadType = sessionStorage.getItem("upload_type");
	$.ajax(`http://localhost:8080/list/getCompetitions/${uploadType}`, {
		success: (data) => {
			console.log(data);
			if (data === "No documents found.") {
				return;
			}
			for (const competition of data.result) {

				$('#listByCompetitions').append(
					$('<li>').attr('class','list-group-item').append(
						`<a href="list/comp/${competition.competition_id}.${uploadType}"><h4>${competition.competition}</h4> <p>${competition.location}</p></a>`
					)
				);
			}

			initMap(data.competitions_locations);
		}
	});

	function initMap(comp_locs) {
		//- map options
		var options = {
			zoom:2,
			center:{lat:25, lng:0}
		}
		//- new map
		var map = new google.maps.Map(document.getElementById('map'), options);
		// console.log("check: " + comp_locs);
		for (const location of comp_locs) {
			console.log(location)
			addMarker({
				coords:{lat:location.latitude, lng: location.longitude},
				content:'<a href="#">CompName</a>'
			});
			// //- Add marker
			// var marker = new google.maps.Marker({
			// 	position:{lat:location.latitude, lng: location.longitude},
			// 	map:map
			// });
			// var infoWindow = new google.maps.InfoWindow({
			// 	content:`<a href="">${location.latitude}</a>`
			// });
	
			// marker.addListener('click', function(){
			// 	infoWindow.open(map, marker);
			// });

			//Add Marker Function
			
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