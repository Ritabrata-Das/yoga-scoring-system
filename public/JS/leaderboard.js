let competitionName = document.getElementById('competitionName');
let groupName = document.getElementById('GroupName');
let yss_id = document.getElementById('YSS_ID');
let increament = parseInt(prompt('Enter the number of candidates to be shown at a time'));
let tr_no = increament;
let tr_initial = 0;
let length = 0;


async function manipulateData() {
    let response1 = await fetch(`/getAsanaByGroupName`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML
        })
    });
    let json1 = await response1.json();
    console.log(json1);
    let thead = document.getElementById('thead');
    thead.innerHTML = `<th scope="col" class="table-success">Chest No</th>
    <th scope="col" class="table-primary">Candidate Name</th>`;
    for (var i = 0; i < json1.length; i++) {
        thead.innerHTML = thead.innerHTML +
            `<th scope="col">${json1[i].AsanaNo}</th>`;
    }
    thead.innerHTML = thead.innerHTML + `<th scope="col" class="table-info">Marks</th>`;


    // ----------------------------------------------------------------------------------------------------------------------
    // let data = [];
    // tbody.innerHTML = '';
    // for (var k = 0; k < json1.length; k++) {
    //     let response = await fetch('/getMarksDataByGroupName', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             'YSS_ID': yss_id.innerHTML,
    //             'groupName': groupName.innerHTML,
    //             'asana': json1[k].AsanaNo
    //         })
    //     });
    //     let json = await response.json();
    //     console.log(json);
    //     length = json.length;
    //     let tbody = document.getElementById('tbody');

    //     for (var i = 0; i < json.length; i++) {
    //         let max_num = Math.max(Math.max(json[i].J1, json[i].J2), Math.max(json[i].J3, json[i].J4), json[i].J5);
    //         let min_num = Math.min(Math.min(json[i].J1, json[i].J2), Math.min(json[i].J3, json[i].J4), json[i].J5);
    //         let marks = json[i].J1 + json[i].J2 + json[i].J3 + json[i].J4 + json[i].J5 - max_num - min_num;
    //         if (json[i].J1 == -1 || json[i].J2 == -1 || json[i].J3 == -1 || json[i].J4 == -1 || json[i].J5 == -1) {
    //             marks = '-';
    //         }
    //         if (k == 0) {
    //             if (marks != '-') {
    //                 tbody.innerHTML = tbody.innerHTML +
    //                     `<tr>
    //             <th scope="row" class="table-success">${json[i].ChestNo}</th>
    //             <td class="table-primary">${json[i].ParticipantName}</td>
    //             <td>${marks}</td>
    //         </tr>`;
    //             }
    //             data.push([marks]);
    //         }
    //         else if (k == json1.length - 1) {
    //             data[i].push(marks);
    //             if (data[i].indexOf('-') == -1) {
    //                 let sum = 0;
    //                 for(let m = 0;m < data[i].length;m++) {
    //                     sum += data[i][m];
    //                 }
    //                 tbody.children[i].innerHTML = tbody.children[i].innerHTML + `<td>${marks}</td><td class="table-info">${sum}</td>`;
    //             }
    //         }
    //         else {
    //             if (data[i].indexOf('-') == -1) {
    //                 tbody.children[i].innerHTML = tbody.children[i].innerHTML + `<td>${marks}</td>`;
    //             }
    //             data[i].push(marks);
    //         }

    //     }
    // }
    document.getElementById('tbody').innerHTML = '';

    let response = await fetch('/getMarksDataByGroupName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'asana': json1[0].AsanaNo
        })
    });
    let json2 = await response.json();
    console.log(json2);
    length = json2.length;
    let tbody = document.getElementById('tbody');
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
                    'YSS_ID': yss_id.innerHTML,
                    'groupName': groupName.innerHTML,
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
            let html = `<tr><th scope="row">${json2[i].ChestNo}</th><td>${json2[i].ParticipantName}</td>`;
            for (let m = 0; m < data.length; m++) {
                html = html + `<td>${data[m]}</td>`;
            }
            candidateData[i].push(sum);
            html = html + `<td>${sum}</td>`
            html = html + '</tr>'
            tbody.innerHTML = tbody.innerHTML + html;
        } else {
            var sliced = candidateData.splice(i,1);
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

    console.log(candidateData_sorted);
    for (let i = 0; i < candidateData_sorted.length; i++) {
        for (let j = 0; j < tbody.children[i].children.length && j < candidateData_sorted[i].length; j++) {
            tbody.children[i].children[j].innerHTML = candidateData_sorted[i][j];
        }
    }


    for(let i = 0;i < tr_initial;i++) {
        tbody.children[i].style.display = 'none';
    }
    for(let i = tr_no;i < tbody.children.length;i++) {
        tbody.children[i].style.display = 'none';
    }
    for(let i = tr_initial;i < tbody.children.length && i < tr_no;i++) {
        tbody.children[i].style.display = 'table-row';
    }

    // let marks_sorted = [...marks].sort().reverse();
    // console.log(marks_sorted);
    // console.log(marks);

    // for (let i = 0; i < marks_sorted.length; i++) {
    //     tbody.children[i].children[0].innerHTML = json2[marks.indexOf(marks_sorted[i])].ChestNo;
    //     tbody.children[i].children[1].innerHTML = json2[marks.indexOf(marks_sorted[i])].ParticipantName;
    //     for(var k = 0;k < json1.length;k++) {
    //         let response = await fetch('/getMarksDataByGroupName', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 'YSS_ID': yss_id.innerHTML,
    //                 'groupName': groupName.innerHTML,
    //                 'asana': json1[k].AsanaNo
    //             })
    //         });
    //         let json = await response.json();
    //         let max_num = Math.max(Math.max(json[marks.indexOf(marks_sorted[i])].J1, json[marks.indexOf(marks_sorted[i])].J2), Math.max(json[marks.indexOf(marks_sorted[i])].J3, json[marks.indexOf(marks_sorted[i])].J4), json[marks.indexOf(marks_sorted[i])].J5);
    //         let min_num = Math.min(Math.min(json[marks.indexOf(marks_sorted[i])].J1, json[marks.indexOf(marks_sorted[i])].J2), Math.min(json[marks.indexOf(marks_sorted[i])].J3, json[marks.indexOf(marks_sorted[i])].J4), json[marks.indexOf(marks_sorted[i])].J5);
    //         let marks1 = json[marks.indexOf(marks_sorted[i])].J1 + json[marks.indexOf(marks_sorted[i])].J2 + json[marks.indexOf(marks_sorted[i])].J3 + json[marks.indexOf(marks_sorted[i])].J4 + json[marks.indexOf(marks_sorted[i])].J5 - max_num - min_num;
    //         if (json[marks.indexOf(marks_sorted[i])].J1 == -1 || json[marks.indexOf(marks_sorted[i])].J2 == -1 || json[marks.indexOf(marks_sorted[i])].J3 == -1 || json[marks.indexOf(marks_sorted[i])].J4 == -1 || json[marks.indexOf(marks_sorted[i])].J5 == -1) {
    //             marks1 = '-';
    //         }

    //         tbody.children[i].children[k+2].innerHTML = marks1;

    //     }
    //     tbody.children[i].children[json1.length+2].innerHTML = marks_sorted[i];
    // }


}

