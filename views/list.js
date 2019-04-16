$(document).ready(() => {
	let uploadType = sessionStorage.getItem("upload_type");
	$.ajax(`http://localhost:8080/list/getCompetitions/${uploadType}`, {
		success: (data) => {
			if (data === "No documents found.") {
				return;
			}
			for (const competition of data) {
				console.log(data);
				// $('#listByCompetitions').append(
				// 	$('<li>').attr('class', 'list-group-item bg-primary').append(
				// 		$(`<a href="list/comp/${competition.competition_id}.${uploadType}">`)
				// 		.attr('class', 'text-white').append(
				// 			`${competition.competition}, ${competition.location}`
				// 		)
				// 	)
				// );

				$('#listByCompetitions').append(
					$('<li>').attr('class','list-group-item').append(
						`<a href="list/comp/${competition.competition_id}.${uploadType}"><h4>${competition.competition}</h4> <p>${competition.location}</p></a>`
					)
				);
			}
		}
	});

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