import schools from "./schools.js"
import {
    districts,
    complexAreas,
    complexes
} from "./groups.js"

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

document.addEventListener('DOMContentLoaded', function () {
    let addCalendarForm = document.getElementById('addCalendarForm');
    let groupType = document.getElementById('groupType');
    let group = document.getElementById('group');

    addCalendarForm.addEventListener('submit', function (event) {
        event.preventDefault();

        let current = document.getElementById('current').checked;
        let future = document.getElementById('future').checked;
        let previous = document.getElementById('previous').checked;
        let SS = document.getElementById('SS').checked;

        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            let activeTab = tabs[0];
            let filteredSchools = getFilteredSchools()
            if (filteredSchools.length < 1) {
                alert("Selected parameters results in 0 schools");
                return;
            }
            chrome.tabs.sendMessage(activeTab.id, {
                oper: "addCalendar",
                schools: filteredSchools,
                current,
                future,
                previous,
                SS
            });
        });
    });

    groupType.addEventListener('change', function () {
        if (groupType.value == "district") {
            mode = "district";
            group.disabled = false;
            group.innerHTML = getOptions();
        } else if (groupType.value == "complexArea") {
            mode = "complexArea";
            group.disabled = false;
            group.innerHTML = getOptions();
        } else if (groupType.value == "complex") {
            mode = "complex";
            group.disabled = false;
            group.innerHTML = getOptions();
        } else {
            mode = "state";
            group.disabled = true;
            group.innerHTML = "<option value='all'>All Schools</option>";
        }
    })
});