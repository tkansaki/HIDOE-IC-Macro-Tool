import schools from "./schools.js"
import { districts, complexAreas, complexes} from "./groups.js"

let mode = "state";

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

document.addEventListener('DOMContentLoaded', function() {
    let addDAForm = document.getElementById('addDAForm');
    let groupType = document.getElementById('groupType');
    let group = document.getElementById('group');

    addDAForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let startDate;
        let endDate;
        try {
            startDate = document.getElementById('startDate').valueAsDate.toLocaleString().split(',')[0];
        } catch (e) {
            alert("Infinite Campus requires a valid start date");
            return;
        }
        try {
            endDate = document.getElementById('endDate').valueAsDate.toLocaleString().split(',')[0];
        } catch (e) {
            endDate = "";
            console.log(e);
        }
        let titleCode = document.getElementById('titleCode').value;
        let type = document.getElementById('type').value;
        let fte = document.getElementById('fte').value;

        let teacher = document.getElementById('teacher').checked;
        let specialEd = document.getElementById('specialEd').checked;
        let program = document.getElementById('program').checked;
        let behavior = document.getElementById('behavior').checked;
        let health = document.getElementById('health').checked;
        let responseApprover = document.getElementById('responseApprover').checked;
        let rti = document.getElementById('rti').checked;
        let advisor = document.getElementById('advisor').checked;
        let supervisor = document.getElementById('supervisor').checked;
        let counselor = document.getElementById('counselor').checked;
        let foodservice = document.getElementById('foodservice').checked;
        let excludeReferral = document.getElementById('excludeReferral').checked;
        let approver = document.getElementById('approver').checked;
        let framProcessor = document.getElementById('framProcessor').checked;
        let activity = document.getElementById('activity').checked;
        let activityPreapprover = document.getElementById('activityPreapprover').checked;
        let externalLMSExclude = document.getElementById('externalLMSExclude').checked;
        let exclude = document.getElementById('exclude').checked;
        let status_555_ = document.getElementById('status_555_').checked;

        let valueForm = {startDate, endDate, titleCode, type, fte}
        let booleanForm = {teacher, specialEd, program, behavior, health, responseApprover, rti, advisor, supervisor, counselor, foodservice,
        excludeReferral, approver, framProcessor, activity, activityPreapprover, externalLMSExclude, exclude, status_555_}

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            let activeTab = tabs[0];
            let schools = getFilteredSchools()
            if (schools.length < 1) {
                alert("Selected parameters results in 0 schools");
                return;
            }
            chrome.tabs.sendMessage(activeTab.id, {oper: "addDA", booleanForm, valueForm, schools});
        });
    });

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