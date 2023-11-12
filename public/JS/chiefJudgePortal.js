let yss_admin_id = document.getElementById('yss_admin_id').innerHTML;
let group = document.getElementById('groupName').innerHTML;
let global = false;
let global1 = false;

async function manipulateCandidateList() {
    var sqlString = `SELECT * FROM ${yss_admin_id.toLowerCase()}.${group.replace(/ /g, '_').toLowerCase() + '_registration'}`;
    let response = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: sqlString
        })
    });
    let json = await response.json();
    console.log(json);
    let tbody_candidateList = document.getElementById('candidateList');
    for (let ele of json) {
        tbody_candidateList.innerHTML = tbody_candidateList.innerHTML +
            `<tr>
            <th scope="row">${ele.ChestNo}</th>
            <td>${ele.ParticipantName}</td>
            <td><div class="form-check">
            <input class="form-check-input" type="checkbox" value="" onclick="markAbsent(this.id)" id="${ele.ChestNo}">
          </div></td>
        </tr>`;
    }
}

manipulateCandidateList();

var socket = io();

function markAbsent(id) {
    if (document.getElementById(id).checked == true) {
        socket.emit('absent', { chestNo: id, group: document.getElementById('groupName').innerHTML, competitionName: document.getElementById('CompetitionName').innerHTML});
        let tbody = document.getElementById('tbody');
        for (let ele of tbody.children) {
            if (ele.children[0].innerHTML == id) {
                for (let td of ele.children) {
                    td.style.background = 'grey';
                }
            }
        }
    } else {
        socket.emit('notAbsent', { chestNo: id, group: document.getElementById('groupName').innerHTML, competitionName: document.getElementById('CompetitionName').innerHTML});
        let tbody = document.getElementById('tbody');
        for (let ele of tbody.children) {
            if (ele.children[0].innerHTML == id) {
                ele.children[0].style.background = 'rgb(209,231,221)';
                ele.children[1].style.background = 'rgb(207,226,255)';
                for (let i = 2; i < ele.children.length - 1; i++) {
                    if (ele.children[i].classList.contains('table-dark')) {
                        ele.children[i].style.background = 'rgb(33,37,41)';
                    } else {
                        ele.children[i].style.background = 'rgb(248,215,218)';
                    }
                }
                ele.children[ele.children.length - 1].style.background = 'rgb(207,244,252)';
            }
        }
    }
}






let yss_id = document.getElementById('yss_admin_id');

async function getAsanaByYSS_ID() {
    var sql_string = `SELECT * FROM ${yss_id.innerHTML.toLowerCase()}.asanas WHERE GroupName = '${group}'`;
    let response = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: sql_string
        })
    });
    let json = await response.json();
    let ele = document.getElementById('asana');
    for (let i of json) {
        ele.innerHTML = ele.innerHTML +
            `<option>${i.AsanaNo}</option>`;
    }
    document.getElementById('asana').children[0].setAttribute('selected', "true");
}

getAsanaByYSS_ID();



let competitionName = document.getElementById('CompetitionName');
let groupName = document.getElementById('groupName');
let asana = document.getElementById('asana');
let increament = document.getElementById('tbody').children.length;
let tr_no = increament;
let tr_initial = 0;
let length = 0;


