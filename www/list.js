$(document).ready(() => {
	$.ajax("http://localhost:8080/list/getCompetitions", {
		success: (data) => {
			for (const competition of data) {
				$('#listByCompetitions').append(
					$('<li>').attr('class','list-group-item bg-primary').append(
						$('<a href>')
							.attr({
								'class': 'competition-item text-white',
								'id': competition._id
							}).append(
							`${competition.competition}, ${competition.location}`
						)
					)
				);
			}
		}
	});
	$.ajax("http://localhost:8080/list/getDances", {
		success: (data) => {
			for (const competition of data) {
				$('#listByDance').append(
					$('<li>').attr('class','list-group-item bg-primary').append(
						$('<a href>')
							.attr({
								'class': 'competition-item text-white',
								'id': competition._id
							}).append(
							`${competition.dance}`
						)
					)
				);
			}
		}
	});

		// $.ajax("http://localhost:8080/list/getDances", {
		// 	success: (data) => {
		// 		for (const competition of data) {
		// 			$('#listByDance').append(
		// 				$('<li>').attr('class','list-group-item bg-primary').append(
		// 					$('<a href>')
		// 						.attr({
		// 							'class': 'competition-item text-white',
		// 							'id': competition._id
		// 						}).append(
		// 						`${competition.routine.id}, ${competition.location}`
		// 					)
		// 				)
		// 			);
		// 		}
		// 	}
		// });

	$('#listByCompetitions').on('click','.competition-item', (e) => {
		e.preventDefault();
		$.ajax("http://localhost:8080/list/getRoutines?id=" + e.target.id, {
			success: (data) => {
				$('#listByCompetitions').html('');
				for (const routine of data) {
					$('#listByCompetitions').append(
						$('<li>').attr('class','list-group-item bg-primary').append(
							$(`<a href="../judge?id=${routine.id}">`)
								.attr('class', 'text-white')
								.append(
								`${routine.dance}, ${routine.name}`
							)
						)
					);
				}
			}
		});
	})
	$('#listByDance').on('click', '.competition-item', (e) => {
		e.preventDefault();
		$.ajax("http://localhost:8080/list/getRoutines?id=" + e.target.id, {
			success: (data) => {
				$('#listByDance').html('');
				for (const routine of data) {
					$('#listByDance').append(
						$('<li>').attr('class','list-group-item bg-primary').append(
							$(`<a href="../judge?id=${routine.id}">`)
								.attr('class', 'text-white')
								.append(
								`${routine.dance}, ${routine.name}`
							)
						)
					);
				}
			}
		});
	})
})
