function goToOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('html/options.html'));
  }
}

document.getElementById('go-to-options').addEventListener('click', goToOptions);