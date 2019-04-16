let id;
let gameInstance;
$(document).ready(() => {
	id = window.location.search.split('=')[1];
	const uploadType = sessionStorage.getItem("upload_type");

	$('#new-comment-score').on('input change', function(e) {
		$('#score-span').html($(this).val());
	})
	
	$.ajax(`http://localhost:8080/judge/getInfo/${id}.${uploadType}`, {
		success: (data) => {
			$('#name').html(data.routine.name);
			$('#dance').html(data.routine.dance);
			$('#competition').html(data.competition);
			$('#location').html(data.location);
			console.log(data)
			if (uploadType == "video") {
				$('.video-div').html(`<video id="video" src="${data.routine.id}.mp4" width='700px' controls></video>`)
				
			} else {
				$('.video-div').append("div").attr({
					id: "gameContainer",
				}).css({
					width: "700px",
					height: "500px",
				})
				gameInstance = UnityLoader.instantiate("gameContainer", "Build/web build.json", {onProgress: (game, progress) => {
					if(progress == 1) {
						gameInstance.SendMessage("EventSystem", "startPlaybackFromWeb", id);
					}
				}});
			}
			refreshRatings(data.routine.results);
		}
	});
})

function refreshRatings(results) {
	for (const result of results) {
		$('#results-list').append(
			$('<li>').attr('class','list-group-item').append(
				$('<div>').attr('class', 'container').append(
					$('<div>').attr('class', 'row').append(
						$('<div>').attr('class', 'col-2').append(
							`<h1>${result.rating}</h1>`
						)
					).append(
						$('<div>').attr('class', 'col-10').append(
							`<p>${result.comment}</p><p class='comment-author'>${result.name}</p>`
						)
					)
				)
			)
		);
	}
}

$('#add-comment-button').click((e) => {
	addResult(id, parseFloat($('#new-comment-score').val()), $('#new-comment-text').val(), $('#new-comment-name').val());
})

function addResult(id, rating, comment, name) {
	let uploadType = sessionStorage.getItem("upload_type");
	$.post({
		url: 'http://localhost:8080/judge/addResult/'+uploadType,
		data: JSON.stringify({id,rating,comment,name}),
		contentType: 'application/json',
		success: (d) => location.reload()
	});
}