async function updateMarks() {
    let response1 = await fetch(`/getAsanaByGroupName`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML
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
            'YSS_ID': yss_id.innerHTML,
            'groupName': groupName.innerHTML,
            'asana': json1[0].AsanaNo
        })
    });
    let json2 = await response.json();
    console.log(json2);
    length = json2.length;
    let tbody = document.getElementById('tbody');
    let candidateData = [];
    if (json2.length > tr_no) {
        document.getElementById('next').removeAttribute('disabled');
    }
    if(tr_initial > 0) {
        document.getElementById('prev').removeAttribute('disabled');
    }
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
                    'YSS_ID': yss_id.innerHTML,
                    'groupName': groupName.innerHTML,
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
            let sliced = candidateData.splice(i,1);
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

    console.log(candidateData_sorted);
    for (let i = 0;i < tbody.children.length && i < candidateData_sorted.length; i++) {
        for (let j = 0; j < tbody.children[i].children.length && j < candidateData_sorted[i].length; j++) {
            tbody.children[i].children[j].innerHTML = candidateData_sorted[i][j];
        }
    }

    for(let i = tbody.children.length;i < candidateData_sorted.length;i++) {
        let html =`<tr><th scope="row">${candidateData_sorted[i][0]}</th><td>${candidateData_sorted[i][1]}</td>`;
        for(let j = 2;j < candidateData_sorted[i].length;j++) {
            html += `<td>${candidateData_sorted[i][j]}</td>`;
        }
        html += '</tr>';
        tbody.innerHTML = tbody.innerHTML + html;
    }

    let winning_colors = ['rgb(246,166,35)','rgb(192,199,208)','rgb(190,104,0)'];
    for(let i = 0;i < tbody.children.length && i < 3;i++) {
        tbody.children[i].style.backgroundColor = winning_colors[i];
    }

}

document.getElementById('prev').addEventListener('click',(e)=>{
    tr_no -= increament;
    tr_initial -= increament;
    if(tr_initial <= 0) {
        document.getElementById('prev').setAttribute('disabled','true');
    }
    let tbody = document.getElementById('tbody');
    for(let i = 0;i < tr_initial;i++) {
        tbody.children[i].style.display = 'none';
    }
    for(let i = tr_no;i < tbody.children.length;i++) {
        tbody.children[i].style.display = 'none';
    }
    for(let i = tr_initial;i < tbody.children.length && i < tr_no;i++) {
        tbody.children[i].style.display = 'table-row';
    }
});

document.getElementById('next').addEventListener('click',(e)=>{
    tr_no += increament;
    tr_initial += increament;
    let tbody = document.getElementById('tbody');
    if(tr_no >= tbody.children.length) {
        document.getElementById('next').setAttribute('disabled','true');
    }
    for(let i = 0;i < tr_initial;i++) {
        tbody.children[i].style.display = 'none';
    }
    for(let i = tr_no;i < tbody.children.length;i++) {
        tbody.children[i].style.display = 'none';
    }
    for(let i = tr_initial;i < tbody.children.length && i < tr_no;i++) {
        tbody.children[i].style.display = 'table-row';
    }
});

manipulateData();

const timer = setInterval(() => {
    updateMarks();
}, 1000);
