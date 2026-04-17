const queryUnselectedStr = 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
const querySelectedStr = 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'

function getInnerDoc() {
    const mainDoc = document.getElementById("main-workspace");
    return mainDoc.contentDocument || mainDoc.contentWindow.document;
}

function getUnselectedLastPageButton() {
    return getInnerDoc().querySelector(queryUnselectedStr).querySelector('button[title="Go to the last page"]')
}

function getUnselectedPrevPageButton() {
    return getInnerDoc().querySelector(queryUnselectedStr).querySelector('button[title="Go to the previous page"]')
}

function getUnselectedRowCount() {
    return parseInt(getInnerDoc().querySelector(queryUnselectedStr).querySelector('div.k-grid-aria-root[role="grid"]').getAttribute('aria-rowcount'));
}

function getUnselectedRoles() {
    return getInnerDoc().querySelector(queryUnselectedStr).querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
}

function getSelectedLastPageButton() {
    return getInnerDoc().querySelector(querySelectedStr).querySelector('button[title="Go to the last page"]')
}

function getSelectedPrevPageButton() {
    return getInnerDoc().querySelector(querySelectedStr).querySelector('button[title="Go to the previous page"]')
}

function getSelectedRowCount() {
    return parseInt(getInnerDoc().querySelector(querySelectedStr).querySelector('div.k-grid-aria-root[role="grid"]').getAttribute('aria-rowcount'));
}

function getSelectedRoles() {
    return getInnerDoc().querySelector(querySelectedStr).querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
}

function getModifiedTimestamp() {
    const headers = getInnerDoc().querySelectorAll('h3.card__header')
    let accessHeader;
    let modifiedBy;
    headers.forEach((header) => {
        if (header.innerHTML.includes("Access Information")) {
            accessHeader = header;
        }
    })
    accessHeader.parentNode.querySelectorAll('li').forEach((listItem) => {
        if (listItem.innerHTML.includes("Modified By:")) {
            modifiedBy = listItem.innerHTML;
        }
    });
    return modifiedBy.slice(-16);
}

function triggerMouseEvent(element, eventType) {
    const clickEvent = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(clickEvent);
}

function simulateClick(element) {
    if (element) {
        //--- Simulate a natural mouse-click sequence.
        triggerMouseEvent(element, "mouseover");
        triggerMouseEvent(element, "mousedown");
        triggerMouseEvent(element, "mouseup");
        triggerMouseEvent(element, "click");
    } else {
        // console.log("Element not found");
    }
}

function openSearch() {
    simulateClick(document.querySelector('button[aria-controls="searchSidebar"][aria-label="Search"]'));
}

function isSearchOpen() {
    const select = document.querySelector('kendo-dropdownlist[valuefield="type"][data-cy="nav-wrapper-tool-context-search-context-dropdown"]');
    const searchbox = document.getElementById("searchBox");
    return select && searchbox;
}

function openSearchTypeOptions() {
    const select = document.querySelector('kendo-dropdownlist[valuefield="type"][data-cy="nav-wrapper-tool-context-search-context-dropdown"]');
    if (select) {
        simulateClick(select);
        return true
    }
    return false;
}

function selectSearchType(typeText) {
    const popup = document.querySelector('kendo-popup[role="region"][aria-label="Options list"]');
    let match = undefined;
    if (popup) {
    const options = popup.querySelectorAll('li[role="option"][kendodropdownsselectable]');
        if (options) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].querySelector('span').innerHTML.localeCompare(typeText) === 0) {
                    match = options[i];
                }
            }
            simulateClick(match);
        }
    }
    if(match) {
        return true;
    }
    return false;
}

function checkSearchType(typeText) {
    const select = document.querySelector('kendo-dropdownlist[valuefield="type"][data-cy="tool-context-search-context-dropdown"]');
    if (select) {
        const spanText = select.querySelector('span[class="k-input-value-text"]');
        if (spanText) {
            if (spanText.innerHTML.includes(`>${typeText}<`)) {
                return true;
            }
        }
    }
    return false;
}

function setSearchType(typeText, resolve) {
    const timer = setInterval(() => {
        if (isSearchOpen()) {
            if (checkSearchType(typeText)) {
                clearTimeout(timer);
            } else {
                if (openSearchTypeOptions()) {
                    if (selectSearchType(typeText)){
                        resolve();
                        clearTimeout(timer);
                    } else {
                        console.log(`Cannot find type: ${typeText}`)
                        resolve();
                        clearTimeout(timer);
                    }
                }
            }
        } else {
            openSearch();
        }
    }, 250);
}

