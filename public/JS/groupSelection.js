let increament = document.getElementById('tableBody').children.length;
let tr_no = increament;
let tr_initial = 0;
let global = false;
// import { config } from "../../mysql_connection";

let xhr_fetch_table_data = new XMLHttpRequest();
let groupSelection = document.getElementById('groupSelection');
let tableBody = document.getElementById('tableBody');
let openBtn = document.getElementById('openBtn');
var tableBodyHtml = ``;
let competitionName = document.getElementById('competitionName');
let tableHeading = document.getElementById('tHeadAsanas');

competitionName.addEventListener('change', function () {
    var option = this.value;
    manipulateGroupSelection(option);
});

async function manipulateTableHeading() {
    let response = await fetch(`/getAsanaData?groupName=${groupSelection.value}&competitionName=${competitionName.value}`);
    let json = await response.json();
    var HTML = ``;
    for (var i = 0; i < json.length; i++) {
        HTML += `<th scope="col">${json[i].AsanaNo}</th>`;
    }
    tableHeading.innerHTML = HTML;
    return 'Done';
}

async function manipulateGroupSelection(value) {
    let response = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${value}'`
        })
    });
    let json = await response.json();
    console.log('--------------sPECIAL-----------------');
    console.log(json);
    console.log('--------------sPECIAL-----------------');
    let response1 = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: `SELECT * FROM ${json[0].YSS_ID.toLowerCase()}.judge_info WHERE YSS_ID = '${document.getElementById('yss_id').innerHTML}'`
        })
    });
    let json1 = await response1.json();
    console.log(json1);
    if (json1[0] == 1146) {
        groupSelection.innerHTML = `<option>No group found</option>`;
        judgeSelection.innerHTML = `<option>No judge found</option>`;
    } else {
        groupSelection.innerHTML = `<option>${json1[0].GroupName}</option>`;
        judgeSelection.innerHTML = `<option>${json1[0].JudgeNo}</option>`;
    }
}

async function manipulateCompetitionDropdown() {
    let response = await fetch('/getCompetitionData');
    let json = await response.json();
    var HTML = `<option value="Choose your Competition">Choose Your Competition</option>`;
    for (var i = 0; i < json.length; i++) {
        HTML += `<option value="${json[i].CompetitionName}">${json[i].CompetitionName}</option>`;
    }
    competitionName.innerHTML = HTML;
}

async function addMarks(id) {
    let competitionName1 = document.getElementById('competitionName').value;
    let groupName = document.getElementById('groupSelection').value;
    let judgeSelection = document.getElementById('judgeSelection').value;
    let chestNo = id.split(' ')[0];
    let asana = id.split(' ')[1];
    let markSelection = document.getElementById(id).value;
    if (markSelection != 'Number') {
        var response = await fetch('/insertJudgeData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'judgeName': document.getElementById('judgeName').innerHTML,
                'competitionName': competitionName1,
                'groupName': groupName,
                'judgeSelection': document.getElementById('judgeSelection').value.toLowerCase().replace(' ', ''),
                'markSelection': markSelection,
                'chestNo': chestNo,
                'asana': asana
            })
        });
        var text = await response.text();
        console.log(text);
    }
}