async function getJudgeNameByGroupName() {
    let response1 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge1'
        })
    });
    let json1 = await response1.json();

    let response2 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge2'
        })
    });
    let json2 = await response2.json();

    let response3 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge3'
        })
    });
    let json3 = await response3.json();

    let response4 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge4'
        })
    });
    let json4 = await response4.json();

    let response5 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge5'
        })
    });
    let json5 = await response5.json();

    console.log(json1);
    console.log(json2);
    console.log(json3);
    console.log(json4);
    console.log(json5);
    if (json1.length == 0) {
        document.getElementById("display-table").innerHTML = '<h1 style="color:white" align="center">No candidate in this Group</h1>'
    } else {
        let thead = document.getElementById('thead');
        thead.innerHTML = '';
        thead.innerHTML = thead.innerHTML +
            `<th scope="col" class="table-success">Chest No</th>
        <th scope="col" class="table-primary">Candidate Name</th>
        <th scope="col">Judge 1<br>(${json1[0].JudgeName})</th>
        <th scope="col">Judge 2<br>(${json2[0].JudgeName})</th>
        <th scope="col">Judge 3<br>(${json3[0].JudgeName})</th>
        <th scope="col">Judge 4<br>(${json4[0].JudgeName})</th>
        <th scope="col">Judge 5<br>(${json5[0].JudgeName})</th>
        <th scope="col" class="table-info">Marks</th>`;
    }


    let response = await fetch('/getMarksDataByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'asana': asana.value
        })
    });
    let json = await response.json();
    console.log(json);
    length = json.length;
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.length; i++) {
        let color = [];
        let max_num = Math.max(Math.max(json[i].J1, json[i].J2), Math.max(json[i].J3, json[i].J4), json[i].J5);
        let min_num = Math.min(Math.min(json[i].J1, json[i].J2), Math.min(json[i].J3, json[i].J4), json[i].J5);
        let marks = json[i].J1 + json[i].J2 + json[i].J3 + json[i].J4 + json[i].J5 - max_num - min_num;
        if (json[i].J1 == -1 || json[i].J2 == -1 || json[i].J3 == -1 || json[i].J4 == -1 || json[i].J5 == -1) {
            marks = '<b>-</b>';
        } else {
            var maxIDX = [json[i].J1, json[i].J2, json[i].J3, json[i].J4, json[i].J5].indexOf(max_num);
            var minIDX = [json[i].J1, json[i].J2, json[i].J3, json[i].J4, json[i].J5].indexOf(min_num);

            for (var j = 0; j < 5; j++) {
                if (j == maxIDX || j == minIDX) {
                    color.push('table-dark');
                } else {
                    color.push('table-danger');
                }
            }
        }
        tbody.innerHTML = tbody.innerHTML +
            `<tr>
                <th scope="row" class="table-success" id="${i}-0">${json[i].ChestNo}</th>
                <td class="table-primary" id="${i}-1">${json[i].ParticipantName}</td>
                <td class="${color[0]}" id="${i}-2" onclick="sendMessage(this.id)">${json[i].J1 == -1 ? '<b>-</b>' : json[i].J1}</td>
                <td class="${color[1]}" id="${i}-3" onclick="sendMessage(this.id)">${json[i].J2 == -1 ? '<b>-</b>' : json[i].J2}</td>
                <td class="${color[2]}" id="${i}-4" onclick="sendMessage(this.id)">${json[i].J3 == -1 ? '<b>-</b>' : json[i].J3}</td>
                <td class="${color[3]}" id="${i}-5" onclick="sendMessage(this.id)">${json[i].J4 == -1 ? '<b>-</b>' : json[i].J4}</td>
                <td class="${color[4]}" id="${i}-6" onclick="sendMessage(this.id)">${json[i].J5 == -1 ? '<b>-</b>' : json[i].J5}</td>
                <td class="table-info" id="${i}-7">${marks}</td>
            </tr>`;

    }
}

function sendMessage(id) {
    console.log(id);
    let modal = document.getElementById('messageWindow');
    let chestNoInput = document.getElementById('chestNoInput');
    let judgeNoInput = document.getElementById('judgeNoInput');
    let first_chestNo = parseInt(document.getElementById('tbody').children[0].children[0].innerHTML);
    let chestNo = first_chestNo + parseInt(id.split('-')[0]);
    let judgeNo = parseInt(id.split('-')[1]) - 1;
    console.log('Judge' + judgeNo);
    chestNoInput.value = chestNo;
    judgeNoInput.value = 'Judge ' + judgeNo;
    document.getElementById('groupNameInput').value = group;
    document.getElementById('competitionNameInput').value = document.getElementById('CompetitionName').innerHTML;
    modal.style.display = 'block';
}