function searchUser(eid) {
    document.getElementById("searchBox").value = eid;
    document.getElementById("searchBox").dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById("searchBox").dispatchEvent(new KeyboardEvent('keydown', {
        code: "Enter",
        key: "Enter",
        keyCode: 13,
        type: "keyup"
    }));
}

function findSearchResult(eid) {
    const results = document.getElementsByTagName('ic-user-search-result');

    for (let i = 0; i < results.length; i++) {
        const buttons = results[i].getElementsByTagName('button');
        for (let j = 0; j < buttons.length; j++) {
            if (buttons[j].innerHTML.includes(` ${eid} `)) {
                return buttons[j];
            }
        }
    }
    return null;
}

function clickSave() {
    const buttons = getInnerDoc().getElementsByTagName("button");
    let saveButton;
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].innerHTML.includes(" Save ")) {
            saveButton = buttons[i];
        }
    }
    simulateClick(saveButton);
}

function waitForSearch(resolve) {
    const timer = setInterval(() => {
        if (document.getElementsByTagName('ic-user-search-result').length > 0) {
            clearTimeout(timer);
            resolve(true);
        } else if (document.querySelector('div[data-cy="ic-tool-context-search-no-results"]')) {
            clearTimeout(timer);
            resolve(false);
        }
    }, 250);
}

function waitForCorrectFormLoad(eid, resolve) {
    let numChecks = 0;
    const timer = setInterval(() => {
        const username = getInnerDoc().getElementById('usernameRef');
        const disabled = getInnerDoc().getElementById('disabledRef');
        const date = getInnerDoc().querySelector(`[id^='datepicker-']`);
        if (username != undefined && username != null &&
            disabled != undefined && disabled != null &&
            date != undefined && date != null) {
            if (username.value == eid) {
                clearTimeout(timer);
                resolve();
            } else {
                if (numChecks % 4 == 0) {
                    simulateClick(findSearchResult(eid));
                }
            }
        }
        numChecks++;
    }, 250);
}

function waitForRoleLoad(resolve) {
    const timer = setInterval(() => {
        if (getInnerDoc().querySelector(queryUnselectedStr)) {
            clearTimeout(timer);
            setTimeout(resolve, 250);
        }
    }, 250);
}

function parseTitle(title) {
    let splitTitle = title.split('(');
    let name = splitTitle[0].trim();

    let period = "";
    if (splitTitle[1]) {
        period = splitTitle[1].replaceAll(')', '');
    }
    if (name.startsWith("SS ")) {
        name = name.replaceAll("SS ", "");
        period = "SS";
    }
    return {
        name,
        period
    };
}

function schoolMatch(school, name) {
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

function addCalendar(schools, current, future, previous, SS) {
    try {
        let success = new Array(schools.length);
        let numSelectedRoles = getSelectedRowCount();
        simulateClick(getUnselectedLastPageButton());
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getUnselectedPrevPageButton());
            }
            let roles = getUnselectedRoles();
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                let parsedTitle = parseTitle(title);
                let inSchoolList = isInSchoolList(schools, parsedTitle.name);
                if (inSchoolList >= 0) {
                    success[inSchoolList] = true;
                    if (future && parsedTitle.period == "future") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    } else if (previous && parsedTitle.period == "previous") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    } else if (current && parsedTitle.period == "") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    } else if (SS && parsedTitle.period == "SS") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    }
                }
            }
        } while (getUnselectedPrevPageButton().getAttribute('aria-disabled') === "false");
        let failed = [];
        for (let i = 0; i < schools.length; i++) {
            if (!success[i]) {
                failed.push(schools[i]);
            }
        }
        const timer = setInterval(() => {
            let currentLength = getSelectedRowCount();
            if (currentLength >= numSelectedRoles) {
                clearTimeout(timer);
                if (failed.length > 0) {
                    let msg = "";
                    for (let i = 0; i < failed.length; i++) {
                        msg += `${failed[i].schoolName}\n`
                    }
                    setTimeout(function () {
                        alert(`Failed to find schools: \n\n${msg}`)
                    }, 1000);
                } else {
                    setTimeout(function () {
                        alert("Completed adding all calendars.")
                    }, 1000);
                }
            }
        }, 250);
    } catch (e) {
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
    }
}

