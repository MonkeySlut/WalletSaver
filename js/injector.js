function startDrag(e) {
	// determine event object
    if (!e) {
        var e = window.event;
	}

    if(e.preventDefault) {
        e.preventDefault();
    } 

	targ = e.target;

	// calculate event X, Y coordinates
	offsetX = e.clientX;
	offsetY = e.clientY;

	// assign default values for top and left properties
    if(!targ.style.left) {
        targ.style.left='0px';
    }

	if(!targ.style.top) {
        targ.style.top='0px';
    }

	// calculate integer values for top and left 
	// properties
	coordX = parseInt(targ.style.left);
	coordY = parseInt(targ.style.top);
	drag = true;

	// move div element
	document.onmousemove=dragDiv;
    return false;		
}

function dragDiv(e) {
    if (!drag) {
        return;
    }

    if (!e) {
         var e= window.event;
    }

    // var targ=e.target?e.target:e.srcElement;
    // move div element
    targ.style.left=coordX+e.clientX-offsetX+'px';
    targ.style.top=coordY+e.clientY-offsetY+'px';

    closeButton.style.left=coordX+e.clientX-offsetX+'px';
    closeButton.style.top=coordY+e.clientY-offsetY+'px';

    return false;
}

function stopDrag() {
    drag=false;
}

function countdown(terryContainer, seconds, shouldDisappear) {
    var endTime, hours, mins, msLeft, time;
    var countdownElement = terryContainer.querySelector('#terryImageCountdownId');
    var imageElement = terryContainer.querySelector('#terryImageId');
    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);
        if (msLeft < 1000) {
            countdownElement.innerHTML = "";
            if (shouldDisappear) {
    			imageElement.style.visibility = "hidden";
            } else {
                closeButton.style.visibility = "visible";
                allowDragAndClose(imageElement);
            }
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            countdownElement.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    endTime = (+new Date) + 1000 * seconds + 500;
    updateTimer();
}

function createTerryImage() {
    var terryImage = document.createElement('img');
    terryImage.src = chrome.extension.getURL("images/terry.jpg");
    terryImage.id = "terryImageId";
    return terryImage;
}

function createCountdown() {
    var visualCountdown = document.createElement("div");
    visualCountdown.id = "terryImageCountdownId";
    return visualCountdown;
}

function allowDragAndClose(element) {
    element.style.cursor = "move";
    element.onmousedown = startDrag;
    element.onmouseup = stopDrag;
}

var terryContainer,terryImageHolder, coundownHolder;
terryContainer = document.createElement("div");
terryContainer.className = "walletSaver"
chrome.storage.sync.get({
    secondsToWait: 20,
    timer: true,
    disappear: false
  }, function(items) {
        terryImageHolder = createTerryImage();
        terryContainer.appendChild(terryImageHolder);
        $("#mainContent").prepend(terryContainer);

        if (!(items.disappear && items.timer)) {
            closeButton = document.createElement("div");
            closeButton.appendChild(document.createTextNode("x"));
            closeButton.id = "closeButtonId";
            closeButton.onclick = function () {
                terryImageHolder.style.visibility = "hidden";
                this.style.visibility = "hidden";
            };
            terryContainer.appendChild(closeButton);
        }
      
        if (items.timer) {
            coundownHolder = createCountdown();
            terryContainer.appendChild(coundownHolder);

            countdown(terryContainer, items.secondsToWait, items.disappear);
        } else {
            //allow image to move
            closeButton.style.visibility = "visible";
            allowDragAndClose(terryImageHolder);
        }
  });