document.getElementsByClassName('close')[0].addEventListener('click', (e) => {
    let modal = document.getElementById('messageWindow');
    modal.style.display = 'none';
});

document.getElementById('close-btn').addEventListener('click', (e) => {
    let modal = document.getElementById('messageWindow');
    modal.style.display = 'none';
});

document.getElementById('send-request').addEventListener('click', (e) => {
    socket.emit('messageToServer', { judgeNo: document.getElementById('judgeNoInput').value, chestNo: document.getElementById('chestNoInput').value, markCriteria: document.getElementById('criteria').value, message: document.getElementById('additionalMessage').value, groupName: document.getElementById('groupNameInput').value, competitionName: document.getElementById('competitionNameInput').value, asana: document.getElementById('asana').value });
});


function prev() {
    tr_no -= increament;
    tr_initial -= increament;
    document.getElementById('next').removeAttribute('disabled');
    if (tr_initial <= 0) {
        document.getElementById('prev').setAttribute('disabled', 'true');
    }
    let tbody = document.getElementById('tbody');
    for (let i = 0; i < tr_initial; i++) {
        tbody.children[i].style.display = 'none';
    }
    for (let i = tr_no; i < tbody.children.length; i++) {
        tbody.children[i].style.display = 'none';
    }
    for (let i = (tr_initial < 0 ? 0 : tr_initial); i < tbody.children.length && i < tr_no; i++) {
        tbody.children[i].style.display = 'table-row';
    }
    socket.emit('prevToServer', {group: document.getElementById('groupName').innerHTML, competitionName: document.getElementById('CompetitionName').innerHTML});
}

function next() {
    tr_no += increament;
    tr_initial += increament;
    let tbody = document.getElementById('tbody');
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
    socket.emit('nextToServer', {group: document.getElementById('groupName').innerHTML, competitionName: document.getElementById('CompetitionName').innerHTML});
}

document.getElementById('saveBtn').addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('changeNoCandidates', { number: document.getElementById('noCandidates').value, group: document.getElementById('groupName').innerHTML, competitionName: document.getElementById('CompetitionName').innerHTML})
    if (global == false) {
        document.getElementById('next').removeAttribute('disabled');
    }
    console.warn(document.getElementById('noCandidates').value + ' is performing.........');
    let tbody = document.getElementById('tbody');
    if (parseInt(document.getElementById('noCandidates').value) > increament) {
        for (let i = tr_no; i < tbody.children.length && i < tr_no + (parseInt(document.getElementById('noCandidates').value) - increament); i++) {
            tbody.children[i].style.display = 'table-row';
        }
    } else if (parseInt(document.getElementById('noCandidates').value) < increament) {
        console.log('TR NO - ' + tr_no);
        for (let i = (tr_initial < 0 ? parseInt(document.getElementById('noCandidates').value) : tr_initial + parseInt(document.getElementById('noCandidates').value)); i < tbody.children.length && i < tr_no; i++) {
            tbody.children[i].style.display = 'none';
        }
    }
    tr_no = tr_no + (parseInt(document.getElementById('noCandidates').value) - increament);
    increament = parseInt(document.getElementById('noCandidates').value);
    if (tr_no >= tbody.children.length) {
        document.getElementById('next').setAttribute('disabled', 'true');
    }
});





