let native_alert = alert;
let addFailed = false;

alert = function(msg) {
  if (msg.includes("schoolID is required")) {
    addFailed = true;
    console.log(`Alert Called: ${msg}`);
  } else {
    native_alert(msg);  
  }
}

function getCookieByName(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

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

function waitForFormLoad(values, resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;

      for (const [key, value] of Object.entries(values)) {
        if(!innerDoc5.getElementById(key)) {
          throw new Error(`Field '${key}' not loaded`);
        }
      }
      clearTimeout(timer);
      resolve();
    } catch (e){
      console.log(e);
    }
  }, 100);
}

function waitForSchoolPopulate(resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;
      if (innerDoc5.getElementById('schoolID')) { 
        let currentSchool = getCookieByName("schoolID");
        if (innerDoc5.getElementById('schoolID').value == currentSchool && currentSchool != 0) {
          clearTimeout(timer);
          resolve();
        } else if (innerDoc5.getElementById('schoolID').selectedIndex == -1 && currentSchool == 0) {
          clearTimeout(timer);
          resolve();
        }
      }
    } catch (e){
      console.log("Error on waitForSchoolPopulate", e);
    }
  }, 100);
}

function pressNew(resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceHeader');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;

      if(innerDoc4) {
        let tempNew = innerDoc4.getElementById('tempNew');
        if (!tempNew) {
          innerDoc4.getElementById('actionbarDiv').innerHTML += "<input id='tempNew' style='display: none;' onkeydown='(function(){const tempNew = document.getElementById(\"tempNew\");try{tempNew.dataset.state = \"1\";staffWizard(self);tempNew.dataset.state = \"2\";}catch(e){tempNew.dataset.state = \"0\";}} )()' data-state='0'  />";
          tempNew = innerDoc4.getElementById('tempNew');
        }
        if (tempNew.dataset.state == "0") {
          tempNew.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
        }

        if (tempNew.dataset.state == "2") {
          clearTimeout(timer);
          tempNew.dataset.state = "0";
          resolve();
        }
      }
    } catch(error) {
      console.log(error);
    }
  }, 100);
}

function pressDelete(resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceHeader');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;

      if(innerDoc4) {
        let deleteButton = innerDoc4.getElementById('deleteDiv');
        if (deleteButton) {
          let funcText = deleteButton.outerHTML.split('href="javascript: ')[1].split('\">')[0];
          innerDoc4.getElementById('actionbarDiv').innerHTML += `<input id='tempDelete' style='display: none;' onkeydown="(function(){const tempDelete = document.getElementById('tempDelete');try{tempDelete.dataset.state = '1';${funcText};tempDelete.dataset.state = '2';}catch(e){tempDelete.dataset.state = '0';}} )()" data-state='0'  />`;
          tempDelete = innerDoc4.getElementById('tempDelete');
          if (tempDelete.dataset.state == "0") {
            tempDelete.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
          }

          if (tempDelete.dataset.state == "2") {
            clearTimeout(timer);
            tempDelete.remove();
            resolve();
          }
        }
      }
    } catch(error) {
      console.log(error);
    }
  }, 100);
}

function fillForm(school, values, resolve) {
    const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;
      const schoolID = innerDoc5.getElementById('schoolID');

      if (school) {
        schoolID.value = school.value;
      }

      for (const [key, value] of Object.entries(values)) {
        if(value != undefined && value != null) {
          if (innerDoc5.getElementById(key).type == "checkbox") {
            innerDoc5.getElementById(key).checked = value;
          } else {
            innerDoc5.getElementById(key).value = value;
          }
        }
      }
      clearTimeout(timer);
      resolve();
    } catch(error) {
      console.log(error);
    }
  }, 100);
}

function checkSchool(school, resolve) {
  try{
    const mainDoc = document.getElementById('main-workspace');
    const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
    const innerEl = innerDoc.getElementById('frameWorkspace');
    const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
    const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
    const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
    const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
    const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
    const innerEl4 = innerDoc4.getElementById('detailFrame');
    const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;
    const schoolID = innerDoc5.getElementById('schoolID');

    if (schoolID.options[schoolID.selectedIndex].text != school.schoolName) {
      const save = confirm(`School name in extension does not match school name on website. Would you like to add it anyway?\n\nExtension: ${school.schoolName}\nWebsite: ${schoolID.options[schoolID.selectedIndex].text}`);
      resolve(save);
    } else {
      resolve(true);
    }
  } catch(error) {
    console.log(error);
  }
}

/*
* "0": failed
* "1": executing
* "2": success
*/
function pressSave(resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceHeader');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;

      if(innerDoc4) {
        let tempSave = innerDoc4.getElementById('tempSave');
        if (!tempSave) {
          innerDoc4.getElementById('actionbarDiv').innerHTML += "<input id='tempSave' style='display: none;' onkeydown='(function(){const tempSave = document.getElementById(\"tempSave\");try{tempSave.dataset.state = \"1\";saveAssignment();tempSave.dataset.state = \"2\";}catch(e){tempSave.dataset.state = \"0\";}} )()' data-state='0' />";
          tempSave = innerDoc4.getElementById('tempSave');
        }

        if (tempSave.dataset.state == "0") {
          tempSave.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
        }

        if (tempSave.dataset.state == "2") {
          clearTimeout(timer);
          tempSave.dataset.state = "0";
          resolve();
        }
      }
    } catch(error) {
      console.log(error);
    }
  }, 100);
}

