let competitionName = document.getElementById('competitionName');
let groupName = document.getElementById('GroupName');
let asana = document.getElementById('asana');
let yss_id = document.getElementById('YSS_ID');
let increament = document.getElementById('tbody').children.length;
let tr_no = increament;
let tr_initial = 0;
let length = 0;
let global = false;
let global1 = false;


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

    // console.log(json1);
    // console.log(json2);
    // console.log(json3);
    // console.log(json4);
    // console.log(json5);
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
            'asana': asana.innerHTML
        })
    });
    let json = await response.json();
    // console.log(json);
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
                <th scope="row" class="table-success">${json[i].ChestNo}</th>
                <td class="table-primary">${json[i].ParticipantName}</td>
                <td class="${color[0]}">${json[i].J1 == -1 ? '<b>-</b>' : json[i].J1}</td>
                <td class="${color[1]}">${json[i].J2 == -1 ? '<b>-</b>' : json[i].J2}</td>
                <td class="${color[2]}">${json[i].J3 == -1 ? '<b>-</b>' : json[i].J3}</td>
                <td class="${color[3]}">${json[i].J4 == -1 ? '<b>-</b>' : json[i].J4}</td>
                <td class="${color[4]}">${json[i].J5 == -1 ? '<b>-</b>' : json[i].J5}</td>
                <td class="table-info">${marks}</td>
            </tr>`;

    }
}

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
}


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
            'asana': asana.innerHTML
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


var socket = io();
socket.on('markChangeNoCandidates', (data) => {
    if (global == false) {
        document.getElementById('next').removeAttribute('disabled');
    }
    console.warn(data.number + ' is performing.........');
    let tbody = document.getElementById('tbody');
    if (parseInt(data.number) > increament) {
        for (let i = tr_no; i < tbody.children.length && i < tr_no + (parseInt(data.number) - increament); i++) {
            tbody.children[i].style.display = 'table-row';
        }
    } else if (parseInt(data.number) < increament) {
        // console.log('TR NO - ' + tr_no);
        for (let i = (tr_initial < 0 ? parseInt(data.number) : tr_initial + parseInt(data.number)); i < tbody.children.length && i < tr_no; i++) {
            tbody.children[i].style.display = 'none';
        }
    }
    tr_no = tr_no + (parseInt(data.number) - increament);
    increament = parseInt(data.number);
    if (tr_no >= tbody.children.length) {
        document.getElementById('next').setAttribute('disabled', 'true');
    }
});

socket.on('changeAsanaToClient', function (data) {
    if(data.group == document.getElementById('GroupName').innerHTML && data.competitionName == document.getElementById('competitionName').innerHTML) {
        asana.innerHTML = data.asana;
    }
});

socket.on('nextToClient', (data) => {
    if(data.group == document.getElementById('GroupName').innerHTML && data.competitionName == document.getElementById('competitionName').innerHTML) {
        document.getElementById('next').click();
    }
});

socket.on('prevToClient', (data) => {
    if(data.group == document.getElementById('GroupName').innerHTML && data.competitionName == document.getElementById('competitionName').innerHTML) {
        document.getElementById('prev').click();
    }
});

socket.on('markAbsent', (data) => {
    console.log(data.group+"   "+data.competitionName);
    if(data.group == document.getElementById('GroupName').innerHTML && data.competitionName == document.getElementById('competitionName').innerHTML) {
        console.log('inside LOOPOAIODSUIEABUIVBUIADBVUIDBVIUewi');
        let tbody = document.getElementById('tbody');
        for (let ele of tbody.children) {
            if (ele.children[0].innerHTML == data.chestNo) {
                for (let td of ele.children) {
                    td.style.background = 'grey';
                }
            }
        }
    }
});

socket.on('markNotAbsent', (data) => {
    if(data.group == document.getElementById('GroupName').innerHTML && data.competitionName == document.getElementById('competitionName').innerHTML) {
        let tbody = document.getElementById('tbody');
        for (let ele of tbody.children) {
            if (ele.children[0].innerHTML == data.chestNo) {
                ele.children[0].style.background = 'rgb(209,231,221)';
                ele.children[1].style.background = 'rgb(207,226,255)';
                for (let i = 2; i < ele.children.length - 1; i++) {
                    if(ele.children[i].classList.contains('table-dark')) {
                        ele.children[i].style.background = 'rgb(33,37,41)';
                    } else {
                        ele.children[i].style.background = 'rgb(248,215,218)';
                    }
                }
                ele.children[ele.children.length - 1].style.background = 'rgb(207,244,252)';
            }
        }
    }
});

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

