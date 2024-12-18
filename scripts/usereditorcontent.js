function triggerMouseEvent (element, eventType) {
  const clickEvent = new MouseEvent(eventType, { bubbles: true, cancelable: true });
  element.dispatchEvent (clickEvent);
}

function simulateClick(element) {
  if (element) {
      //--- Simulate a natural mouse-click sequence.
      triggerMouseEvent (element, "mouseover");
      triggerMouseEvent (element, "mousedown");
      triggerMouseEvent (element, "mouseup");
      triggerMouseEvent (element, "click");
  }
  else {
      console.log ("Element not found");
  }
}

function parseTitle(title) {
  let splitTitle = title.split('(');
  let name = splitTitle[0].trim();
  let period = "";
  if (splitTitle[1]) {
    period = splitTitle[1].replaceAll(')', '');
  }
  return { name, period };
}

function schoolMatch (school, name) {
  let index = school.schoolName.indexOf(name);
  let returnValue = false;
  if (index >= 0) {
    if (index != 0) {
      if (school.schoolName.charAt(index - 1) != " ") {
        index = -1;
      }
    }
    if ((index + name.length) < school.schoolName.length) {
      if (school.schoolName.charAt(index + name.length) != " ") {
        index = -1;
      }
    }
  }
  returnValue = index >= 0;
  for (let i = 0; i < school.alias.length; i++) {
    index = school.alias[i].indexOf(name);
    if (index >= 0) {
      if (index != 0) {
        if (school.alias[i].charAt(index - 1) != " ") {
          index = -1;
        }
      }
      if ((index + name.length) < school.alias[i].length) {
        if (school.alias[i].charAt(index + name.length) != " ") {
          index = -1;
        }
      }
    }
    if (index >= 0) returnValue = true;
  }
  return returnValue;
}

function isInSchoolList(schools, name) {
  let returnValue = -1;
  for (let i = 0; i < schools.length; i++) {
    if (schoolMatch(schools[i], name)) {
      returnValue = i;
    }
  }
  return returnValue;
}

function addCalendar(schools, future, previous) {
  const mainDoc = document.getElementById("main-workspace");
  const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
  let success = new Array(schools.length);
  //query added - 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'
  //query not added - 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
  const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
  for (let i = 0; i < roles.length; i++) {
    let title = roles[i].textContent;
    let parsedTitle = parseTitle(title);
    let inSchoolList = isInSchoolList(schools, parsedTitle.name);
    if (inSchoolList >= 0) {
      success[inSchoolList] = true;
      if (future && parseTitle.period == "future") {
        simulateClick(roles[i]);
      } else if (previous && parseTitle.period == "previous") {
        simulateClick(roles[i]);
      } else if (parsedTitle.period == "") {
        simulateClick(roles[i]);
      }
    }
  }
  let failed = [];
  for (let i = 0; i < schools.length; i++) {
    if (!success[i]) {
      failed.push(schools[i]);
    }
  }
  if (failed.length > 0) {
    let msg = "";
    for (let i = 0; i < failed.length; i++) {
      msg += `${failed[i].schoolName}\n`
    }
    console.log(msg);
    alert(`Failed to find schools: \n\n${msg}`);
  } else {
    alert("Completed adding all calendars.");
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.oper == "addCalendar") {
      addCalendar(request.schools, request.future, request.previous);
    }
  }
);
