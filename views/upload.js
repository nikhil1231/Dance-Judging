$(document).ready(() => {
	if(sessionStorage.getItem('upload_type') == 'kinect') {
		$(".h1-5").html('Upload JSON');
		$("#choose-file-button-text").html('Choose JSON');
		$("#choose-file-input").attr({'accept': 'application/json'});
	}
})