let groupName1 = document.getElementById('groupName1');
let groupName2 = document.getElementById('groupName2');
let groupName3 = document.getElementById('groupName3');
let groupSelection = document.getElementById("groupSelection");
let competitionName = document.getElementById('competitionName');
let openScoresheet = document.getElementById('openScoresheet');
let openLeaderBoard = document.getElementById('openLeaderBoard');

openLeaderBoard.addEventListener('click', () => {
    window.open(`/displayLeaderboard?YSS_ID=${document.getElementById('YSS_ID').innerHTML}&GroupName=${groupName2.value}&CompetitionName=${competitionName.innerHTML}`);
});

openScoresheet.addEventListener('click', (e) => {
    window.open(`/displayScoresheet?YSS_ID=${document.getElementById('YSS_ID').innerHTML}&GroupName=${groupName1.value}&CompetitionName=${competitionName.innerHTML}&asana=${document.getElementById('asana1').value}`);
});


async function getGroupByCompetitionName3() {
    let response = await fetch('/getGroupByCompetitionName?competitionName=' + competitionName.innerHTML);
    let json = await response.json();

    for (let i = 0; i < json.length; i++) {
        groupSelection.innerHTML = groupSelection.innerHTML + `<option>${json[i].GroupName}</option>`;
    }
}

async function getGroupByCompetitionName2() {
    let response = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: `SELECT YSS_ID FROM yoga_scoring_system.judge`
        })
    });
    let json = await response.json();

    for (let i = 0; i < json.length; i++) {
        groupName3.innerHTML = groupName3.innerHTML + `<option>${json[i].YSS_ID}</option>`;
    }
}

async function getGroupByCompetitionName1() {
    let response = await fetch('/getGroupByCompetitionName?competitionName=' + competitionName.innerHTML);
    let json = await response.json();

    for (let i = 0; i < json.length; i++) {
        groupName2.innerHTML = groupName2.innerHTML + `<option>${json[i].GroupName}</option>`;
    }
}

async function getGroupByCompetitionName() {
    let response = await fetch('/getGroupByCompetitionName?competitionName=' + competitionName.innerHTML);
    let json = await response.json();
    for (let i = 0; i < json.length; i++) {
        groupName1.innerHTML = groupName1.innerHTML + `<option>${json[i].GroupName}</option>`;
    }
}

async function getAsanaByGroupName() {
    let response = await fetch('/getAsanaByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': document.getElementById('YSS_ID').innerHTML,
            'groupName': groupName1.value
        })
    });
    let json = await response.json();
    let asana = document.getElementById('asana1');
    asana.innerHTML = '';
    for (var i = 0; i < json.length; i++) {
        asana.innerHTML = asana.innerHTML + `<option>${json[i].AsanaNo}</option>`;
    }
}

async function toggleStatus(id) {
    if (document.getElementById(id).innerHTML == 'Lock') {
        let response = await fetch('/changeStatus?group=' + id.split('---')[0] + '&judge=' + id.split('---')[1] + '&command=' + 'Saved' + '&yss_id=' + document.getElementById('YSS_ID').innerHTML);
        let text = await response.text();
        console.log(text);
        document.getElementById(id).innerHTML = 'Unlock';
    } else {
        let response = await fetch('/changeStatus?group=' + id.split('---')[0] + '&judge=' + id.split('---')[1] + '&command=' + 'Editing' + '&yss_id=' + document.getElementById('YSS_ID').innerHTML);
        let text = await response.text();
        console.log(text);
        document.getElementById(id).innerHTML = 'Lock';
    }
}


async function manipulate_tbody() {
    let tbody_status = document.getElementById('tbody-status');
    let response = await fetch('/getJudgeStatus?yss_id=' + document.getElementById('YSS_ID').innerHTML);
    let json = await response.json();
    console.log(json);
    for (let i = 1; i <= json.length; i++) {
        if ((i - 1) % 5 == 0) {
            tbody_status.innerHTML = tbody_status.innerHTML +
                `<tr>
            <th scope="row" class="table-info" style="text-align: center;vertical-align: middle;font-size: 30px;" rowspan="5">${json[i - 1].GroupName}</th>
            <td>${json[i - 1].JudgeNo}</td>
            <td id="Status---${json[i - 1].GroupName}---${json[i - 1].JudgeNo}">${json[i - 1].Status}</td>
            <td><button class="btn btn-primary" id="${json[i - 1].GroupName}---${json[i - 1].JudgeNo}" onclick="toggleStatus(this.id)">Lock</button></td>
          </tr>`;
        } else {
            tbody_status.innerHTML = tbody_status.innerHTML +
                `<tr>
            <td>${json[i - 1].JudgeNo}</td>
            <td id="Status---${json[i - 1].GroupName}---${json[i - 1].JudgeNo}">${json[i - 1].Status}</td>
            <td><button class="btn btn-primary" id="${json[i - 1].GroupName}---${json[i - 1].JudgeNo}" onclick="toggleStatus(this.id)">Lock</button></td>
          </tr>`;
        }
    }
}

