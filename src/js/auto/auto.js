// functions that are automatically assined based on html attributes





document.addEventListener('DOMContentLoaded', function() {

	/* SEEKABLE */
	var elements = document.getElementsByClassName("seekable");
	for (var i=0;i<elements.length;i++) {
		callback = elements[i].getAttribute("data-seekcallback");
		elements[i].addEventListener("click",function(evt) {
			elmnt = evt.currentTarget;
			var percentage = evt.offsetX / elmnt.offsetWidth;
			elmnt.firstElementChild.style.width = (percentage * 100) + "%";
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