xhr_fetch_table_data.onreadystatechange = async function () {
    if (xhr_fetch_table_data.readyState === 4 && xhr_fetch_table_data.status === 200) {
        console.log(xhr_fetch_table_data.response);
        let response = await fetch(`/getAsanaData?groupName=${groupSelection.value}&competitionName=${competitionName.value}`);
        let json = await response.json();
        console.log(json);
        tableBody.innerHTML = "";
        tableBodyHtml = ``;
        var data = JSON.parse(xhr_fetch_table_data.response);
        for (let i = 0; i < data.length; i++) {
            var html = `<tr id="${i}"><th scope="row">${data[i].ChestNo}</th>`;
            for (let j = 0; j < json.length; j++) {
                html += `
                <td>
                <select class="form-select mark-entry" id="${data[i].ChestNo + ' ' + json[j].AsanaNo.replace(' ', '')}" aria-label="Default select example" onchange="addMarks('${data[i].ChestNo + ' ' + json[j].AsanaNo.replace(' ', '')}')">
                    <option value="Number" selected>Number</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="1.25">1.25</option>
                    <option value="1.5">1.5</option>
                    <option value="1.75">1.75</option>
                    <option value="2">2</option>
                    <option value="2.25">2.25</option>
                    <option value="2.5">2.5</option>
                    <option value="2.75">2.75</option>
                    <option value="3">3</option>
                    <option value="3.25">3.25</option>
                    <option value="3.5">3.5</option>
                    <option value="3.75">3.75</option>
                    <option value="4">4</option>
                    <option value="4.25">4.25</option>
                    <option value="4.5">4.5</option>
                    <option value="4.75">4.75</option>
                    <option value="5">5</option>
                    <option value="5.25">5.25</option>
                    <option value="5.5">5.5</option>
                    <option value="5.75">5.75</option>
                    <option value="6">6</option>
                    <option value="6.25">6.25</option>
                    <option value="6.5">6.5</option>
                    <option value="6.75">6.75</option>
                    <option value="7">7</option>
                    <option value="7.25">7.25</option>
                    <option value="7.5">7.5</option>
                    <option value="7.75">7.75</option>
                    <option value="8">8</option>
                    <option value="8.25">8.25</option>
                    <option value="8.5">8.5</option>
                    <option value="8.75">8.75</option>
                    <option value="9">9</option>
                    <option value="9.25">9.25</option>
                    <option value="9.5">9.5</option>
                    <option value="9.75">9.75</option>
                    <option value="10">10</option>
                </select>
            </td>
                `;
            }
            tableBodyHtml = tableBodyHtml + html;
            tableBody.innerHTML = tableBodyHtml;
        }
        increament = document.getElementById('tableBody').children.length;
        tr_no = increament;
        tr_initial = 0;
    }
}

openBtn.addEventListener('click', async (event) => {
    manipulateTableHeading();
    xhr_fetch_table_data.open('POST', '/getCandidateData', true);
    xhr_fetch_table_data.setRequestHeader('Content-Type', 'application/json');
    xhr_fetch_table_data.send(`{"groupName" : "${groupSelection.value}","competitionName":"${competitionName.value}"}`);
});

async function checkJudgeStatus() {
    let response = await fetch(`/checkJudgeStatusByJudgeAndGroup?competitionName=${competitionName.value}&group=${groupSelection.value}&judge=${document.getElementById('judgeSelection').value}`);
    let text = await response.text();
    console.log(text);
    console.log('dijvoi');
    let selections = document.getElementsByClassName('mark-entry');
    if (text == 'Saved') {
        for (let i = 0; i < selections.length; i++) {
            selections[i].setAttribute('disabled', 'true');
        }
    } else {
        for (let i = 0; i < selections.length; i++) {
            if (selections[i].hasAttribute('disabled') && selections[i].classList.contains('disabled') == false) {
                selections[i].removeAttribute('disabled');
            }
        }
    }
}

async function finalize() {
    let response1 = await fetch("/getYSS_IDByCompetitionName?competitionName=" + competitionName.value);
    let text1 = await response1.text();
    console.log(text1);
    let response2 = await fetch(`/changeStatus?yss_id=${text1}&command=Saved&group=${groupSelection.value}&judge=${document.getElementById('judgeSelection').value}`);
    let text2 = await response2.text();
    console.log(text2);
}

manipulateCompetitionDropdown();
const timer = setInterval(() => {
    let selects = document.getElementsByClassName('mark-entry')
    for (let ele of selects) {
        ele.addEventListener('click', (e) => {
            if (ele.classList.contains('blink-bg')) {
                ele.classList.remove('blink-bg');
            }
        });
    }
    checkJudgeStatus();
}, 1000);

var socket = io();
socket.on("markAbsent", function (data) {
    if(data.group == document.getElementById('groupSelection').value && data.competitionName == document.getElementById('competitionName').value) {
        console.log(data.chestNo + ' is absent.....');
        var id = Math.abs(parseInt(document.getElementById('0').children[0].innerHTML) - parseInt(data.chestNo));
        console.log(id);
        let tr = document.getElementById(id.toString());
        for (let i = 1; i < tr.children.length; i++) {
            tr.children[i].children[0].setAttribute('disabled', 'true');
            tr.children[i].children[0].classList.add('disabled');
        }
    }
});
socket.on('markNotAbsent', function (data) {
    if(data.group == document.getElementById('groupSelection').value && data.competitionName == document.getElementById('competitionName').value) {
        console.log(data.chestNo + ' is present.........');
        var id = Math.abs(parseInt(document.getElementById('0').children[0].innerHTML) - parseInt(data.chestNo));
        console.log(id);
        let tr = document.getElementById(id.toString());
        for (let i = 1; i < tr.children.length; i++) {
            tr.children[i].children[0].removeAttribute('disabled');
            tr.children[i].children[0].classList.remove('disabled');
        }
    }
});


