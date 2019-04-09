$(document).ready(() => {
	$.ajax("http://localhost:8080/list/getCompetitions", {
		success: (data) => {
			if (data === "No documents found.") {
				return;
			}
			for (const competition of data) {
				console.log(data);
				$('#listByCompetitions').append(
					$('<li>').attr('class', 'list-group-item bg-primary').append(
						$(`<a href="list/comp/${competition.competition_id}">`)
						.attr('class', 'text-white').append(
							`${competition.competition}, ${competition.location}`
						)
					)
				);
			}
		}
	});

	$('#listByCompetitions').on('click', '.competition-item', (e) => {
		e.preventDefault();
		$.ajax("http://localhost:8080/list/getRoutines?id=" + e.target.id, {
			success: (data) => {
				$('#listByCompetitions').html('');
				for (const routine of data) {
					$('#listByCompetitions').append(
						$('<li>').attr('class', 'list-group-item bg-primary').append(
							$(`<a href="../judge?id=${routine.id}">`)
							.attr('class', 'text-white')
							.append(
								`${routine.dance}`
							)
						)
					);
				}
			}
		});
	})
})