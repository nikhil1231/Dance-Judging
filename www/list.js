$(document).ready(() => {
	$.ajax("http://localhost:8080/list/getCompetitions", {
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
								`${routine.competition}, ${routine.location}`
							)
						)
					);
				}
			}
		});
	})
})
