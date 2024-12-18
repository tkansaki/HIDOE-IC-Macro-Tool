function triggerMouseEvent (element, eventType) {
  let clickEvent = new MouseEvent(eventType, { bubbles: true, cancelable: true });
  element.dispatchEvent (clickEvent);
}

function simulateClick(element) {
  if (element) {
      //--- Simulate a natural mouse-click sequence.
      triggerMouseEvent (targetNode, "mouseover");
      triggerMouseEvent (targetNode, "mousedown");
      triggerMouseEvent (targetNode, "mouseup");
      triggerMouseEvent (targetNode, "click");
  }
  else {
      console.log ("Element not found");
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.oper == "addCalendar") {
      let mainDoc = document.getElementById("main-workspace");
      let innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      console.log(innerDoc.querySelectorAll('[role="row"]')[3]);
      


    }
  }
);