function removeCalendar(schools, current, future, previous, SS) {
    try {
        let success = new Array(schools.length);
        let numSelectedRoles = getUnselectedRowCount();
        simulateClick(getSelectedLastPageButton());
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getSelectedPrevPageButton());
            }
            const roles = getSelectedRoles();
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                let parsedTitle = parseTitle(title);
                let inSchoolList = isInSchoolList(schools, parsedTitle.name);
                if (inSchoolList >= 0) {
                    success[inSchoolList] = true;
                    if (future && parsedTitle.period == "future") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    } else if (previous && parsedTitle.period == "previous") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    } else if (current && parsedTitle.period == "") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    } else if (SS && parsedTitle.period == "SS") {
                        simulateClick(roles[i]);
                        numSelectedRoles++;
                    }
                }
            }
        } while (getSelectedPrevPageButton().getAttribute('aria-disabled') === "false")
        let failed = [];
        for (let i = 0; i < schools.length; i++) {
            if (!success[i]) {
                failed.push(schools[i]);
            }
        }
        const timer = setInterval(() => {
            let currentLength = getUnselectedRowCount();
            if (currentLength >= numSelectedRoles) {
                clearTimeout(timer);
                if (failed.length > 0) {
                    let msg = "";
                    for (let i = 0; i < failed.length; i++) {
                        msg += `${failed[i].schoolName}\n`
                    }
                    setTimeout(function () {
                        alert(`Failed to find schools: \n\n${msg}`)
                    }, 1000);
                } else {
                    setTimeout(function () {
                        alert("Completed removing all calendars.")
                    }, 1000);
                }
            }
        }, 250);
    } catch (e) {
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
    }
}

function getCurrentRoles() {
    try {
        let currentRoles = [];
        let numSelectedRoles = getUnselectedRowCount();
        simulateClick(getSelectedLastPageButton());
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getSelectedPrevPageButton());
            }
            const roles = getSelectedRoles();
            for (let i = 0; i < roles.length; i++) {
                currentRoles.push(roles[i].textContent);
            }
        } while (getSelectedPrevPageButton().getAttribute('aria-disabled') === "false")
        return currentRoles;
    } catch (e) {
        console.log(e);
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
        return [];
    }
}

function disableWorker() {
        try {
        const disabled = getInnerDoc().getElementById('disabledRef');
        const date = getInnerDoc().querySelector(`[id^='datepicker-']`);
        simulateClick(getSelectedLastPageButton());
        //Remove all roles
        let removedRoles = [];
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getSelectedPrevPageButton());
            }
            const roles = getSelectedRoles();
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (!title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                    removedRoles.push(title);
                }
            }
        } while (getSelectedPrevPageButton().getAttribute('aria-disabled') === "false")

        //add "*Disabled" role
        init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getUnselectedPrevPageButton());
            }
            const roles = getUnselectedRoles();
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                }
            }
        } while (getUnselectedPrevPageButton().getAttribute('aria-disabled') === "false")
        // Ensure "disabled" checkbox is checked
        if (!disabled.checked) {
            simulateClick(disabled)
        }
        // Set "Account Expiration Date" to today.
        let today = new Date();
        date.value = "";
        date.dispatchEvent(new Event('input', { bubbles: true }));
        let month = `${today.getMonth() + 1}`;
        let day = `${today.getDate()}`;
        let year = `${today.getFullYear()}`;

        for (let i = 1; i <= month.length; i++) {
            date.value = `${month.slice(0, i)}`;
            date.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (month.length <= 1) month = "0" + month;
        for (let i = 1; i <= day.length; i++) {
            date.value = `${month}/${day.slice(0, i)}`;
            date.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (day.length <= 1) day = "0" + day;
        for (let i = 1; i <= year.length; i++) {
            date.value = `${month}/${day}/${year.slice(0, i)}`;
            date.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return removedRoles;
    } catch (e) {
        //console.log(e);
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
    }
}

function disableUser() {
    try {
        let rolestr = disableWorker().join("\n");
        setTimeout( async function () {
            if (confirm(`Copy Removed Roles to Clipboard?\n\n${rolestr}`)) {
                let tryagain = true;
                while (tryagain) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    try {
                        navigator.clipboard.writeText(rolestr);
                        tryagain = false;
                    } catch (e){
                        console.log("try again?", e);
                        if (confirm("Copy to clipboard failed. Try again?")) {
                            tryagain = true;
                        } else {
                            tryagain = false;
                        }
                    }
                }
            };
        }, 500);
    } catch (e) {
        console.log(e);
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
    }
}


