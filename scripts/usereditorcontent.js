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
  let returnValue = school.schoolName.includes(name);
  for (let i = 0; i < school.alias.length; i++) {
    if (school.alias[i].includes(name)) {
      returnValue = true;
    }
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

/*
Closed Halau Lokahi - PCS
Connections - PCS
Hakipuu Academy - PCS
Halau Ku Mana - PCS
Hana High & Elem School
Hawaii Technology Academy-PCS
HI Academy of Arts & Sci - PCS
HI School for the Deaf & Blind
Honokaa High & Inter School
Ka Umeke Kaeo - PCS
Ka Waihona O Ka Naauao-PCS
Kahuku High & Inter School
Kamaile Academy - PCS
Kamalani Academy - PCS
Kanu O Ka Aina - PCS
Kaohao Public Charter School - PCS
Kapolei Charter School - PCS
Kau Learning Academy
Kawaikini - PCS
Ke Ana Laahana - PCS
Ke Kula Niihau O Kekaha - LPCS
Ke Kula O Nawahiokalaniopuu Iki - PCS
Kona Pacific - PCS
Kua O Ka La - NCPCS
Kualapuu Elem School - PCS
Kula Aupuni Niihau - PCS
Kulia Academy - PCS
Laupahoehoe Community - PCS
Malama Honua - PCS
Na Wai Ola - PCS
Nanakuli High & Inter School
Olomana School
Pahoa High & Inter School
Parkway Village Preschool - PCS
Pearl City High School
School Closed Jefferson Ortho
School Closed Liliuokalani
School Closed Wailupe
SEEQS - PCS
Volcano School of Arts & Sci - PCS
Voyager - PCS
Waialae Elem School - PCS
Waialua High & Inter School
Waimea Canyon School
Waimea Middle School- PCS
West Hawaii Explorations -PCS
*/