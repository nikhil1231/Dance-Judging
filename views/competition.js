$(document).ready(() => {
	$('#listByDances').on('click', '.competition-item', (e) => {
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