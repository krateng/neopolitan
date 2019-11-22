// functions that are automatically assined based on html attributes





document.addEventListener('DOMContentLoaded', function() {

	/* SEEKABLE */
	var elements = document.getElementsByClassName("seekable");
	for (var i=0;i<elements.length;i++) {

		elements[i].addEventListener("click",function(evt) {
			var elmnt = evt.currentTarget;
			var percentage = evt.offsetX / elmnt.offsetWidth;
			percentage = Math.max(0,Math.min(100,percentage));
			elmnt.firstElementChild.style.width = (percentage * 100) + "%";
			var callback = elmnt.getAttribute("data-seekcallback");
			window[callback](percentage);
		})
	}

	var elements = document.getElementsByClassName("scrollseekable");
	for (var i=0;i<elements.length;i++) {

		elements[i].addEventListener("wheel",function(evt) {
			var elmnt = evt.currentTarget;
			//elmnt = this;
			var currentPercentage = elmnt.firstElementChild.offsetWidth / elmnt.offsetWidth;
			var sensitivity = elmnt.getAttribute("data-scrollsensitivity");
			var percentage = currentPercentage - evt.deltaY*sensitivity/1000;
			percentage = Math.max(0,Math.min(1,percentage));
			elmnt.firstElementChild.style.width = (percentage * 100) + "%";
			var callback = elmnt.getAttribute("data-seekcallback");
			window[callback](percentage);
		})
	}

	/* AUTO UPDATE */
	var elements2 = document.getElementsByClassName("update");
	var functions = []
	for (var i=0;i<elements2.length;i++) {
		updatefunc = elements2[i].getAttribute("data-updatefrom");
		functions.push([elements2[i],updatefunc])
	}


	const SMOOTH_UPDATE = true;
	const update_delay = SMOOTH_UPDATE ? 40 : 500;

	function supervisor() {
		for (let entry of functions) {
			var [element, func] = entry
			window[func](element); //call function on that element
		}
		setTimeout(supervisor,update_delay);
	}

	if (functions.length > 0) {
		supervisor();
	}


	/* LINK INTERCEPT */

	var body = document.getElementsByTagName("BODY")[0]
	if (body.getAttribute("data-linkinterceptor") != undefined) {
		var interceptor = eval(body.getAttribute("data-linkinterceptor"));

		function interceptClickEvent(e) {
		    var href;
		    var target = e.target || e.srcElement;

		    if (target.tagName === 'A' && !target.classList.contains("no-intercept")) {
		        href = target.getAttribute('href');


				e.preventDefault();
				history.pushState({},"",href);
				interceptor();
		    }
		}

		document.addEventListener('click', interceptClickEvent);
	}


}, false);



/* HOTKEYS */

document.addEventListener('keyup', function(evt) {

	if (evt.srcElement.tagName == "INPUT") { return; }

	var elements = document.querySelectorAll('[data-hotkey]');
	for (let e of elements) {
		if (e.getAttribute("data-hotkey") == evt.code) {
			evt.preventDefault();
			e.onclick();
			break;
		}
	}

}, false);
