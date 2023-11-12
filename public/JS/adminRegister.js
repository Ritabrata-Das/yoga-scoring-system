let groupBtn = document.getElementById('addGroup');
let removeGroupBtn = document.getElementById('removeGroup');
let groupDetails = document.getElementById('groupDetails');
let asanaDetails = document.getElementById('asanaDetails');
let addAsanaGroup = document.getElementById('addAsanaGroup');
let removeAsanaGroup = document.getElementById('removeAsanaGroup');
let adminRegistrationForm = document.getElementById('adminRegistrationForm');

function addAsana(id) {
    let table_row = document.getElementById('tr' + id);
    table_row.innerHTML = table_row.innerHTML +
        `
        <td><input type="text" class="form-control" id="group${id.replace('asanaGroup', '')}-${table_row.children.length - 1}" placeholder="Asana"></td>
    `;
}

function disableMaxAge(id) {
    let select = document.getElementById(id);
    let maxAge = document.getElementById('MaxAge' + id);
    if (select.value == 'Above') {
        maxAge.setAttribute('disabled', true);
    } else {
        maxAge.removeAttribute('disabled');
    }
}



addAsanaGroup.addEventListener('click', (e) => {
    asanaDetails.innerHTML = asanaDetails.innerHTML +
        `
        <tr id="trasanaGroup${asanaDetails.children.length}">
            <td class="d-flex">
                <input type="text" class="form-control" placeholder="Group">
                <button type="button" class="btn btn-primary" id="asanaGroup${asanaDetails.children.length}" onclick="addAsana(this.id)">Add</button>
            </td>
        </tr>
    `;
});

removeAsanaGroup.addEventListener('click', (e) => {
    asanaDetails.removeChild(asanaDetails.lastChild);
});


groupBtn.addEventListener('click', (e) => {
    console.log('Hello');
    groupDetails.innerHTML = groupDetails.innerHTML +
        `
    <tr>
        <td><input type="text" class="form-control" placeholder="Group"></td>
        <td>
            <select class="form-select" id="group${groupDetails.children.length}" onchange="disableMaxAge(this.id)" placeholder="Group">
                <option>Between</option>
                <option>Above</option>
            </select>
        </td>
        <td><input type="text" class="form-control" id="MinAgegroup${groupDetails.children.length}" placeholder="Min Age"></td>
        <td><input type="text" class="form-control" id="MaxAgegroup${groupDetails.children.length}" placeholder="Max Age"></td>
        <td>
            <select class="form-select" id="gender${groupDetails.children.length}"  placeholder="Gender">
                <option>Male</option>
                <option>Female</option>
            </select>
        </td>
    </tr>`;
});

removeGroupBtn.addEventListener('click', (e) => {
    groupDetails.removeChild(groupDetails.lastChild);
});

adminRegistrationForm.addEventListener('submit', async (e) => {
    console.log('Event Fired');
    e.preventDefault();
    let groupCriteria = [];
    let postAsanaData = [];
    let asanaData = asanaDetails.children;
    let groupData = groupDetails.children;
    for (let i = 0; i < groupData.length; i++) {
        let rowData = groupData[i].children;
        let obj = {};
        if (rowData[1].children[0].value == 'Above') {
            obj = {
                'group': rowData[0].children[0].value,
                'minAge': rowData[2].children[0].value,
                'maxAge': '100',
                'sex': rowData[4].children[0].value
            };
        } else {
            obj = {
                'group': rowData[0].children[0].value,
                'minAge': rowData[2].children[0].value,
                'maxAge': rowData[3].children[0].value,
                'sex': rowData[4].children[0].value
            };
        }
        groupCriteria.push(obj);
    }
    for (let i = 0; i < asanaData.length; i++) {
        let rowObj = asanaData[i].children;
        let asanas = [];
        for (let j = 1; j < rowObj.length; j++) {
            asanas.push(rowObj[j].children[0].value);
        }
        let obj = {
            'group': rowObj[0].children[0].value,
            'asanas': asanas
        }
        postAsanaData.push(obj);
    }
    console.log(postAsanaData);
    console.log(groupCriteria);
    let response = await fetch('/createCompetition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'password': document.getElementById('floatPassword').value,
            'competitionName': document.getElementById('floatingInput').value,
            'cutOffDate': document.getElementById('floatDate').value,
            'groupCriteria': groupCriteria,
            'asanaDetails': postAsanaData
        })
    });
    let text = await response.text();
    if(text == 'ERROR') {
        swal({
            title: 'Oops',
            text: "Something went wrong",
            icon: 'error',
            buttons: {
                again: {
                    text: 'Try again',
                    value: 'again'
                }
            }
        }).then((result) => {
            if (result == 'again') {
                window.open('/adminRegister');
            }
        });
    } else {
        let html = document.createElement('font');
        html.innerHTML = `You are successfully registered<br><b>YSS ID - ${text}</b>`;
        swal({
            title: 'Registration Successful',
            content: html,
            icon: 'success',
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
    console.log(text);
});


const timer = setInterval(() => {
    for(let i = 0;i < groupDetails.children.length;i++) {
        asanaDetails.children[i].children[0].children[0].value = groupDetails.children[i].children[0].children[0].value;
    }
}, 1000);