function cleanupDataToCSV(data) {
    let arr = [];
    arr.push(`EID,`);
    arr.push(`First Name,`);
    arr.push(`Last Name,`);
    arr.push(`Roles Removed\n`);
    for (let i = 0; i < data.length; i++) {
        arr.push(`${data[i].EID},`);
        arr.push(`${data[i].firstName},`);
        arr.push(`${data[i].lastName},`);
        arr.push(`"${data[i].removedRoles}"\n`);
    }
    return new File(arr, `cleanup${(new Date()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).replaceAll("/", "")}.csv`, {
        type: 'text/csv',
    })
}

function download(file) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(file);

  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

async function cleanup(data) {
    let failed = [];
    if (!isSearchOpen()) {
        openSearch()
    }
    if (!checkSearchType("User")) {
        await new Promise((resolve) => setSearchType("User", resolve));
    }
    for (let i = 0; i < data.length; i++) {
        searchUser(data[i].EID);
        let cont = true;
        let searchComplete = false;
        await new Promise((resolve) => waitForSearch(resolve)).then(function (exists) {
            if (!exists) {
                failed.push(`${data[i].firstName} ${data[i].lastName} (${data[i].EID})`);
                data[i].removedRoles = "Failed: Could not find user";
                cont = false;
            }
        })
        let searchResult = findSearchResult(data[i].EID);
        if (cont && searchResult !== null) {
            simulateClick(searchResult);
            await new Promise((resolve => waitForCorrectFormLoad(data[i].EID, resolve)));
            await new Promise((resolve => waitForRoleLoad(resolve)));
            await new Promise((resolve) => setTimeout(resolve, 250));
            const currentRoles = getCurrentRoles();
            const initialLength = getSelectedRowCount();
            if (currentRoles.includes("*INV")) {
                failed.push(`${data[i].firstName} ${data[i].lastName} (${data[i].EID})`);
                data[i].removedRoles = "Failed: User has *INV";
            } else {
                data[i].removedRoles = disableWorker().join(", ");
                await new Promise((resolve) => {
                    const timer = setInterval(() => {
                        let currentLength = getSelectedRowCount();
                        //Pluys 1 accounts for added *Disabled role
                        if (currentLength <= initialLength - currentRoles.length + 1) {
                            clearTimeout(timer);
                            resolve();
                        }
                    }, 250);
                });
                const saveTimestamp = Math.floor(Date.now() / 60000);
                clickSave();
                await new Promise((resolve) => {
                    const timer = setInterval(() => {
                        try {
                            let modifiedTimestamp = new Date(getModifiedTimestamp())
                            if (Math.floor(modifiedTimestamp.valueOf() / 60000) >= saveTimestamp) {
                                clearTimeout(timer);
                                resolve();
                            }
                        } catch (e) {
                            // console.log(e);
                            // document still saving or loading
                        }
                    }, 250);
                });
            }
        }
    }
    let csvFile = cleanupDataToCSV(data);
    if (failed.length > 0) {
        let msg = "";
        for (let i = 0; i < failed.length; i++) {
            msg += `${failed[i]}\n`;
        }
        alert ("Failed to find: \n\n" + msg);
    } else {
        alert ("Successfully updated all users");
    }
    download(csvFile);
}

//Summer School Functions

function addRoles(data, school) {
    let SSRoles = "";
    if (data[4].includes("Summer School Data Entry")) {
        SSRoles += "*Summer School Data Entry Staff, "
    }
    if (data[4].includes("Summer School Teacher")) {
        if (school.elementary) {
            SSRoles += "*Summer School Elementary Teacher, "
        }
        if (school.secondary) {
            SSRoles += "*Summer School Secondary Teacher, "
        }
    }  

    try {
        let numAddedRoles = 0;
        simulateClick(getUnselectedLastPageButton());
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getUnselectedPrevPageButton());
            }
            const roles = getUnselectedRoles();
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                let parsedTitle = parseTitle(title);
                if (SSRoles.includes(title)) {
                    simulateClick(roles[i]);
                        numAddedRoles++;
                }
                if (schoolMatch(school, parsedTitle.name)) {
                    if (parsedTitle.period == "SS") {
                        simulateClick(roles[i]);
                        numAddedRoles++;
                    }
                }
            }
        } while (getUnselectedPrevPageButton().getAttribute('aria-disabled') === "false")
        return numAddedRoles;
    } catch (e) {
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
        return -1;
    }
}

