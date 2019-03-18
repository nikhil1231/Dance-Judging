let id;

$(document).ready(() => {
	id = window.location.search.split('=')[1];
	$.ajax("http://localhost:8080/judge/getInfo?id=" + id, {
		success: (data) => {
			$('#competition').html(data.competition);
			$('#location').html(data.location);
			$('#video').attr('src', `${data.routine.id}.mp4`);
			refreshRatings(data.routine.results);
		}
	});
})

function refreshRatings(results) {
	for (const result of results) {
		$('#results-list').append(
			$('<li>').attr('class','list-group-item bg-primary').append(
				`Rating: ${result.rating}, Comment: ${result.comment}`
			)
		);
	}
}

$('#addResult').click((e) => {
	addResult(id, $('#rating').val(), $('#comment').val());
})

function addResult(id, rating, comment) {
	$.post({
		url: 'http://localhost:8080/judge/addResult',
		data: JSON.stringify({id,rating,comment}),
		contentType: 'application/json',
		success: (d) => location.reload()
	});
}