async function updateStatus() {
    let tbody_status = document.getElementById('tbody-status');
    let response = await fetch('/getJudgeStatus?yss_id=' + document.getElementById('YSS_ID').innerHTML);
    let json = await response.json();
    console.log(json);
    for (let i = 1; i <= json.length; i++) {
        if ((i - 1) % 5 == 0) {
            tbody_status.children[i - 1].children[2].innerHTML = json[i - 1].Status;
            tbody_status.children[i - 1].children[3].children[0].innerHTML = json[i - 1].Status == 'Editing' ? 'Lock' : 'Unlock';
            if (json[i - 1].Status == 'Editing') {
                tbody_status.children[i - 1].classList.add('table-danger');
                if (tbody_status.children[i - 1].classList.contains('table-success')) {
                    tbody_status.children[i - 1].classList.remove('table-success');
                }
            } else {
                tbody_status.children[i - 1].classList.add('table-success');
                if (tbody_status.children[i - 1].classList.contains('table-danger')) {
                    tbody_status.children[i - 1].classList.remove('table-danger');
                }
            }
        } else {
            tbody_status.children[i - 1].children[1].innerHTML = json[i - 1].Status;
            tbody_status.children[i - 1].children[2].children[0].innerHTML = json[i - 1].Status == 'Editing' ? 'Lock' : 'Unlock';
            if (json[i - 1].Status == 'Editing') {
                tbody_status.children[i - 1].classList.add('table-danger');
                if (tbody_status.children[i - 1].classList.contains('table-success')) {
                    tbody_status.children[i - 1].classList.remove('table-success');
                }
            } else {
                tbody_status.children[i - 1].classList.add('table-success');
                if (tbody_status.children[i - 1].classList.contains('table-danger')) {
                    tbody_status.children[i - 1].classList.remove('table-danger');
                }
            }
        }
    }
}