function prev() {
    tr_no -= increament;
    tr_initial -= increament;
    document.getElementById('next').removeAttribute('disabled');
    if (tr_initial <= 0) {
        document.getElementById('prev').setAttribute('disabled', 'true');
    }
    let tbody = document.getElementById('tableBody');
    for (let i = 0; i < tr_initial; i++) {
        tbody.children[i].style.display = 'none';
    }
    for (let i = tr_no; i < tbody.children.length; i++) {
        tbody.children[i].style.display = 'none';
    }
    for (let i = (tr_initial < 0 ? 0 : tr_initial); i < tbody.children.length && i < tr_no; i++) {
        tbody.children[i].style.display = 'table-row';
    }
}

function next() {
    tr_no += increament;
    tr_initial += increament;
    let tbody = document.getElementById('tableBody');
    document.getElementById('prev').removeAttribute('disabled');
    if (tr_no >= tbody.children.length) {
        document.getElementById('next').setAttribute('disabled', 'true');
    }
    for (let i = 0; i < tr_initial; i++) {
        tbody.children[i].style.display = 'none';
    }
    for (let i = tr_no; i < tbody.children.length; i++) {
        tbody.children[i].style.display = 'none';
    }
    for (let i = tr_initial; i < tbody.children.length && i < tr_no; i++) {
        tbody.children[i].style.display = 'table-row';
    }
}


socket.on('markChangeNoCandidates', function (data) {
    if(data.group == document.getElementById('groupSelection').value && data.competitionName == document.getElementById('competitionName').value) {
        if (global == false) {
            document.getElementById('next').removeAttribute('disabled');
        }
        console.warn(data.number + ' is performing.........');
        let tbody = document.getElementById('tableBody');
        if (parseInt(data.number) > increament) {
            for (let i = tr_no; i < tbody.children.length && i < tr_no + (parseInt(data.number) - increament); i++) {
                tbody.children[i].style.display = 'table-row';
            }
        } else if (parseInt(data.number) < increament) {
            console.log('TR NO - ' + tr_no);
            for (let i = (tr_initial < 0 ? parseInt(data.number) : tr_initial + parseInt(data.number)); i < tbody.children.length && i < tr_no; i++) {
                tbody.children[i].style.display = 'none';
            }
        }
        tr_no = tr_no + (parseInt(data.number) - increament);
        increament = parseInt(data.number);
        if (tr_no >= tbody.children.length) {
            document.getElementById('next').setAttribute('disabled', 'true');
        }
    }
});

function disableTableRow() {
    let elements = document.querySelectorAll('tr.disabled');
    for (let ele of elements) {
        for (let i = 1; i < ele.children.length; i++) {
            ele.children[i].children[0].setAttribute('disabled', 'true');
            ele.children[i].children[0].classList.add('disabled');
        }
    }
}


function enableTableRow() {
    let elements = document.getElementById('tableBody').querySelectorAll('tr');
    for (let ele of elements) {
        for (let i = 1; i < ele.children.length; i++) {
            ele.children[i].children[0].removeAttribute('disabled');
            ele.children[i].children[0].classList.remove('disabled');
        }
    }
}




socket.on('messageToClientJudge', function (data) {
    if (data.judgeNo == document.getElementById('judgeSelection').value && data.groupName == document.getElementById('groupSelection').value && data.competitionName == document.getElementById('competitionName').value) {
        let tbody = document.getElementById('tableBody');
        let thead = document.getElementById('tHeadAsanas');
        let asanaNo = 0;
        for (let i = 0; i < thead.children.length; i++) {
            if (thead.children[i].innerHTML == data.asana) {
                asanaNo = i;
            }
        }
        for (let i = 0; i < tbody.children.length; i++) {
            if (tbody.children[i].children[0].innerHTML == data.chestNo) {
                tbody.children[i].children[asanaNo + 1].children[0].classList.add('blink-bg');
            }
        }
        let html = document.createElement('font');
        html.innerHTML = `Marks is <b>${data.markCriteria}</b><br>${data.message}`;
        swal({
            title: 'Marks Alert',
            content: html,
            icon: 'warning',
            buttons: {
                back: {
                    text: 'Go Back To Home Page',
                    value: 'back'
                }
            }
        }).then((result) => {
            if (result == 'back') {
                window.open('/home');
            }
        });
    }
});


