function save_options() {
  var secondsToWait = document.getElementById('secondsToWait').value;
  var timer = document.getElementById('timer').checked;
  var disappear = document.getElementById('disappear').checked;
  chrome.storage.sync.set({
    secondsToWait: secondsToWait,
    timer: timer,
    disappear: disappear
  }, function() {
    var status = document.getElementById('status');
    status.style.visibility = "visible";
    setTimeout(function() {
      status.style.visibility = "hidden";
    }, 800);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    secondsToWait: 20,
    timer: true,
    disappear: false
  }, function(items) {
    document.getElementById('timer').checked = items.timer;
    document.getElementById('secondsToWait').value = items.secondsToWait;
    document.getElementById('disappear').checked = items.disappear;
    timer_change();
  });
}

function timer_change() {
  var timer = document.getElementById('timer').checked;
  if (timer) {
      document.getElementById('secondsToWaitLabel').style.visibility = "visible";
      document.getElementById('disappearLabel').style.visibility = "visible";
  }
  else {
    document.getElementById('secondsToWaitLabel').style.visibility = "hidden";
    document.getElementById('disappearLabel').style.visibility = "hidden";
  }
}

document.getElementById('status').src = chrome.extension.getURL("images/greenTick.png");
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
document.getElementById('timer').addEventListener('change',timer_change);