document.getElementById('closeCompetition').addEventListener('click', async (e) => {
    let sql_string = `UPDATE yoga_scoring_system.yoga_competitions SET Status = 'Past' WHERE YSS_ID = '${document.getElementById('YSS_ID').innerHTML.toLowerCase()}'`;
    let rep = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: sql_string
        })
    });
    let txt = await rep.json();
    let response5 = await fetch('/getGroupByCompetitionName?competitionName=' + competitionName.innerHTML);
    let json5 = await response5.json();
    for (let z = 0; z < json5.length; z++) {
        let response1 = await fetch(`/getAsanaByGroupName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'YSS_ID': document.getElementById('YSS_ID').innerHTML,
                'groupName': json5[z].GroupName
            })
        });
        let json1 = await response1.json();
        console.log(json1);

        let response = await fetch('/getMarksDataByGroupName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'YSS_ID': document.getElementById('YSS_ID').innerHTML,
                'groupName': json5[z].GroupName,
                'asana': json1[0].AsanaNo
            })
        });
        let json2 = await response.json();
        console.log(json2);
        length = json2.length;
        let candidateData = [];
        for (var i = 0; i < json2.length; i++) {
            var data = [];
            candidateData.push([json2[i].ChestNo, json2[i].ParticipantName]);
            for (var k = 0; k < json1.length; k++) {
                let response = await fetch('/getMarksDataByGroupName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'YSS_ID': document.getElementById('YSS_ID').innerHTML,
                        'groupName': json5[z].GroupName,
                        'asana': json1[k].AsanaNo
                    })
                });
                let json = await response.json();
                console.log(json);

                let max_num = Math.max(Math.max(json[i].J1, json[i].J2), Math.max(json[i].J3, json[i].J4), json[i].J5);
                let min_num = Math.min(Math.min(json[i].J1, json[i].J2), Math.min(json[i].J3, json[i].J4), json[i].J5);
                let marks1 = json[i].J1 + json[i].J2 + json[i].J3 + json[i].J4 + json[i].J5 - max_num - min_num;
                if (json[i].J1 == -1 || json[i].J2 == -1 || json[i].J3 == -1 || json[i].J4 == -1 || json[i].J5 == -1) {
                    marks1 = '-';
                }
                data.push(marks1);
                candidateData[i].push(marks1);
            }
            console.log(data);
            if (data.indexOf('-') == -1) {
                let sum = 0;
                for (let n = 0; n < data.length; n++) {
                    sum += data[n];
                }
                candidateData[i].push(sum);
            } else {
                let sliced = candidateData.splice(i, 1);
            }
        }

        console.log(candidateData);

        let candidateData_sorted = [...candidateData].sort((a, b) => {
            if (a[a.length - 1] > b[b.length - 1]) {
                return -1;
            } else if (a[a.length - 1] < b[b.length - 1]) {
                return 1;
            } else {
                let compulsory_sum_a = 0;
                let compulsory_sum_b = 0;
                let idx = 0;
                while (idx < json1.length && json1[idx].AsanaNo.split(' ')[0] == 'Compulsory') {
                    idx++;
                }
                let i = 2;
                for (i = 2; i < idx + 2; i++) {
                    compulsory_sum_a += a[i];
                    compulsory_sum_b += b[i];
                }
                if (compulsory_sum_a > compulsory_sum_b) {
                    return -1;
                } else if (compulsory_sum_a < compulsory_sum_b) {
                    return 1;
                } else {
                    let optional_sum_a = 0;
                    let optional_sum_b = 0;
                    while (idx < json1.length && json1[idx].AsanaNo.split(' ')[0] == 'Optional') {
                        idx++;
                    }
                    for (i; i < idx; i++) {
                        optional_sum_a += a[i];
                        optional_sum_b += b[i];
                    }
                    if (optional_sum_a > optional_sum_b) {
                        return -1;
                    } else if (optional_sum_b > optional_sum_a) {
                        return 1;
                    }
                }
            }
        });
        console.log('-----------SPECIAL-------------------');
        console.log(candidateData_sorted);
        console.log('-----------SPECIAL-------------------');
        let response6 = await fetch('/updateLeaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'candidateData_sorted': candidateData_sorted,
                'YSS_ID': document.getElementById('YSS_ID').innerHTML,
                'group': json5[z].GroupName
            })
        });
        let text6 = await response6.text();
        console.log(text6);
    }
    let html = document.createElement('font');
    html.innerHTML = `<b>Your Competition is successfully closed</b>`;
    swal({
        title: 'Request Successful',
        content: html,
        icon: 'success',
        buttons: {
            back: {
                text: 'Go Back',
                value: 'back'
            }
        }
    }).then((result) => {
        if (result == 'back') {
            window.open('/home');
        }
    });
});


async function manipulate_tbody_judge_info() {
    let response = await fetch('/getGroupByCompetitionName?competitionName=' + competitionName.innerHTML);
    let json = await response.json();
    let response1 = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: `SELECT YSS_ID FROM yoga_scoring_system.judge`
        })
    });
    let yss_ids = await response1.json();
    let html = `<option>No Judge</option>`;
    for (let ele of yss_ids) {
        html += `<option value="${ele.YSS_ID}">${ele.YSS_ID}</option>`;
    }
    let tbody_judge_info = document.getElementById('tbody-judge-info');
    for (let ele of json) {
        tbody_judge_info.innerHTML = tbody_judge_info.innerHTML +
            `<tr>
            <th scope="row">Judge 1</th>
            <td>${ele.GroupName}</td>
            <td><select class="form-select" id="YSSINPUT${json.indexOf(ele)}1" aria-label="Default select example">${html}</select></td>
        </tr>`;
        tbody_judge_info.innerHTML = tbody_judge_info.innerHTML +
            `<tr>
            <th scope="row">Judge 2</th>
            <td>${ele.GroupName}</td>
            <td><select class="form-select" id="YSSINPUT${json.indexOf(ele)}2" aria-label="Default select example">${html}</select></td>
        </tr>`;
        tbody_judge_info.innerHTML = tbody_judge_info.innerHTML +
            `<tr>
            <th scope="row">Judge 3</th>
            <td>${ele.GroupName}</td>
            <td><select class="form-select" id="YSSINPUT${json.indexOf(ele)}3" aria-label="Default select example">${html}</select></td>
        </tr>`;
        tbody_judge_info.innerHTML = tbody_judge_info.innerHTML +
            `<tr>
            <th scope="row">Judge 4</th>
            <td>${ele.GroupName}</td>
            <td><select class="form-select" id="YSSINPUT${json.indexOf(ele)}4" aria-label="Default select example">${html}</select></td>
        </tr>`;
        tbody_judge_info.innerHTML = tbody_judge_info.innerHTML +
            `<tr>
            <th scope="row">Judge 5</th>
            <td>${ele.GroupName}</td>
            <td><select class="form-select" id="YSSINPUT${json.indexOf(ele)}5" aria-label="Default select example">${html}</select></td>
        </tr>`;
    }
}

document.getElementById('setJudgeDetails').addEventListener('click', async (e) => {
    let tbody_judge_info = document.getElementById('tbody-judge-info');
    let judge_data = [];
    for (let ele of tbody_judge_info.children) {
        judge_data.push({
            judgeNo: ele.children[0].innerHTML,
            group: ele.children[1].innerHTML,
            yss_id: ele.children[2].children[0].value
        });
    }
    let response = await fetch('/setJudgeDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            YSS_ID: document.getElementById('YSS_ID').innerHTML,
            data: judge_data
        })
    });
    let text = await response.text();
    console.log(text);
    if (text == 'SUCCESS') {
        let html = document.createElement('font');
        html.innerHTML = `<b>Details saved successfully</b>`;
        swal({
            title: 'Request Successful',
            content: html,
            icon: 'success',
            buttons: {
                back: {
                    text: 'Go Back',
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


async function manipulate_tbody_chief_judge_info() {
    let response = await fetch('/getGroupByCompetitionName?competitionName=' + competitionName.innerHTML);
    let json = await response.json();
    let response1 = await fetch('/sqlRunner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sql: `SELECT YSS_ID FROM yoga_scoring_system.judge`
        })
    });
    let yss_ids = await response1.json();
    let html = `<option>No Judge</option>`;
    for (let ele of yss_ids) {
        html += `<option value="${ele.YSS_ID}">${ele.YSS_ID}</option>`;
    }
    let tbody_judge_info = document.getElementById('tbody-chief-judge-info');
    for (let ele of json) {
        tbody_judge_info.innerHTML = tbody_judge_info.innerHTML +
            `<tr>
            <td>${ele.GroupName}</td>
            <td><select class="form-select" id="YSSINPUT${json.indexOf(ele)}" aria-label="Default select example">${html}</select></td>
        </tr>`;
    }
}


document.getElementById('setChiefJudgeInfo').addEventListener('click', async (e) => {
    let tbody_judge_info = document.getElementById('tbody-chief-judge-info');
    let judge_data = [];
    for (let ele of tbody_judge_info.children) {
        judge_data.push({
            group: ele.children[0].innerHTML,
            yss_id: ele.children[1].children[0].value
        });
    }
    let response = await fetch('/setChiefJudgeDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            YSS_ID: document.getElementById('YSS_ID').innerHTML,
            data: judge_data
        })
    });
    let text = await response.text();
    console.log(text);
    if (text == 'SUCCESS') {
        let html = document.createElement('font');
        html.innerHTML = `<b>Details saved successfully</b>`;
        swal({
            title: 'Request Successful',
            content: html,
            icon: 'success',
            buttons: {
                back: {
                    text: 'Go Back',
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

document.getElementById('showCandidateList').addEventListener('click', async (e) => {
    // let response1 = await fetch('/removePK',{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         'YSS_ID': document.getElementById('YSS_ID').innerHTML.toLowerCase(),
    //         'group': document.getElementById('groupSelection').value.replace(/ /g,'_').toLowerCase()+'_registration'
    //     })
    // });
    // let json1 = await response1.text();
    let tbody_candidates = document.getElementById('tbody-candidates');
    tbody_candidates.innerHTML = '';
    let sql_string = `SELECT * FROM ${document.getElementById('YSS_ID').innerHTML.toLowerCase()}.${document.getElementById('groupSelection').value.replace(/ /g, '_').toLowerCase() + '_registration'}`;
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
    for (let ele of json) {
        tbody_candidates.innerHTML = tbody_candidates.innerHTML +
            `<tr>
            <th scope="row">${ele.ChestNo}</th>
            <td>${ele.YSS_ID}</td>
            <td>${ele.ParticipantName}</td>
            <td>${ele.Organisation}</td>
            <td>${ele.Sex}</td>
            <td style="display:none;">${ele.DOB.split('T')[0]}</td>
        </tr>`;
    }
});

document.getElementById('updateStartChestNoBtn').addEventListener('click', async (e) => {
    let response = await fetch('/updateStartChestNo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': document.getElementById('YSS_ID').innerHTML.toLowerCase(),
            'group': document.getElementById('groupSelection').value.replace(/ /g, '_').toLowerCase() + '_registration',
            'startChestNo': parseInt(document.getElementById('startingChestNo').value)
        })
    });
    let text = await response.text();
});

document.getElementById('shuffle').addEventListener('click', async (e) => {
    let arr = [];
    let tbody_candidates = document.getElementById('tbody-candidates');
    for (let ele of tbody_candidates.children) {
        arr.push([]);
        for (let td of ele.children) {
            arr[arr.length - 1].push(td.innerHTML);
        }
    }
    console.log(arr);
    arr.sort((a, b) => {
        let ops = [-1, 0, 1];
        let rand_idx = Math.floor(Math.random() * ops.length);
        return ops[rand_idx];
    });
    console.log(arr);
    for (let i = 0; i < tbody_candidates.children.length; i++) {
        for (let j = 0; j < tbody_candidates.children[i].children.length; j++) {
            tbody_candidates.children[i].children[j].innerHTML = arr[i][j];
        }
    }
    // var sql_string1 = `TRUNCATE ${document.getElementById('YSS_ID').innerHTML.toLowerCase()}.${document.getElementById('groupSelection').value.replace(/ /g,'_').toLowerCase()+'_registration'}`;
    // let response = await fetch('/sqlRunner',{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         sql: sql_string1
    //     })
    // });
    // let json = await response.text();
    var response = await fetch('/shuffleCandidateData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': document.getElementById('YSS_ID').innerHTML.toLowerCase(),
            'group': document.getElementById('groupSelection').value.replace(/ /g, '_').toLowerCase() + '_registration',
            'groupName': document.getElementById('groupSelection').value,
            'data': arr
        })
    });
    let text = await response.text();
    // for(let i = 0;i < arr.length;i++) {
    //     alert('idbuibf');
    //     var sql_string2 = `INSERT INTO ${document.getElementById('YSS_ID').innerHTML.toLowerCase()}.${document.getElementById('groupSelection').value.replace(/ /g,'_').toLowerCase()+'_registration'} VALUES(${arr[i][0]},'${arr[i][1]}','${arr[i][2]}','${arr[i][5]}','${arr[i][3]}','${arr[i][4]}','${document.getElementById('groupSelection').value}')`;
    //     var response1 = await fetch('/sqlRunner',{
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             sql: sql_string2
    //         })
    //     });
    //     let json1 = await response1.text(); 
    // }
})

async function manipulate_judge_table() {
    let response = await fetch('/getJudgementGroupDetails?YSS_ID=' + document.getElementById('YSS_ID').innerHTML);
    let json = await response.json();
    if (JSON.stringify(json) != 'NO_TABLE_ERR') {
        let judge_table = document.getElementById('tbody-judge-info');
        for (let i = 0; i < json.length && judge_table.children.length; i++) {
            judge_table.children[i].children[2].children[0].value = json[i].YSS_ID;
        }
    }
}

async function manipulate_chief_judge_table() {
    let response = await fetch('/getChiefJudgeGroupDetails?YSS_ID=' + document.getElementById('YSS_ID').innerHTML);
    let json = await response.json();
    if (JSON.stringify(json) != 'NO_TABLE_ERR') {
        let judge_table = document.getElementById('tbody-chief-judge-info');
        for (let i = 0; i < json.length && judge_table.children.length; i++) {
            judge_table.children[i].children[1].children[0].value = json[i].YSS_ID;
        }
    }
}

let global1 = 0;
let global2 = 0;


manipulate_tbody_chief_judge_info();
manipulate_tbody_judge_info();
manipulate_tbody();
getGroupByCompetitionName3();
getGroupByCompetitionName2();
getGroupByCompetitionName1();
getGroupByCompetitionName();
const timer = setInterval(() => {
    getAsanaByGroupName();
    updateStatus();
    if (document.getElementById('tbody-judge-info').children.length > 0 && global1 == 0) {
        manipulate_judge_table();
        global1 = 1;
    }
    if (document.getElementById('tbody-chief-judge-info').children.length > 0 && global2 == 0) {
        manipulate_chief_judge_table();
        global2 = 1;
    }
}, 1000);