function checkIfSaved(resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;
      if (innerDoc5.getElementsByClassName('detail').length > 0 && addFailed) {
        addFailed = false;
        clearTimeout(timer);
        resolve(false);
      } else if (innerDoc5.getElementsByClassName('detail').length < 1 && !addFailed) {
        clearTimeout(timer);
        resolve(true);
      }
    } catch (e){
      console.log(e);
    }
  }, 100);
}

function getAllDA() {
  const mainDoc = document.getElementById('main-workspace');
  const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
  const innerEl = innerDoc.getElementById('frameWorkspace');
  const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
  const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
  const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
  const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
  const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
  const innerEl4 = innerDoc4.getElementById('masterFrame');
  const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;

  return innerDoc5.querySelectorAll('a.deselectedRow, a.selectedRow');
}

function valueIsInSchools(value, schools) {
  returnValue = null;
  for (let i = 0; i < schools.length; i++) {
    if (schools[i].value == value) {
      returnValue = schools[i];
    }
  }
  return returnValue;
}

function checkMatch(matchValues, schools, resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;
      const schoolID = innerDoc5.getElementById('schoolID');

      let school = valueIsInSchools(schoolID.value, schools);

      if (!school) {
        clearTimeout(timer);
        resolve(null);
        return;
      }

      for (const [key, value] of Object.entries(matchValues)) {
        if(value && innerDoc5.getElementById(key)) {
          if (innerDoc5.getElementById(key).type == "checkbox") {
            if (innerDoc5.getElementById(key).checked != value) {
              console.log(key, value, innerDoc5.getElementById(key).checked);
              clearTimeout(timer);
              resolve(null);
              return;
            }
          } else {
            if (innerDoc5.getElementById(key).value != value) {
              console.log(key, value, innerDoc5.getElementById(key).value);
              clearTimeout(timer);
              resolve(null);
              return;
            }
          }
        }
      }
      clearTimeout(timer);
      // console.log(`Match: ${school.schoolName}`);
      resolve(school);
    } catch(error) {
      console.log(error);
    }
  }, 100);
}

function waitForChange(id, resolve) {
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;

      if (innerDoc5.getElementById('assignmentID').value != id) {
        clearTimeout(timer);
        resolve(innerDoc5.getElementById('assignmentID').value);
      }
    } catch (e){
      console.log(e);
    }
  }, 100);
}

function waitForDelete(resolve) {
  let i = 0;
  const timer = setInterval(() => {
    try {
      const mainDoc = document.getElementById('main-workspace');
      const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
      const innerEl = innerDoc.getElementById('frameWorkspace');
      const innerDoc2 = innerEl.contentDocument || innerEl.contentWindow.document;
      const innerEl2 = innerDoc2.getElementById('frameWorkspaceWrapper');
      const innerDoc3 = innerEl2.contentDocument || innerEl2.contentWindow.document;
      const innerEl3 = innerDoc3.getElementById('frameWorkspaceDetail');
      const innerDoc4 = innerEl3.contentDocument || innerEl3.contentWindow.document;
      const innerEl4 = innerDoc4.getElementById('detailFrame');
      const innerDoc5 = innerEl4.contentDocument || innerEl4.contentWindow.document;

      if (!innerDoc5.querySelector('body.detail')) {
        clearTimeout(timer);
        resolve(true);
        return;
      }

      if (i > 30) {
        clearTimeout(timer);
        resolve(false);
        return;
      }
      i++;
    } catch (e){
      console.log(e);
    }
  }, 100);
}

function isInDAList(element, DAList) {
  let id = element.outerHTML.split('assignmentID=')[1].split('\\')[0];
  if (DAList.get(id)){
    return true;
  }
  return false;
}

async function addDA(schools, values) {
  if(values && schools) {
    let notAdded = [];
    for (let i = 0; i < schools.length; i++){
      let cancel = false;
      let repeat = false;
      await new Promise((resolve) => pressNew(resolve));
      await new Promise((resolve) => waitForFormLoad(values, resolve));
      await new Promise((resolve) => waitForSchoolPopulate(resolve));
      await new Promise((resolve) => fillForm(schools[i], values, resolve))
      await new Promise((resolve) => checkSchool(schools[i], resolve)).then(function(save) {
        if (!save) {
          cancel = true;
        }
      });
      if (!cancel) {
        await new Promise((resolve) => pressSave(resolve));
      }
      await new Promise((resolve) => checkIfSaved(resolve)).then(function(saved) {
        if (!saved) {
          repeat = true
        }
      });
      if (repeat) {
        await new Promise((resolve) => fillForm(schools[i], valueForm, booleanForm, resolve)).then(function(save) {
          if (!save) {
            cancel = true;
          }
        });
        if (!cancel) {
          await new Promise((resolve) => pressSave(resolve));
        }
        await new Promise((resolve) => checkIfSaved(resolve)).then(function(saved) {
          if (!saved) {
            notAdded.push(schools[i]);
          }
        });
      }
    }
    if (notAdded.length > 0) {
      let msg = "";
      for (let i = 0; i < notAdded.length; i++) {
        msg += `${notAdded[i].schoolName}\n`;
      }
      alert(`Failed to add Schools:\n\n${msg}`);
    } else {
      alert("Successfully completed adding all schools");
    }
  }
}

