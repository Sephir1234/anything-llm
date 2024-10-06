document.getElementById('searchBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: searchLinkedIn
    });
  });
});

function searchLinkedIn() {
  console.log('Searching LinkedIn...');
  // Add code to interact with the LinkedIn page
}
