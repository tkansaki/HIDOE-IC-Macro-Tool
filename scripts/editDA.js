import schools from "./schools.js"
import { districts, complexAreas, complexes} from "./groups.js"

let mode = "state";
let availableFields = new Map();
let fieldElements = new Map();

function getOptions() {
    let list;
    let options = [];

    if (mode == "district") {
        list = districts;
    } else if (mode == "complexArea") {
        list = complexAreas;
    } else if (mode == "complex") {
        list = complexes;
    }

    list.forEach(function (item, index) {
        options.push(`<option value="${item}">${item}</option>`);
    })

    return options;
}

function getFilteredSchools() {
    let elementary = document.getElementById('elementary').checked;
    let secondary = document.getElementById('secondary').checked;
    let charters = document.getElementById('charters').checked;
    let group = document.getElementById('group').value;
    let filteredSchools = [];

    schools.forEach(function (item, index) {
        let pass = true;
        if (mode == "district") {
            if (item.district != group) {
                pass = false;
            }
        } else if (mode == "complexArea") {
            if (item.complexArea != group) {
                pass = false;
            }
        } else if (mode == "complex") {
            if (item.complex != group) {
                pass = false;
            }
        }
        if (!item.active) {
            pass = false;
        }
        if (item.charter && !charters) {
            pass = false;
        }
        if (!elementary || !secondary) {
            if (elementary && !secondary) {
                if (!item.elementary) {
                    pass = false;
                }
            } else if (!elementary && secondary) {
                if (!item.secondary) {
                    pass = false;
                }
            } else {
                pass = false;
            }
        }
        if (pass) {
            filteredSchools.push(item);
        }
    });
    return filteredSchools;
}

function initialize() {
    let temp = [];
    for (let i = 0; i < 2; i++) {
        let map = new Map();
        map.set("startDate", {name: "Start Date", disabled: false, html: `<input type="date" class="form-control form-control-sm" id="startDate">`});
        map.set("endDate", {name: "End Date", disabled: false, html: `<input type="date" class="form-control form-control-sm" id="endDate">`});
        map.set("titleCode", {name: "Title", disabled: false, html: `<select class="form-control form-control-sm" id="titleCode">
                  <option></option>
                  <option value="1">Elementary Principal</option>
                  <option value="2">Secondary Principal</option>
                  <option value="3">School Staff</option>
                </select>`});
        map.set("type", {name: "Type", disabled: false, html: `<select class="form-control form-control-sm" id="type">
                  <option></option>
                  <option value="01">01: Administrative</option>
                  <option value="02">02: Certified</option>
                  <option value="03">03: Classified</option>
                </select>`});
        map.set("fte", {name: "FTE", disabled: false, html: `<input type="number" class="form-control form-control-sm" id="fte">`});
        map.set("teacher", {name: "Teacher", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="teacher">`});
        map.set("specialEd", {name: "Special Ed", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="specialEd">`});
        map.set("program", {name: "Program", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="program">`});
        map.set("behavior", {name: "Behavior Admin", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="behavior">`});
        map.set("health", {name: "Health", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="health">`});
        map.set("responseApprover", {name: "Behavior Response Approver", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="responseApprover">`});
        map.set("rti", {name: "Response to Intervention", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="rti">`});
        map.set("advisor", {name: "Advisor", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="advisor">`});
        map.set("supervisor", {name: "Supervisor", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="supervisor">`});
        map.set("counselor", {name: "Counselor", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="counselor">`});
        map.set("foodservice", {name: "Foodservice", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="foodservice">`});
        map.set("excludeReferral", {name: "Exclude Behavior Referral", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="excludeReferral">`});
        map.set("approver", {name: "Self Service Approver", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="approver">`});
        map.set("framProcessor", {name: "FRAM Processor", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="framProcessor">`});
        map.set("activity", {name: "Activity Staff", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="activity">`});
        map.set("activityPreapprover", {name: "Activity Preapproval", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="activityPreapprover">`});
        map.set("externalLMSExclude", {name: "External LMS Exclude", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="externalLMSExclude">`});
        map.set("exclude", {name: "Exclude", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="exclude">`});
        map.set("status_555_", {name: "HLIP", disabled: false, html: `<input class="form-control form-control-sm" type="checkbox" id="status_555_">`});
        temp.push(map);
    }
    availableFields.set("matchFields", temp[0])
    availableFields.set("setFields", temp[1])
    fieldElements.set("matchFields", new Map());
    fieldElements.set("setFields", new Map());
}