async function editDA(schools, matchValues, setValues) {
  if (schools && matchValues && setValues) {
    let failed = new Map();
    let checkedDAList = new Map();
    let DAList = getAllDA();
    let currentID = "";
    simulateClick(DAList[0]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    for (let i = 0; i < DAList.length; i++) {
      DAList = getAllDA();
      let cancel = false;
      let repeat = false;
      let school;
      if (i > 0) {
        if (!isInDAList(DAList[i - 1], checkedDAList)) {
          i--;
        }
      }
      if (isInDAList(DAList[i], checkedDAList)) {
        continue;
      }
      simulateClick(DAList[i]);
      await new Promise((resolve) => waitForChange(currentID, resolve)).then(function (id) {
        currentID = id;
        checkedDAList.set(id, true);
      });
      await new Promise((resolve) => waitForFormLoad(matchValues, resolve));
      await new Promise((resolve) => waitForFormLoad(setValues, resolve));
      await new Promise((resolve) => checkMatch(matchValues, schools, resolve)).then(function(matchSchool) {
        if (matchSchool) {
          school = matchSchool;
        } else {
          cancel = true;
        }
      });
      if (!cancel) {
        await new Promise((resolve) => fillForm(null, setValues, resolve))
        await new Promise((resolve) => pressSave(resolve));
        await new Promise((resolve) => checkIfSaved(resolve)).then(function(saved) {
          if (!saved) {
            repeat = true
          }
        });
        if (repeat) {
          await new Promise((resolve) => fillForm(null, setValues, resolve))
          await new Promise((resolve) => pressSave(resolve));
          await new Promise((resolve) => checkIfSaved(resolve)).then(function(saved) {
            if (!saved) {
              if (failed.get(school)) {
                failed.set(school, failed.get(school) + 1);
              } else {
                failed.set(school, 1);
              }
            }
          });
        }
      }
    }
    if (failed.size > 0) {
      let msg = "";
      failed.forEach(function (value, key, map) {
        msg += `${value}: ${key.schoolName}\n`;
      });
      alert(`Failed to edit District Assignments for:\n\n${msg}`);
    } else {
      alert("Successfully completed editing all District Assignments");
    }
  }
}

async function deleteDA(schools, values) {
  if (schools && values) {
    let failed = new Map();
    let checkedDAList = new Map();
    let DAList = getAllDA();
    let currentID = "";
    simulateClick(DAList[0]);
    await new Promise((resolve) => setTimeout(resolve, 1000))
    for (let i = 0; i < DAList.length; i++) {
      DAList = getAllDA();
      let cancel = false;
      let repeat = false;
      let school;
      if (i > 0) {
        if (!isInDAList(DAList[i - 1], checkedDAList)) {
          i--;
        }
      }
      if (isInDAList(DAList[i], checkedDAList)) {
        continue;
      }
      simulateClick(DAList[i]);
      await new Promise((resolve) => waitForChange(currentID, resolve)).then(function (id) {
        currentID = id;
        checkedDAList.set(id, true);
      });
      await new Promise((resolve) => waitForFormLoad(values, resolve));
      await new Promise((resolve) => checkMatch(values, schools, resolve)).then(function(matchSchool) {
        if (matchSchool) {
          school = matchSchool;
        } else {
          cancel = true;
        }
      });
      if (!cancel) {
        await new Promise((resolve) => pressDelete(resolve));
        await new Promise((resolve) => waitForDelete(resolve)).then(function(success) {
          if (!success) {
            repeat = true
          }
        });
        if (repeat) {
          await new Promise((resolve) => pressDelete(resolve));
          await new Promise((resolve) => waitForDelete(resolve)).then(function(success) {
            if (!success) {
              if (failed.get(school)) {
                failed.set(school, failed.get(school) + 1);
              } else {
                failed.set(school, 1);
              }
            }
          });
        }
      }
    }
    if (failed.size > 0) {
      let msg = "";
      failed.forEach(function (value, key, map) {
        msg += `${value}: ${key.schoolName}\n`;
      });
      alert(`Failed to delete for Schools:\n\n${msg}`);
    } else {
      alert("Successfully completed deleting all District Assignments");
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.oper);
    if (request.oper == "addDA") {
      addDA(request.schools, request.values);
    } else if (request.oper == "editDA") {
      editDA(request.schools, request.matchValues, request.setValues);
    } else if (request.oper == "deleteDA") {
      console.log(request.matchValues);
      deleteDA(request.schools, request.matchValues);
    }
  }
);
