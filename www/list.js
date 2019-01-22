$(document).ready(() => {
	$.ajax("http://localhost:8080/list/getCompetitions", {
		success: (data) => {
			for (const competition of data) {
				$('#list').append(
					$('<li>').append(
						$('<a href>')
							.attr({
								'class': 'competition-item',
								'id': competition._id
							}).append(
							`${competition.competition}, ${competition.location}`
						)
					)
				);
			}
		}
	});

	$('ul').on('click', '.competition-item', (e) => {
		e.preventDefault();
		$.ajax("http://localhost:8080/list/getRoutines?id=" + e.target.id, {
			success: (data) => {
				$('#list').html('');
				console.log(data)
				for (const routine of data) {
					$('#list').append(
						$('<li>').append(
							$(`<a href="../judge?id=${routine.id}">`)
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