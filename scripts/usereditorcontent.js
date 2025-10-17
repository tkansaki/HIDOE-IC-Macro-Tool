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
    const select = document.querySelector('kendo-dropdownlist[valuefield="type"][data-cy="tool-context-search-context-dropdown"]');
    const searchbox = document.getElementById("searchBox");
    return select && searchbox;
}

function openSearchTypeOptions() {
    const select = document.querySelector('kendo-dropdownlist[valuefield="type"][data-cy="tool-context-search-context-dropdown"]');
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
    const mainDoc = document.getElementById("main-workspace");
    const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
    const buttons = innerDoc.getElementsByTagName("button");
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
    let currentUsernameValue;
    const timer = setInterval(() => {
        const mainDoc = document.getElementById("main-workspace");
        const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
        const username = innerDoc.getElementById('usernameRef');
        const disabled = innerDoc.getElementById('disabledRef');
        const date = innerDoc.querySelector(`[id^='datepicker-']`);
        if (username != undefined && username != null &&
            disabled != undefined && disabled != null &&
            date != undefined && date != null) {
            if (username.value == eid) {
                clearTimeout(timer);
                resolve();
            } else {
                if (currentUsernameValue !== username.value) {
                    currentUsernameValue = username.value
                    simulateClick(findSearchResult(eid));
                }
            }
        }
    }, 250);
}

function waitForRoleLoad(resolve) {
    const timer = setInterval(() => {
        const mainDoc = document.getElementById("main-workspace");
        const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
        //query added - 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'
        //query not added - 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
        if (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted')) {
            clearTimeout(timer);
            setTimeout(resolve, 1000);
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
        const mainDoc = document.getElementById("main-workspace");
        const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
        let success = new Array(schools.length);
        //query added - 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'
        //query not added - 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
        let numSelectedRoles = parseInt(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('div.k-grid-aria-root[role="grid"]').getAttribute('aria-rowcount'));
        simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the last page"]'));
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the previous page"]'));
            }
            const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
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
        } while (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the previous page"]').disabled == false)
        let failed = [];
        for (let i = 0; i < schools.length; i++) {
            if (!success[i]) {
                failed.push(schools[i]);
            }
        }
        const timer = setInterval(() => {
            let currentLength = parseInt(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('div.k-grid-aria-root[role="grid"]').getAttribute('aria-rowcount'));
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
        const mainDoc = document.getElementById("main-workspace");
        const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
        let success = new Array(schools.length);
        //query added - 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'
        //query not added - 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
        let numSelectedRoles = parseInt(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('div.k-grid-aria-root[role="grid"]').getAttribute('aria-rowcount'));
        simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the last page"]'));
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the previous page"]'));
            }
            const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
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
        } while (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the previous page"]').disabled == false)
        let failed = [];
        for (let i = 0; i < schools.length; i++) {
            if (!success[i]) {
                failed.push(schools[i]);
            }
        }
        const timer = setInterval(() => {
            let currentLength = parseInt(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('div.k-grid-aria-root[role="grid"]').getAttribute('aria-rowcount'));
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

function disableUser() {
    try {
        const mainDoc = document.getElementById("main-workspace");
        const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
        const disabled = innerDoc.getElementById('disabledRef');
        const date = innerDoc.querySelector(`[id^='datepicker-']`);
        //query added - 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'
        //query not added - 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
        simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the last page"]'));
        //Remove all roles
        let removedRoles = [];
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the previous page"]'));
            }
            const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (!title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                    removedRoles.push(title);
                }
            }
        } while (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the previous page"]').disabled == false)
        //add "*Disabled" role
        init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the previous page"]'));
            }
            const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                }
            }
        } while (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the previous page"]').disabled == false)
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
        let rolestr = removedRoles.join("\n");

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
        // console.log(e);
        alert("An Error Occurred. You may not be on the correct page or the account type does not allow user roles for access");
    }
}

function cleanupDisableUser() {
        try {
        const mainDoc = document.getElementById("main-workspace");
        const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
        const disabled = innerDoc.getElementById('disabledRef');
        const date = innerDoc.querySelector(`[id^='datepicker-']`);
        //query added - 'kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)'
        //query not added - 'kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted'
        simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the last page"]'));
        //Remove all roles
        let removedRoles = [];
        let init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the previous page"]'));
            }
            const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (!title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                    removedRoles.push(title);
                }
            }
        } while (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md:not(.ng-star-inserted)').querySelector('button[title="Go to the previous page"]').disabled == false)
        //add "*Disabled" role
        init = true;
        do {
            if (init) {
                init = false;
            } else {
                simulateClick(innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the previous page"]'));
            }
            const roles = innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('kendo-grid-list').querySelectorAll('td[role = "gridcell"]');
            for (let i = 0; i < roles.length; i++) {
                let title = roles[i].textContent;
                if (title.includes("*Disabled")) {
                    simulateClick(roles[i]);
                }
            }
        } while (innerDoc.querySelector('kendo-grid.selectable.k-grid.k-grid-md.ng-star-inserted').querySelector('button[title="Go to the previous page"]').disabled == false)
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
        return removedRoles.join(", ");
    } catch (e) {
        // console.log(e);
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
    return new File(arr, `cleanup${(new Date()).toLocaleDateString("en-US").replaceAll("/", "")}.csv`, {
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
        await new Promise((resolve) => setTimeout(resolve, 250))
        if (cont) {
            simulateClick(findSearchResult(data[i].EID));
            await new Promise((resolve => waitForCorrectFormLoad(data[i].EID, resolve)));
            await new Promise((resolve => waitForRoleLoad(resolve)));
            await new Promise((resolve) => setTimeout(resolve, 250));
            data[i].removedRoles = cleanupDisableUser();
            if (data[i].removedRoles.includes("*INV")) {
                failed.push(`${data[i].firstName} ${data[i].lastName} (${data[i].EID})`);
                data[i].removedRoles = "Failed: User has *INV";
            } else {
                await new Promise((resolve) => setTimeout(resolve, 800));
                clickSave();
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 2500));
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
        }
    }
);