function removeDisabled() {
    try {
        simulateClick(getSelectedLastPageButton());
        let init = true;
        let numRemovedRoles = 0;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(getSelectedPrevPageButton());
            }
            const roles = getSelectedRoles();
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (title.includes("*INV")) {
                    return -1;
                }
                if (title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                    numRemovedRoles++;
                }
            }
        } while (getSelectedPrevPageButton().getAttribute('aria-disabled') === "false")
        return numRemovedRoles;
    } catch (e) {
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
        return -1;
    }
}

function ensureActive() {
    try {
        const disabled = getInnerDoc().getElementById('disabledRef');
        const date = getInnerDoc().querySelector(`[id^='datepicker-']`);
        if (disabled.checked) {
            simulateClick(disabled)
            if (date.value) {
                date.value = "";
                date.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return removeDisabled();
        } else {
            return 0;
        }
    } catch (e) {
        return -1;
    }
}

async function summerSchoolAutoProv(school, data) {
    let failed = [];
    if (!isSearchOpen()) {
        openSearch()
    }
    if (!checkSearchType("User")) {
        await new Promise((resolve) => setSearchType("User", resolve));
    }
    for (let i = 0; i < data.length; i++) {
        searchUser(data[i][1]);
        let cont = true
        let searchComplete = false;
        await new Promise((resolve) => waitForSearch(resolve)).then(function (exists) {
            if (!exists) {
                failed.push(`${data[i][0]} (${data[i][1]})`)
                cont = false
            }
        })
        await new Promise((resolve) => setTimeout(resolve, 250))
        if (cont) {
            simulateClick(findSearchResult(data[i][1]));
            await new Promise((resolve => waitForCorrectFormLoad(data[i][1], resolve)));
            await new Promise((resolve => waitForRoleLoad(resolve)));
            await new Promise((resolve) => setTimeout(resolve, 250))

            let initialLength = getSelectedRowCount();
            if (data[i][3].includes("Request Access")) {
                let enabledStatus = ensureActive();
                if (enabledStatus >= 0) {
                    let numAddedRoles = addRoles(data[i], school);
                    if (numAddedRoles >= 0) {
                        await new Promise((resolve) => {
                            const timer = setInterval(() => {
                                let currentLength = getSelectedRowCount();
                                if (currentLength <= initialLength + numAddedRoles - enabledStatus) {
                                    clearTimeout(timer);
                                    resolve();
                                }
                            }, 250);
                        });
                    } else {
                        failed.push(`${data[i][0]} (${data[i][1]})`)
                        cont = false
                    }
                } else {
                    failed.push(`${data[i][0]} (${data[i][1]})`)
                    cont = false
                }
            } else {
                //remove role functionality here
            }
        }
        if (cont) {
            const saveTimestamp = Math.floor(Date.now() / 60000);
            clickSave();
            await new Promise((resolve) => {
                const timer = setInterval(() => {
                    try {
                        let modifiedTimestamp = new Date(getModifiedTimestamp())
                        if (Math.floor(modifiedTimestamp.valueOf() / 60000) >= saveTimestamp) {
                            clearTimeout(timer);
                            resolve();
                        }
                    } catch (e) {
                        // console.log(e);
                        // document still saving or loading
                    }
                }, 250);
            });
        }
    }
    if (failed.length > 0) {
        let msg = "";
        for (let i = 0; i < failed.length; i++) {
            msg += `${failed[i]}\n`;
        }
        alert ("Failed to find: \n\n" + msg);
    } else {
        alert ("Successfully updated all users");
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.oper == "addCalendar") {
            addCalendar(request.schools, request.current, request.future, request.previous, request.SS);
        } else if (request.oper == "removeCalendar") {
            removeCalendar(request.schools, request.current, request.future, request.previous, request.SS);
        } else if (request.oper == "disableUser") {
            disableUser();
        } else if (request.oper == "cleanup") {
            cleanup(request.data);
        } else if (request.oper == "SSAutoProv") {
            summerSchoolAutoProv(request.school, request.data);
        }
    }
);