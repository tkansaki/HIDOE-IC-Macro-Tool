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
            if (confirm(`Copy Removed Roles to Clipboard?/n/n${rolestr}`)) {
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.oper == "addCalendar") {
            addCalendar(request.schools, request.current, request.future, request.previous, request.SS);
        } else if (request.oper == "removeCalendar") {
            removeCalendar(request.schools, request.current, request.future, request.previous, request.SS);
        } else if (request.oper == "disableUser") {
            disableUser();
        }
    }
);