import schools from "./schools.js"
import { districts, complexAreas, complexes} from "./groups.js"

let mode = "state";
let availableMatchFields = [
    {id: "startDate", name: "Start Date", disabled: false, html: `<input type="date" class="form-control form-control-sm" id="startDate">`},
    {id: "endDate", name: "End Date", disabled: false, html: `<input type="date" class="form-control form-control-sm" id="endDate">`},
    {id: "titleCode", name: "Title", disabled: false, html: `<select class="form-control form-control-sm" id="titleCode">
              <option></option>
              <option value="1">Elementary Principal</option>
              <option value="2">Secondary Principal</option>
              <option value="3">School Staff</option>
            </select>`},
    {id: "type", name: "Type", disabled: false, html: `<select class="form-control form-control-sm" id="type">
              <option></option>
              <option value="01">01: Administrative</option>
              <option value="02">02: Certified</option>
              <option value="03">03: Classified</option>
            </select>`},
    {id: "fte", name: "FTE", disabled: false, html: `<input type="number" class="form-control form-control-sm" id="fte">`},
    {id: "teacher", name: "Teacher", disabled: false, html: `<input class="form-check-input" type="checkbox" id="teacher">`},
    {id: "specialEd", name: "Special Ed", disabled: false, html: `<input class="form-check-input" type="checkbox" id="specialEd">`},
    {id: "program", name: "Program", disabled: false, html: `<input class="form-check-input" type="checkbox" id="program">`},
    {id: "behavior", name: "Behavior Admin", disabled: false, html: `<input class="form-check-input" type="checkbox" id="behavior">`},
    {id: "health", name: "Health", disabled: false, html: `<input class="form-check-input" type="checkbox" id="health">`},
    {id: "responseApprover", name: "Behavior Response Approver", disabled: false, html: `<input class="form-check-input" type="checkbox" id="responseApprover">`},
    {id: "rti", name: "Response to Intervention", disabled: false, html: `<input class="form-check-input" type="checkbox" id="rti">`},
    {id: "advisor", name: "Advisor", disabled: false, html: `<input class="form-check-input" type="checkbox" id="advisor">`},
    {id: "supervisor", name: "Supervisor", disabled: false, html: `<input class="form-check-input" type="checkbox" id="supervisor">`},
    {id: "counselor", name: "Counselor", disabled: false, html: `<input class="form-check-input" type="checkbox" id="counselor">`},
    {id: "foodservice", name: "Foodservice", disabled: false, html: `<input class="form-check-input" type="checkbox" id="foodservice">`},
    {id: "excludeReferral", name: "Exclude Behavior Referral", disabled: false, html: `<input class="form-check-input" type="checkbox" id="excludeReferral">`},
    {id: "approver", name: "Self Service Approver", disabled: false, html: `<input class="form-check-input" type="checkbox" id="approver">`},
    {id: "framProcessor", name: "FRAM Processor", disabled: false, html: `<input class="form-check-input" type="checkbox" id="framProcessor">`},
    {id: "activity", name: "Activity Staff", disabled: false, html: `<input class="form-check-input" type="checkbox" id="activity">`},
    {id: "activityPreapprover", name: "Activity Preapproval", disabled: false, html: `<input class="form-check-input" type="checkbox" id="activityPreapprover">`},
    {id: "externalLMSExclude", name: "External LMS Exclude", disabled: false, html: `<input class="form-check-input" type="checkbox" id="externalLMSExclude">`},
    {id: "exclude", name: "Exclude", disabled: false, html: `<input class="form-check-input" type="checkbox" id="exclude">`},
    {id: "status_555_", name: "HLIP", disabled: false, html: `<input class="form-check-input" type="checkbox" id="status_555_">`}
]

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
            <select class="form-control form-control-sm"><option>test1</option><option>test2</option></select>
        </div>
        <div class="form-group col-6 inputFieldContainer">
            <input type="text" class="form-control form-control-sm" disabled>
        </div>
    `;
    let removeButton = newField.querySelector('button');
    let selectField = newField.querySelector('select');
    let inputFieldContainer = newField.getElementsByClassName('inputFieldContainer')[0];

    removeButton.addEventListener('click', function() {
        newField.remove();
    })

    selectField.addEventListener('change', function() {
        inputFieldContainer.innerHTML = `<input type="text" class="form-control form-control-sm">`
    })
    fields.appendChild(newField);
}

document.addEventListener('DOMContentLoaded', function() {
    let editDAForm = document.getElementById('editDAForm');
    let groupType = document.getElementById('groupType');
    let group = document.getElementById('group');

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