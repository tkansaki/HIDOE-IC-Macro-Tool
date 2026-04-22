function getSLInnerDoc() {
    const mainDoc = document.getElementById('main-workspace');
    const innerDoc = mainDoc.contentDocument || mainDoc.contentWindow.document;
    const innerEl = innerDoc.getElementById('frameWorkspace');
    return innerEl.contentDocument || innerEl.contentWindow.document;
}

function getSLInnerDoc2() {
    const innerDoc = getSLInnerDoc();
    const innerEl = innerDoc.getElementsByName("searchFrameResults")[0];
    return innerEl.contentDocument || innerEl.contentWindow.document;
}

function waitForStaffLocatorResults(resolve) {
    const timer = setInterval(() => {
        if (getSLInnerDoc2().querySelectorAll('tr').length > 0) {
            clearTimeout(timer);
            resolve();
        }
    }, 250);
}

async function verifySummerSchool(data) {
    let failed = [];
    let duplicates = [];
    for (let i = 0; i < data.length; i++) {
        getSLInnerDoc().getElementById("staffStateID").value = data[i][1];
        getSLInnerDoc().getElementById("staffStateID").dispatchEvent(new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true
        }));
        await new Promise((resolve) => waitForStaffLocatorResults(resolve));
        let rows = getSLInnerDoc2().querySelectorAll('tr');
        // results will always output 1 row
        if (rows.length === 1) {
            if (rows[0].innerHTML.includes("No matches found")) {
                failed.push(data[i]);
            }
        } else {
            duplicates.push(data[i]);
        }
    }
    let msg;
    if (failed.length < 1 && duplicates.length < 1) {
        msg = "All records found"
    } else {
        msg = "No Record Found: \n"
        for (let i = 0; i < failed.length; i++) {
            msg += `${failed[i][0]} (${failed[i][1]})\n`;
        }
        msg += "\nDuplicates Found: \n"
        for (let i = 0; i < duplicates.length; i++) {
            msg += `${duplicates[i][0]} (${duplicates[i][1]})\n`;
        }
    }
    alert(msg);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.oper == "SSverify") {
            verifySummerSchool(request.data);
        }
    }
);