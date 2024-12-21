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

function waitForDetails(resolve) {
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
      if (innerDoc5.getElementsByClassName('detail').length > 0) {
        if (innerDoc5.getElementById('schoolID')) {
          let currentSchool = getCookieByName("schoolID");
          if (currentSchool != 0) {
            const timer2 = setInterval(() => {
              if (innerDoc5.getElementById('schoolID').value == currentSchool) {
                clearTimeout(timer2);
                resolve();
              }
            }, 100);
          } else {
            const timer2 = setInterval(() => {
              if (innerDoc5.getElementById('schoolID').selectedIndex == -1) {
                clearTimeout(timer2);
                resolve();
              }
            }, 100);
          }
          clearTimeout(timer);
        }
      }
    } catch (e){
      console.log("Error on waitForDetails", e);
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

function fillForm(school, valueForm, booleanForm, resolve) {
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

      schoolID.value = school.value;
      
      for (const [key, value] of Object.entries(valueForm)) {
        if(value) {
          innerDoc5.getElementById(key).value = value;
        }
      }
      for (const [key, value] of Object.entries(booleanForm)) {
        if(value) {
          innerDoc5.getElementById(key).checked = value;
        }
      }
      clearTimeout(timer);
      if (schoolID.options[schoolID.selectedIndex].text != school.schoolName) {
        const save = confirm(`School name in extension does not match school name on website. Would you like to add it anyway?\n\nExtension: ${school.schoolName}\nWebsite: ${schoolID.options[schoolID.selectedIndex].text}`);
        resolve(save);
      } else {
        resolve(true);
      }
    } catch(error) {
      console.log(error);
    }
  }, 100);
}

/*
* "0": failed
* "1": executing
* "2": success
*/
function pressSave(school, resolve) {
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

async function addDA(schools, valueForm, booleanForm) {
  if(valueForm && booleanForm && schools) {
    let notAdded = [];
    for (let i = 0; i < schools.length; i++){
      let cancel = false;
      let repeat = false;
      await new Promise((resolve) => pressNew(resolve));
      await new Promise((resolve) => waitForDetails(resolve));
      await new Promise((resolve) => fillForm(schools[i], valueForm, booleanForm, resolve)).then(function(save) {
        if (!save) {
          cancel = true;
        }
      });
      if (!cancel) {
        await new Promise((resolve) => pressSave(schools[i], resolve));
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
          await new Promise((resolve) => pressSave(schools[i], resolve));
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.oper == "addDA") {
      addDA(request.schools, request.valueForm, request.booleanForm);
    } else if (request.oper == "editDA") {
      console.log(request.matchValues);
    }
  }
);
