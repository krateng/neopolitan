
function dragover(evt) {
    	evt.preventDefault();
}



function readImageFile(evt,crop=false) {
	evt.preventDefault();

	var element  = this;

	var file = evt.dataTransfer.files[0];
	var reader = new FileReader();
	reader.onload = (function(evt) {
		//return parseFile(reader.result);
		parseImage(reader.result,element,crop);
	});


	reader.readAsArrayBuffer(file);
}

function parseImage(buffer,element,crop) {

	// credit to stackoverflow user mobz for this
	var binary = '';
    	var bytes = new Uint8Array(buffer);
    	var len = bytes.byteLength;
    	for (var i = 0; i < len; i++) {
        	binary += String.fromCharCode(bytes[ i ]);
    	}
    	b64 = window.btoa(binary);

	cropImage(b64,element,crop)

	//document.getElementById("picture_create").style.backgroundImage = "url('data:img/jpg;base64," + b64 + "')";
}

// crops and places in dom because I'm too lazy to remember how promises work
function cropImage(b64,element,crop) {

	var img = new Image;
	img.src = "data:image/png;base64," + b64;
	img.onload = function() {

		if (crop) {
			//var SIZE = 512;
			x = element.offsetWidth;
			y = element.offsetHeight;

			// create an off-screen canvas
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d');


			// check sizes
			wid = img.width;
			heig = img.height;
			wid_resize = x/wid;
			heig_resize = y/heig;
			resize = Math.max(wid_resize,heig_resize);

			use_wid = x / resize;
			use_heig = y / resize;

			new_wid = wid * resize;
			new_heig = heig * resize;

			// how much to remove (in terms of the original size)
			crop_left = (new_wid - x) / (2 * resize);
			crop_top = (new_heig - y) / (2 * resize);

			// set dimension to target size
			canvas.width = x;
			canvas.height = y;

			// draw source image into the off-screen canvas:
			ctx.drawImage(img, crop_left, crop_top, use_wid, use_heig, 0, 0, x, y);

			// encode image to data-uri with base64 version of compressed image
			done = canvas.toDataURL();
		}
		else {
			// still doing the canvas thing so we have a png
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img,0,0);
			done = canvas.toDataURL();

		}
		element.style.backgroundImage = "url('" + done + "')";

		var callback = element.getAttribute("data-uploader");
		if (callback != undefined) {
			eval(callback)(done);
		}

	}


}


document.addEventListener('DOMContentLoaded', function() {
	var elements = document.getElementsByClassName("changeable-image");
	for (var i=0;i<elements.length;i++) {
		elements[i].ondragover = dragover;
		elements[i].ondrop = readImageFile;
	}
})