async function updateTable() {
    let response1 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge1'
        })
    });
    let json1 = await response1.json();

    let response2 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge2'
        })
    });
    let json2 = await response2.json();

    let response3 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge3'
        })
    });
    let json3 = await response3.json();

    let response4 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge4'
        })
    });
    let json4 = await response4.json();

    let response5 = await fetch('/getJudgeNameByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'judge': 'judge5'
        })
    });
    let json5 = await response5.json();

    // console.log(json1);
    // console.log(json2);
    // console.log(json3);
    // console.log(json4);
    // console.log(json5);
    if (json1.length == 0) {
        document.getElementById("display-table").innerHTML = '<h1 style="color:white" align="center">No candidate in this Group</h1>'
    } else {
        let thead = document.getElementById('thead');
        thead.children[2].innerHTML = `Judge 1<br>(${json1[0].JudgeName})`;
        thead.children[3].innerHTML = `Judge 2<br>(${json2[0].JudgeName})`;
        thead.children[4].innerHTML = `Judge 3<br>(${json3[0].JudgeName})`;
        thead.children[5].innerHTML = `Judge 4<br>(${json4[0].JudgeName})`;
        thead.children[6].innerHTML = `Judge 5<br>(${json5[0].JudgeName})`;
    }
    // console.log(document.getElementById('tbody').innerHTML);

    let response = await fetch('/getMarksDataByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'asana': asana.value
        })
    });
    let json = await response.json();
    // console.log(json);
    length = json.length;
    let tbody = document.getElementById('tbody');
    for (var i = 0; i < json.length; i++) {
        let color = [];
        let max_num = Math.max(Math.max(json[i].J1, json[i].J2), Math.max(json[i].J3, json[i].J4), json[i].J5);
        let min_num = Math.min(Math.min(json[i].J1, json[i].J2), Math.min(json[i].J3, json[i].J4), json[i].J5);
        let marks = json[i].J1 + json[i].J2 + json[i].J3 + json[i].J4 + json[i].J5 - max_num - min_num;
        if (json[i].J1 == -1 || json[i].J2 == -1 || json[i].J3 == -1 || json[i].J4 == -1 || json[i].J5 == -1) {
            marks = '<b>-</b>';
        } else {
            var maxIDX = [json[i].J1, json[i].J2, json[i].J3, json[i].J4, json[i].J5].indexOf(max_num);
            var minIDX = [json[i].J1, json[i].J2, json[i].J3, json[i].J4, json[i].J5].indexOf(min_num);

            for (var j = 0; j < 5; j++) {
                if (j == maxIDX || j == minIDX) {
                    color.push('table-dark');
                } else {
                    color.push('table-danger');
                }
            }
        }

        tbody.children[i].children[0].innerHTML = json[i].ChestNo;
        tbody.children[i].children[1].innerHTML = json[i].ParticipantName;
        tbody.children[i].children[2].innerHTML = `${json[i].J1 == -1 ? '<b>-</b>' : json[i].J1}`;
        tbody.children[i].children[3].innerHTML = `${json[i].J2 == -1 ? '<b>-</b>' : json[i].J2}`;
        tbody.children[i].children[4].innerHTML = `${json[i].J3 == -1 ? '<b>-</b>' : json[i].J3}`;
        tbody.children[i].children[5].innerHTML = `${json[i].J4 == -1 ? '<b>-</b>' : json[i].J4}`;
        tbody.children[i].children[6].innerHTML = `${json[i].J5 == -1 ? '<b>-</b>' : json[i].J5}`;
        tbody.children[i].children[2].className = color[0];
        tbody.children[i].children[3].className = color[1];
        tbody.children[i].children[4].className = color[2];
        tbody.children[i].children[5].className = color[3];
        tbody.children[i].children[6].className = color[4];
    }
}



document.getElementById('asana').addEventListener('change', (e) => {
    socket.emit('changeAsanaToServer', { asana: document.getElementById('asana').value, group: document.getElementById('groupName').innerHTML, competitionName: document.getElementById('CompetitionName').innerHTML });
})


getJudgeNameByGroupName();

const timer = setInterval(() => {
    if (document.getElementById('tbody').children.length > 0) {
        updateTable();
    }
    if (global1 == false && document.getElementById('tbody').children.length > 0) {
        increament = document.getElementById('tbody').children.length;
        tr_no = increament;
        tr_initial = 0;
        global1 = true;
    }
}, 1000);
