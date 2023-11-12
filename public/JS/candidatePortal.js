function register(id) {
    window.open('/competitionRegistration?YSS_ID=' + id);
}

let upcomingCompetitionBtn = document.getElementById('upcomingCompetitionBtn');
let collapseTwo = document.getElementById('collapseTwo');
let collapseTwoBody = document.getElementById('collapseTwoBody');

upcomingCompetitionBtn.addEventListener('click', (e) => {
    // console.log('Event fires.........:.::');
    if (upcomingCompetitionBtn.classList.contains('collapsed')) {
        console.log('event 1 fired')
        upcomingCompetitionBtn.classList.remove('collapsed');
        collapseTwo.classList.add('show');
        collapseTwoBody.style.visibility = 'visible';
    } else {
        console.log('event 2 fired');
        upcomingCompetitionBtn.classList.add('collapsed');
        collapseTwo.classList.remove('show');
        collapseTwoBody.style.visibility = 'hidden';
    }
});

let pastCompetitionBtn = document.getElementById('pastCompetitionBtn');
let collapseOne = document.getElementById('collapseOne');
let collapseOneBody = document.getElementById('collapseOneBody');

pastCompetitionBtn.addEventListener('click', (e) => {
    // console.log('Event fires.........:.::');
    if (pastCompetitionBtn.classList.contains('collapsed')) {
        console.log('event 1 fired')
        pastCompetitionBtn.classList.remove('collapsed');
        collapseOne.classList.add('show');
        collapseOneBody.style.visibility = 'visible';
    } else {
        console.log('event 2 fired');
        pastCompetitionBtn.classList.add('collapsed');
        collapseOne.classList.remove('show');
        collapseOneBody.style.visibility = 'hidden';
    }
});
async function getUpcomingCompetitions(status) {
    let response = await fetch('/fetchCompetitionsByStatus?status=' + status);
    let json = await response.json();
    console.log(json);
    for (let i = 0; i < json.length; i++) {
        collapseTwoBody.innerHTML = collapseTwoBody.innerHTML + `<div class="uc" id="uc${i}"><strong>${json[i].CompetitionName}</strong><button class="btn btn-danger" id="${json[i].YSS_ID}" onclick="register(this.id)">Register</button></div>`;

    }
}

async function getPastCompetitions(status) {
    let response = await fetch('/fetchCompetitionsByStatus?status=' + status);
    let json = await response.json();
    console.log(json);
    let gold = 0;
    let silver = 0;
    let bronze = 0;
    for (let i = 0; i < json.length; i++) {
        var sql_string = `SELECT * FROM ${json[i].YSS_ID.toLowerCase()}.group_info`;
        let res = await fetch('/sqlRunner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sql: sql_string
            })
        });
        let json1 = await res.json();
        let posData = {};
        for (let j = 0; j < json1.length; j++) {
            var sql_string1 = `SELECT * FROM ${json[i].YSS_ID.toLowerCase()}.${'leaderboard_' + json1[j].GroupName.replace(/ /g, '_').toLowerCase()} WHERE YSS_ID = '${document.getElementById('YSS_CANDIDATE_ID').innerHTML}'`;
            let res1 = await fetch('/sqlRunner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sql: sql_string1
                })
            });
            let json2 = await res1.json();
            if (json2.length > 0) {
                posData = json2[0];
                break;
            }
        }
        console.log(posData);
        let data = posData;
        console.log('--------------------SPECIAL----------------------');
        console.log(data);
        console.log('--------------------SPECIAL----------------------');
        let html = `<table class="table"><thead><tr>`;
        for (let field in data) {
            html += `<th scope="col">${field}</th>`;
        }
        html += `</tr></thead><tbody><tr>`;
        for (let field in data) {
            html += `<th scope="row">${data[field]}</th>`
        }
        if(data.Position == 1) {
            gold++;
        } else if(data.Position == 2){
            silver++;
        } else if(data.Position == 3) {
            bronze++;
        }
        html += `</tr></tbody></table>`;
        console.log(html);
        collapseOneBody.innerHTML = collapseOneBody.innerHTML + `<div class="pc" id="pc${i}"><strong>${json[i].CompetitionName}</strong><!-- Button trigger modal -->
        <button type="button" id="${json[i].YSS_ID}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop_${json[i].YSS_ID}" >
            View Results
        </button>
        
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop_${json[i].YSS_ID}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                ${html}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div></div>`;
        if(Object.keys(data).length === 0) {
            console.log('Entered');
            document.getElementById(json[i].YSS_ID).setAttribute('disabled','true');
        }
    }
    document.getElementById("gold").innerHTML = gold;
    document.getElementById("silver").innerHTML = silver;
    document.getElementById("bronze").innerHTML = bronze;
}

async function results(id) {

    return posData;
}

getUpcomingCompetitions('UpComing');
getPastCompetitions('Past');