function addOptions(selectElement, availableFields) {
    selectElement.innerHTML = `<option></option>`;
    availableFields.forEach(function (value, key, map) {
        let attr = "";
        if (value.disabled) {
            attr = "disabled";
        }
        selectElement.innerHTML += `<option value="${key}" ${attr}>${value.name}</option>`;
    })
}

function updateOptions(selectElement, availableFields) {
    availableFields.forEach(function (value, key, map) { 
        selectElement.querySelector(`option[value="${key}"]`).disabled = value.disabled;
    })
}

function updateAvailable(id, key, disabled) {
    if (key) {
        availableFields.get(id).get(key).disabled = disabled;
    }
}

function updateAllOptions(id) {
    fieldElements.get(id).forEach(function (value, key, map) {
        updateOptions(key.querySelector('select'), availableFields.get(id));
    })
}


function addField(id) {
    let fields = document.getElementById(id);
    let newField = document.createElement("div");
    newField.classList.add("form-row");
    newField.innerHTML = `
        <div class="form-group col-1">
            <button type="button" class="form-control btn btn-outline-danger btn-sm p-0 h-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </button>
        </div>
        <div class="form-group col-5">
            <select class="form-control form-control-sm"></select>
        </div>
        <div class="form-group col-6 inputFieldContainer">
            <input type="text" class="form-control form-control-sm" disabled>
        </div>
    `;
    let removeButton = newField.querySelector('button');
    let selectField = newField.querySelector('select');
    let inputFieldContainer = newField.getElementsByClassName('inputFieldContainer')[0];


    addOptions(selectField, availableFields.get(id));

    removeButton.addEventListener('click', function() {
        let currentValue = fieldElements.get(id).get(newField);
        fieldElements.get(id).delete(newField);
        updateAvailable(id, currentValue, false);
        updateAllOptions(id);
        newField.remove();
    })

    selectField.addEventListener('change', function() {
        let currentValue = fieldElements.get(id).get(newField);
        fieldElements.get(id).set(newField, selectField.value);
        updateAvailable(id, currentValue, false);
        updateAvailable(id, selectField.value, true);
        updateAllOptions(id);
        inputFieldContainer.innerHTML = availableFields.get(id).get(selectField.value).html;
    })
    fieldElements.get(id).set(newField, "");
    fields.appendChild(newField);
}

document.addEventListener('DOMContentLoaded', function() {
    let editDAForm = document.getElementById('editDAForm');
    let groupType = document.getElementById('groupType');
    let group = document.getElementById('group');

    initialize();

    editDAForm.addEventListener('submit', function(event) {
        event.preventDefault();

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            let activeTab = tabs[0];
            let filteredSchools = getFilteredSchools()
            if (filteredSchools.length < 1) {
                alert("Selected parameters results in 0 schools");
                return;
            }
            chrome.tabs.sendMessage(activeTab.id, {oper: "editDA", schools: filteredSchools});
        });
    });

    document.getElementById('matchFieldsAddButton').addEventListener('click', function() {
        addField("matchFields");
    })

    document.getElementById('setFieldsAddButton').addEventListener('click', function() {
        addField("setFields");
    })

    groupType.addEventListener('change', function() {
        if (groupType.value == "district") {
            mode = "district";
            group.disabled = false;
            group.innerHTML = getOptions();
        }else if (groupType.value == "complexArea") {
            mode = "complexArea";
            group.disabled = false;
            group.innerHTML = getOptions();
        }else if (groupType.value == "complex") {
            mode = "complex";
            group.disabled = false;
            group.innerHTML = getOptions();
        }else {
            mode = "state";
            group.disabled = true;
            group.innerHTML = "<option value='all'>All Schools</option>";
        }
    })
});