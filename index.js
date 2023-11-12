const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const connection = require('./mysql_connection');

// Import the functions you need from the SDKs you need
const initializeApp = require("firebase/app");
const getAnalytics = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVBFJJcWhK-xgWojT8kaImyI886NsWlyI",
  authDomain: "notepad-15a43.firebaseapp.com",
  projectId: "notepad-15a43",
  storageBucket: "notepad-15a43.appspot.com",
  messagingSenderId: "734759980869",
  appId: "1:734759980869:web:c2ead78e665d8f71cd782c",
  measurementId: "G-8SQR07XH8D"
};

// Initialize Firebase
const abc = initializeApp.initializeApp(firebaseConfig);
const analytics = getAnalytics.getAnalytics(abc);

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(express.static('public'));
app.set('view engine', 'pug');
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log('A user connected');

    socket.on('absent', function (data) {
        io.sockets.emit('markAbsent', data);
    });

    socket.on('notAbsent', function (data) {
        io.sockets.emit('markNotAbsent', data);
    });

    socket.on('changeNoCandidates', function (data) {
        io.sockets.emit('markChangeNoCandidates', data);
    });

    socket.on('changeAsanaToServer', function (data) {
        io.sockets.emit('changeAsanaToClient', data);
    });

    socket.on('prevToServer', function (data) {
        io.sockets.emit('prevToClient', data);
    });

    socket.on('nextToServer', function (data) {
        io.sockets.emit('nextToClient', data);
    });

    socket.on('messageToServer', function (data) {
        io.sockets.emit('messageToClientJudge', data);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});



app.post('/updateStartChestNo', (req, res) => {
    console.log(req.body);
    var sql = `SELECT * FROM ${req.body.YSS_ID}.${req.body.group}`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            var sql1 = `UPDATE ${req.body.YSS_ID}.${req.body.group} SET ChestNo = ${req.body.startChestNo + i} WHERE ChestNo = ${result[i].ChestNo}`;
            connection.query(sql1, (err, result1, field1) => {
                if (err) throw err;
            })
            var sql3 = `UPDATE ${req.body.YSS_ID}.${'judge1_'+req.body.group.replace('_registration','')} SET ChestNo = ${req.body.startChestNo + i} WHERE ChestNo = ${result[i].ChestNo}`;
            connection.query(sql3,(err,result3,field3)=>{
                if(err) throw err;
            })
            var sql4 = `UPDATE ${req.body.YSS_ID}.${'judge2_'+req.body.group.replace('_registration','')} SET ChestNo = ${req.body.startChestNo + i} WHERE ChestNo = ${result[i].ChestNo}`;
            connection.query(sql4,(err,result4,field4)=>{
                if(err) throw err;
            })
            var sql5 = `UPDATE ${req.body.YSS_ID}.${'judge3_'+req.body.group.replace('_registration','')} SET ChestNo = ${req.body.startChestNo + i} WHERE ChestNo = ${result[i].ChestNo}`;
            connection.query(sql5,(err,result5,field5)=>{
                if(err) throw err;
            })
            var sql6 = `UPDATE ${req.body.YSS_ID}.${'judge4_'+req.body.group.replace('_registration','')} SET ChestNo = ${req.body.startChestNo + i} WHERE ChestNo = ${result[i].ChestNo}`;
            connection.query(sql6,(err,result6,field6)=>{
                if(err) throw err;
            })
            var sql7 = `UPDATE ${req.body.YSS_ID}.${'judge5_'+req.body.group.replace('_registration','')} SET ChestNo = ${req.body.startChestNo + i} WHERE ChestNo = ${result[i].ChestNo}`;
            connection.query(sql7,(err,result7,field7)=>{
                if(err) throw err;
            })
        }
    });
    var sql2 = `ALTER TABLE ${req.body.YSS_ID}.${req.body.group} ADD PRIMARY KEY (ChestNo)`;
    connection.query(sql2, (err, result2, field2) => {
        if (err) {console.log(err.errno);};
    });


    res.send("SUCCESS");
    res.end();
});

app.post('/shuffleCandidateData', (req, res) => {
    console.log(req.body.data);
    let sql = `TRUNCATE ${req.body.YSS_ID}.${req.body.group}`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
    });
    var sql2 = `ALTER TABLE ${req.body.YSS_ID}.${req.body.group} DROP PRIMARY KEY`;
    connection.query(sql2, (err, result, field) => {
        if (err) {console.log(err.errno);}
    });
    for (let i = 0; i < req.body.data.length; i++) {
        var sql1 = `INSERT INTO ${req.body.YSS_ID}.${req.body.group} VALUES(${req.body.data[i][0]},'${req.body.data[i][1]}','${req.body.data[i][2]}','${req.body.data[i][5]}','${req.body.data[i][3]}','${req.body.data[i][4]}','${req.body.groupName}')`;
        connection.query(sql1, (err, result, field) => {
            if (err) throw err;
        });
    }
    res.send('SUCCESS');
    res.end();
});


app.post('/setChiefJudgeDetails', (req, res) => {
    var sql = `TRUNCATE ${req.body.YSS_ID.toLowerCase()}.chief_judge_info`;
    connection.query(sql, (err, result, field) => {
        if (err) {
            if (err.errno == 1146) {
                var sql1 = `CREATE TABLE ${req.body.YSS_ID.toLowerCase()}.chief_judge_info (ID INT NOT NULL AUTO_INCREMENT,GroupName VARCHAR(100) NOT NULL,YSS_ID VARCHAR(100) NOT NULL,PRIMARY KEY (ID))`;
                connection.query(sql1, (err1, result1, field1) => {
                    if (err1) throw err1;
                })
            }
        }
        for (let ele of req.body.data) {
            var sql2 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.chief_judge_info(GroupName,YSS_ID) VALUES('${ele.group}','${ele.yss_id}')`;
            connection.query(sql2, (err2, resutl2, field2) => {
                if (err2) throw err2;
            });
        }
    });
    res.send('SUCCESS');
    res.end();
});

app.get('/getJudgementGroupDetails',(req,res)=>{
    var sql =  `SELECT * FROM ${req.query.YSS_ID}.judge_info`;
    connection.query(sql,(err,result,field)=>{
        if(err) {
            if(err.errno == 1146) {
                res.send('NO_TABLE_ERR');
                res.end();
            }
        } else {
            res.send(result);
            res.end();
        }
    })
});

app.get('/getChiefJudgeGroupDetails',(req,res)=>{
    var sql =  `SELECT * FROM ${req.query.YSS_ID}.chief_judge_info`;
    connection.query(sql,(err,result,field)=>{
        if(err) {
            if(err.errno == 1146) {
                res.send('NO_TABLE_ERR');
                res.end();
            }
        } else {
            res.send(result);
            res.end();
        }
    })
});

app.post('/setJudgeDetails', (req, res) => {
    var sql = `TRUNCATE ${req.body.YSS_ID.toLowerCase()}.judge_info`;
    connection.query(sql, (err, result, field) => {
        if (err) {
            if (err.errno == 1146) {
                var sql1 = `CREATE TABLE ${req.body.YSS_ID.toLowerCase()}.judge_info (ID INT NOT NULL AUTO_INCREMENT,JudgeNo VARCHAR(20) NOT NULL,GroupName VARCHAR(100) NOT NULL,YSS_ID VARCHAR(100) NOT NULL,PRIMARY KEY (ID))`;
                connection.query(sql1, (err1, result1, field1) => {
                    if (err1) throw err1;
                })
            }
        }
        for (let ele of req.body.data) {
            var sql2 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.judge_info(JudgeNo,GroupName,YSS_ID) VALUES('${ele.judgeNo}','${ele.group}','${ele.yss_id}')`;
            connection.query(sql2, (err2, resutl2, field2) => {
                if (err2) throw err2;
            });
        }
    });
    res.send('SUCCESS');
    res.end();
});

app.post('/sqlRunner', (req, res) => {
    var sql = req.body.sql;
    connection.query(sql, (err, result, field) => {
        if (err) {
            res.send([err.errno]);
            res.end();
        } else {
            res.send(result);
            res.end();
        }
    })
});

function runQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                resolve('ERR');
            } else {
                resolve(results);
            }
        });
    });
}

app.post('/updateLeaderboard', (req, res) => {
    var sql4 = `TRUNCATE ${req.body.YSS_ID}.${'leaderboard_' + req.body.group.replace(/ /g, '_').toLowerCase()}`;
    connection.query(sql4, (err, result4, field4) => {
        if (err) throw err;
    });
    for (let i = 0; i < req.body.candidateData_sorted.length; i++) {
        var sql = `SELECT YSS_ID FROM ${req.body.YSS_ID}.${req.body.group.replace(/ /g, '_').toLowerCase() + '_registration'} WHERE ChestNo = ${req.body.candidateData_sorted[i][0]}`;
        connection.query(sql, (err, result, field) => {
            if (err) throw err;
            let leaderboardData = [];
            for (let j = 2; j < req.body.candidateData_sorted[i].length; j++) {
                leaderboardData.push(req.body.candidateData_sorted[i][j]);
            }
            var sql1 = `INSERT INTO ${req.body.YSS_ID}.${'leaderboard_' + req.body.group.replace(/ /g, '_').toLowerCase()} VALUES('${result[0].YSS_ID}',${i + 1},${req.body.candidateData_sorted[i][0]},'${req.body.candidateData_sorted[i][1]}',${leaderboardData.toString()})`;
            connection.query(sql1, (err, result1, field1) => {
                if (err) throw err;
            });
        });
    }
    res.send('SUCCESS');
    res.end();
});

app.get('/getYSS_IDByCompetitionName', (req, res) => {
    var sql1 = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${req.query.competitionName}'`;
    connection.query(sql1, (err, result, field) => {
        if (err) throw err;
        res.send(result[0].YSS_ID);
        res.end();
    });
});

app.get('/checkJudgeStatusByJudgeAndGroup', (req, res) => {
    // console.log(req.query);
    var sql1 = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${req.query.competitionName}'`;
    connection.query(sql1, (err, result1, field1) => {
        if (err) throw err;
        if (result1.length != 0) {
            var sql2 = `SELECT Status FROM ${result1[0].YSS_ID.toLowerCase()}.judge_status WHERE JudgeNo = '${req.query.judge}' AND GroupName = '${req.query.group}'`;
            connection.query(sql2, (err, result2, field2) => {
                if (err) throw err;
                if (result2.length != 0) {
                    res.send(result2[0].Status);
                    res.end();
                } else {
                    res.send('nb');
                    res.end();
                }
            });
        } else {
            res.send("ND");
            res.end();
        }
    });

})

app.get('/changeStatus', (req, res) => {
    console.log(req.query);
    var sql = `UPDATE ${req.query.yss_id.toLowerCase()}.judge_status SET Status = '${req.query.command}' WHERE GroupName = '${req.query.group}' AND JudgeNo = '${req.query.judge}' `;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send('SUCCESS');
        res.end();
    })
});

app.get('/getJudgeStatus', (req, res) => {
    var sql = `SELECT * FROM ${req.query.yss_id.toLowerCase()}.judge_status`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    });
})

app.get('/displayLeaderboard', (req, res) => {
    res.render('leaderboard', { YSS_ID: req.query.YSS_ID, GroupName: req.query.GroupName, CompetitionName: req.query.CompetitionName })
});

app.post('/getAsanaByGroupName', (req, res) => {
    var sql = `SELECT AsanaNo FROM ${req.body.YSS_ID.toLowerCase()}.asanas WHERE GroupName = '${req.body.groupName}'`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    });
});

app.post('/getJudgeNameByGroupName', (req, res) => {
    var sql = `SELECT JudgeName FROM ${req.body.YSS_ID.toLowerCase()}.${req.body.judge.toLowerCase() + '_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    })
})

app.post('/getMarksDataByGroupName', (req, res) => {
    var sql = `SELECT ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ChestNo, ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ParticipantName, ${req.body.YSS_ID.toLowerCase()}.${'judge1_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.${req.body.asana.replace(' ', '')} AS J1, ${req.body.YSS_ID.toLowerCase()}.${'judge2_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.${req.body.asana.replace(' ', '')} AS J2, ${req.body.YSS_ID.toLowerCase()}.${'judge3_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.${req.body.asana.replace(' ', '')} AS J3, ${req.body.YSS_ID.toLowerCase()}.${'judge4_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.${req.body.asana.replace(' ', '')} AS J4, ${req.body.YSS_ID.toLowerCase()}.${'judge5_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.${req.body.asana.replace(' ', '')} AS J5  FROM  ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'} INNER JOIN ${req.body.YSS_ID.toLowerCase()}.${'judge1_' + req.body.groupName.replace(/ /g, '_').toLowerCase()} ON ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ChestNo = ${req.body.YSS_ID.toLowerCase()}.${'judge1_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.ChestNo INNER JOIN ${req.body.YSS_ID.toLowerCase()}.${'judge2_' + req.body.groupName.replace(/ /g, '_').toLowerCase()} ON ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ChestNo = ${req.body.YSS_ID.toLowerCase()}.${'judge2_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.ChestNo INNER JOIN ${req.body.YSS_ID.toLowerCase()}.${'judge3_' + req.body.groupName.replace(/ /g, '_').toLowerCase()} ON ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ChestNo = ${req.body.YSS_ID.toLowerCase()}.${'judge3_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.ChestNo INNER JOIN ${req.body.YSS_ID.toLowerCase()}.${'judge4_' + req.body.groupName.replace(/ /g, '_').toLowerCase()} ON ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ChestNo = ${req.body.YSS_ID.toLowerCase()}.${'judge4_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.ChestNo INNER JOIN ${req.body.YSS_ID.toLowerCase()}.${'judge5_' + req.body.groupName.replace(/ /g, '_').toLowerCase()} ON ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}.ChestNo = ${req.body.YSS_ID.toLowerCase()}.${'judge5_' + req.body.groupName.replace(/ /g, '_').toLowerCase()}.ChestNo`;

    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    })
});

app.get('/displayScoresheet', (req, res) => {
    res.render('scoresheet', { YSS_ID: req.query.YSS_ID, GroupName: req.query.GroupName, CompetitionName: req.query.CompetitionName, asana: req.query.asana })
});

app.get('/getGroupByCompetitionName', (req, res) => {
    console.log(req.query);
    var sql = `SELECT * FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = ?`;
    connection.query(sql, [req.query.competitionName], (err, result, field) => {
        if (err) throw err;
        var sql1 = `SELECT * FROM ${result[0].YSS_ID.toLowerCase()}.group_info`;
        connection.query(sql1, (err, result1, field1) => {
            if (err) throw err;
            res.send(result1);
            res.end();
        });
    });
});

app.get('/adminPortal', (req, res) => {
    var sql = 'SELECT * FROM yoga_scoring_system.yoga_competitions WHERE YSS_ID = ?';
    connection.query(sql, [req.query.YSS_ID], (err, result, field) => {
        if (err) throw err;
        res.status(200).render('adminPortal', { competitionName: result[0].CompetitionName, YSS_ID: req.query.YSS_ID });
    });
});

app.get('/fetchCompetitionsByStatus', (req, res) => {
    var sql = 'SELECT * FROM yoga_scoring_system.yoga_competitions WHERE Status = ?';
    connection.query(sql, [req.query.status], (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    });
});

app.post('/judgeRegistrationDB', (req, res) => {
    console.log(req.body);
    var sql1 = `SELECT YSS_ID FROM yoga_scoring_system.judge`;
    connection.query(sql1, (err, result1, field1) => {
        if (err) throw err;
        let yss_id = 'YSS_JUDGE' + (Math.floor(Math.random() * 90000) + 10000);
        for (var i = 0; i < result1.length; i++) {
            if (result1[i].YSS_ID == yss_id) {
                yss_id = 'YSS_JUDGE' + (Math.floor(Math.random() * 90000) + 10000);
                i = 0;
            }
        }
        var sql2 = `INSERT INTO yoga_scoring_system.judge VALUES('${yss_id}','${req.body.judgeName}','${req.body.mobile}','${req.body.password}')`;
        connection.query(sql2, (err, result2, field2) => {
            if (err) {
                throw err;
                res.send('ERROR');
            } else {
                res.send(yss_id);
            }
            res.end();
        });
    });
});


app.get('/judgeRegister', (req, res) => {
    fs.readFile("HTML/judgeRegistration.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    });
});

app.post('/candidateRegistrationDB', (req, res) => {
    console.log(req.body);
    var sql1 = `SELECT YSS_ID FROM yoga_scoring_system.candidate`;
    connection.query(sql1, (err, result1, field1) => {
        if (err) throw err;
        let yss_id = 'YSS_CANDIDATE' + (Math.floor(Math.random() * 90000) + 10000);
        for (var i = 0; i < result1.length; i++) {
            if (result1[i].YSS_ID == yss_id) {
                yss_id = 'YSS_CANDIDATE' + (Math.floor(Math.random() * 90000) + 10000);
                i = 0;
            }
        }
        var sql2 = `INSERT INTO yoga_scoring_system.candidate VALUES('${yss_id}','${req.body.candidateName}','${req.body.password}','${req.body.sex}','${req.body.mobile}')`;
        connection.query(sql2, (err, result2, field2) => {
            if (err) {
                throw err;
                res.send('ERROR');
            } else {
                res.send(yss_id);
            }
            res.end();
        });
    });
});

app.get('/candidateRegister', (req, res) => {
    fs.readFile("HTML/candidateRegistration.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    });
});

app.post('/createCompetition', (req, res) => {
    var sql1 = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions`;
    connection.query(sql1, (err, result1, field1) => {
        if (err) {
            res.send('ERROR');
            res.end();
        }
        let yss_id = 'YSS_ADMIN' + (Math.floor(Math.random() * 90000) + 10000);
        for (let i = 0; i < result1.length; i++) {
            if (yss_id == result1[i].YSS_ID) {
                yss_id = 'YSS_ADMIN' + (Math.floor(Math.random() * 90000) + 10000);
                i = 0;
            }
        }
        var sql2 = `INSERT INTO yoga_scoring_system.yoga_competitions VALUES('${yss_id}','${req.body.password}','${req.body.competitionName}','${req.body.cutOffDate}','UpComing')`;
        connection.query(sql2, (err, result2, field2) => {
            if (err) {
                res.send('ERROR');
                res.end();
            }
        });
        var sql3 = `CREATE DATABASE ${yss_id.toLowerCase()}`;
        connection.query(sql3, (err, result3, field3) => {
            if (err) {
                res.send('ERROR');
                res.end();
            }
        });
        var sql4 = `CREATE TABLE ${yss_id.toLowerCase()}.group_criteria (GroupName VARCHAR(100) NOT NULL,MinAge INT NOT NULL,MaxAge INT NOT NULL,Sex VARCHAR(50) NOT NULL,PRIMARY KEY (GroupName))`;
        connection.query(sql4, (err, result4, field4) => {
            if (err) {
                res.send('ERROR');
                res.end();
            }
        })
        for (let i = 0; i < req.body.groupCriteria.length; i++) {
            var sql5 = `INSERT INTO ${yss_id.toLowerCase()}.group_criteria VALUES('${req.body.groupCriteria[i].group}',${req.body.groupCriteria[i].minAge},${req.body.groupCriteria[i].maxAge},'${req.body.groupCriteria[i].sex}')`;
            connection.query(sql5, (err, result5, field5) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });
        }
        var sql6 = `CREATE TABLE ${yss_id.toLowerCase()}.group_info (GroupID INT NOT NULL,GroupName VARCHAR(100) NOT NULL,EndChestNo INT NOT NULL,PRIMARY KEY (GroupID))`;
        connection.query(sql6, (err, result6, field6) => {
            if (err) {
                res.send('ERROR');
                res.end();
            }
        });
        for (let i = 0; i < req.body.groupCriteria.length; i++) {
            var sql7 = `INSERT INTO ${yss_id.toLowerCase()}.group_info VALUES(${i + 1},'${req.body.groupCriteria[i].group}',99)`;
            connection.query(sql7, (err, result7, field7) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });
        }
        for (let i = 0; i < req.body.groupCriteria.length; i++) {
            var sql8 = `CREATE TABLE ${yss_id.toLowerCase()}.${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase() + '_registration'} (ChestNo INT NOT NULL,YSS_ID VARCHAR(100) NOT NULL,ParticipantName VARCHAR(100) NOT NULL,DOB DATE NOT NULL,Organisation VARCHAR(100) NOT NULL,Sex VARCHAR(45) NOT NULL,GroupName VARCHAR(100) NOT NULL,PRIMARY KEY (ChestNo))`;
            connection.query(sql8, (err, result8, field8) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });
        }
        var sql9 = `CREATE TABLE ${yss_id.toLowerCase()}.asanas (ID INT NOT NULL AUTO_INCREMENT,AsanaNo VARCHAR(60) NOT NULL,GroupName VARCHAR(100) NOT NULL,PRIMARY KEY (ID))`;
        connection.query(sql9, (err, result9, field9) => {
            if (err) {
                res.send('ERROR');
                res.end();
            }
        });
        for (let i = 0; i < req.body.asanaDetails.length; i++) {
            for (let j = 0; j < req.body.asanaDetails[i].asanas.length; j++) {
                var sql10 = `INSERT INTO ${yss_id.toLowerCase()}.asanas(AsanaNo, GroupName) VALUES('${req.body.asanaDetails[i].asanas[j]}','${req.body.asanaDetails[i].group}')`;
                connection.query(sql10, (err, result10, field10) => {
                    if (err) {
                        res.send('ERROR');
                        res.end();
                    }
                })
            }
        }
        for (let i = 0; i < req.body.groupCriteria.length; i++) {
            let asana_array = [];
            for (let j = 0; j < req.body.asanaDetails[i].asanas.length; j++) {
                asana_array.push(req.body.asanaDetails[i].asanas[j].replace(/ /g, '') + ' FLOAT NOT NULL');
            }
            var sql11 = `CREATE TABLE ${yss_id.toLowerCase()}.judge1_${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase()} (ChestNo INT NOT NULL, JudgeName VARCHAR(100) NOT NULL, ${asana_array}, GroupName VARCHAR(100) NOT NULL , PRIMARY KEY (ChestNo))`;
            connection.query(sql11, asana_array, (err, result11, field11) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });

            var sql12 = `CREATE TABLE ${yss_id.toLowerCase()}.judge2_${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase()} (ChestNo INT NOT NULL, JudgeName VARCHAR(100) NOT NULL, ${asana_array}, GroupName VARCHAR(100) NOT NULL , PRIMARY KEY (ChestNo))`;
            connection.query(sql12, asana_array, (err, result12, field12) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });

            var sql13 = `CREATE TABLE ${yss_id.toLowerCase()}.judge3_${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase()} (ChestNo INT NOT NULL, JudgeName VARCHAR(100) NOT NULL, ${asana_array}, GroupName VARCHAR(100) NOT NULL , PRIMARY KEY (ChestNo))`;
            connection.query(sql13, asana_array, (err, result13, field13) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });

            var sql14 = `CREATE TABLE ${yss_id.toLowerCase()}.judge4_${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase()} (ChestNo INT NOT NULL, JudgeName VARCHAR(100) NOT NULL, ${asana_array}, GroupName VARCHAR(100) NOT NULL , PRIMARY KEY (ChestNo))`;
            connection.query(sql14, asana_array, (err, result14, field14) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });

            var sql15 = `CREATE TABLE ${yss_id.toLowerCase()}.judge5_${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase()} (ChestNo INT NOT NULL, JudgeName VARCHAR(100) NOT NULL, ${asana_array}, GroupName VARCHAR(100) NOT NULL , PRIMARY KEY (ChestNo))`;
            connection.query(sql15, asana_array, (err, result15, field15) => {
                if (err) {
                    res.send('ERROR');
                    res.end();
                }
            });
        }
        var sql20 = `CREATE TABLE ${yss_id.toLowerCase()}.judge_status (ID INT NOT NULL AUTO_INCREMENT,GroupName VARCHAR(100) NOT NULL,JudgeNo VARCHAR(45) NOT NULL,Status VARCHAR(45) NOT NULL,PRIMARY KEY (ID))`;
        connection.query(sql20, (err, result20, field20) => {
            if (err) {
                res.send('ERROR');
                res.end();
            };
        });
        for (let i = 0; i < req.body.groupCriteria.length; i++) {
            var sql21 = `INSERT INTO ${yss_id.toLowerCase()}.judge_status (GroupName, JudgeNo, Status) VALUES ('${req.body.groupCriteria[i].group}', 'Judge 1', 'Editing')`;
            var sql22 = `INSERT INTO ${yss_id.toLowerCase()}.judge_status (GroupName, JudgeNo, Status) VALUES ('${req.body.groupCriteria[i].group}', 'Judge 2', 'Editing')`;
            var sql23 = `INSERT INTO ${yss_id.toLowerCase()}.judge_status (GroupName, JudgeNo, Status) VALUES ('${req.body.groupCriteria[i].group}', 'Judge 3', 'Editing')`;
            var sql24 = `INSERT INTO ${yss_id.toLowerCase()}.judge_status (GroupName, JudgeNo, Status) VALUES ('${req.body.groupCriteria[i].group}', 'Judge 4', 'Editing')`;
            var sql25 = `INSERT INTO ${yss_id.toLowerCase()}.judge_status (GroupName, JudgeNo, Status) VALUES ('${req.body.groupCriteria[i].group}', 'Judge 5', 'Editing')`;
            connection.query(sql21, (err, result21, field21) => {
                if (err) {
                    throw err;
                    res.send('ERROR');
                    res.end();
                }
            });

            connection.query(sql22, (err, result21, field21) => {
                if (err) {
                    throw err;
                    res.send('ERROR');
                    res.end();
                }
            });

            connection.query(sql23, (err, result21, field21) => {
                if (err) {
                    throw err;
                    res.send('ERROR');
                    res.end();
                }
            });

            connection.query(sql24, (err, result21, field21) => {
                if (err) {
                    throw err;
                    res.send('ERROR');
                    res.end();
                }
            });

            connection.query(sql25, (err, result21, field21) => {
                if (err) {
                    throw err;
                    res.send('ERROR');
                    res.end();
                }
            });
        }

        for (let i = 0; i < req.body.groupCriteria.length; i++) {
            let asana_array = [];
            for (let j = 0; j < req.body.asanaDetails[i].asanas.length; j++) {
                asana_array.push(req.body.asanaDetails[i].asanas[j].replace(/ /g, '') + ' FLOAT NOT NULL');
            }
            var sql26 = `CREATE TABLE ${yss_id.toLowerCase()}.leaderboard_${req.body.groupCriteria[i].group.replace(/ /g, '_').toLowerCase()} (YSS_ID VARCHAR(100) NOT NULL, Position INT NOT NULL, ChestNo INT NOT NULL, ParticipantName VARCHAR(100) NOT NULL, ${asana_array}, Marks FLOAT NOT NULL , PRIMARY KEY (YSS_ID))`;
            connection.query(sql26, (err, result26, field26) => {
                if (err) {
                    throw err;
                    res.send('ERROR');
                    res.end();
                }
            });
        }

        res.send(yss_id);
        res.end();
    });


});

app.get('/adminRegister', (req, res) => {
    fs.readFile("HTML/adminRegister.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    })
});

app.post('/adminPortal', (req, res) => {
    console.log(req.body);
    var sql = 'SELECT * FROM yoga_scoring_system.yoga_competitions WHERE YSS_ID = ? AND Password = ?';
    connection.query(sql, [req.body.YSS_ID, req.body.password], (err, result, field) => {
        if (err) throw err;
        if (result.length == 1) {
            res.send('SUCCESS');
        } else {
            res.send('ERROR');
        }
        res.end();
    });
});

app.get('/adminLogin', (req, res) => {
    fs.readFile("HTML/adminLogin.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    })
});

app.get('/getAsanaData', (req, response) => {
    var sql = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${req.query.competitionName}'`;
    connection.query(sql, (err, res, field) => {
        if (err) throw err;
        if (res.length == 0) {
            response.send([]);
            response.end();
        } else {
            var sql1 = `SELECT * FROM ${res[0].YSS_ID.toLowerCase()}.asanas WHERE GroupName = '${req.query.groupName}'`;
            connection.query(sql1, (err, result, field1) => {
                if (err) throw err;
                response.send(result);
                response.end();
            });
        }
    });
});

app.post('/getGroupName', (req, res) => {
    var sql = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${req.body.competitionName}'`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        if (result.length == 0) {
            res.send([]);
            res.end();
        } else {
            var sql1 = `SELECT GroupName FROM ${result[0].YSS_ID.toLowerCase()}.group_info`;
            connection.query(sql1, (err, result1, field1) => {
                if (err) throw err;
                res.send(result1);
                res.end();
            })
        }
    });
});

app.get('/getCompetitionData', (req, res) => {
    var sql = `SELECT CompetitionName FROM yoga_scoring_system.yoga_competitions WHERE Status = 'UpComing'`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    });
})


app.post('/registerCandidate', (req, res) => {
    console.log(req.body);
    let a = 0;
    var sql1 = `SELECT GroupID FROM ${req.body.YSS_ID.toLowerCase()}.group_info WHERE GroupName = '${req.body.groupName}'`;
    connection.query(sql1, (err, result, field) => {
        if (err) throw err;
        var groupId = result[0].GroupID;
        var sql2 = `SELECT GroupID,EndChestNo,GroupName FROM ${req.body.YSS_ID.toLowerCase()}.group_info WHERE GroupID >= ${groupId}`;
        connection.query(sql2, (err, result1, field1) => {
            if (err) throw err;
            a = result1[0].EndChestNo;
            console.log(result1);
            for (var i = 0; i < result1.length; i++) {
                var sql3 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.group_info SET EndChestNo = ${result1[i].EndChestNo + 1} WHERE GroupID = ${result1[i].GroupID}`;
                connection.query(sql3, (err, result2, field2) => {
                    if (err) throw err;
                });
                if (i >= 1) {
                    var sql5 = `SELECT ChestNo, GroupName FROM ${req.body.YSS_ID.toLowerCase()}.${result1[i].GroupName.replace(/ /g, '_').toLowerCase() + '_registration'} ORDER BY ChestNo DESC`;
                    connection.query(sql5, (err, result4, field4) => {
                        if (err) throw err;
                        for (var j = 0; j < result4.length; j++) {
                            var sql6 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.${result4[j].GroupName.replace(/ /g, '_').toLowerCase() + '_registration'} SET ChestNo = ${result4[j].ChestNo + 1} WHERE ChestNo = ${result4[j].ChestNo}`;
                            connection.query(sql6, (err, result5, field5) => {
                                if (err) throw err;
                            });
                        }
                    });

                    var sql100 = `SELECT ChestNo, GroupName FROM ${req.body.YSS_ID.toLowerCase()}.judge1_${result1[i].GroupName.replace(/ /g, '_').toLowerCase()} ORDER BY ChestNo DESC`;
                    connection.query(sql100, (err, result100, field100) => {
                        if (err) throw err;
                        for (var j = 0; j < result100.length; j++) {
                            var sql101 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.judge1_${result100[j].GroupName.replace(/ /g, '_').toLowerCase()} SET ChestNo = ${result100[j].ChestNo + 1} WHERE ChestNo = ${result100[j].ChestNo}`;
                            connection.query(sql101, (err, result101, field101) => {
                                if (err) throw err;
                            });
                            var sql102 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.judge2_${result100[j].GroupName.replace(/ /g, '_').toLowerCase()} SET ChestNo = ${result100[j].ChestNo + 1} WHERE ChestNo = ${result100[j].ChestNo}`;
                            connection.query(sql102, (err, result102, field102) => {
                                if (err) throw err;
                            });
                            var sql103 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.judge3_${result100[j].GroupName.replace(/ /g, '_').toLowerCase()} SET ChestNo = ${result100[j].ChestNo + 1} WHERE ChestNo = ${result100[j].ChestNo}`;
                            connection.query(sql103, (err, result103, field103) => {
                                if (err) throw err;
                            });
                            var sql104 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.judge4_${result100[j].GroupName.replace(/ /g, '_').toLowerCase()} SET ChestNo = ${result100[j].ChestNo + 1} WHERE ChestNo = ${result100[j].ChestNo}`;
                            connection.query(sql104, (err, result104, field104) => {
                                if (err) throw err;
                            });
                            var sql105 = `UPDATE ${req.body.YSS_ID.toLowerCase()}.judge5_${result100[j].GroupName.replace(/ /g, '_').toLowerCase()} SET ChestNo = ${result100[j].ChestNo + 1} WHERE ChestNo = ${result100[j].ChestNo}`;
                            connection.query(sql105, (err, result105, field105) => {
                                if (err) throw err;
                            });
                        }
                    });
                }
            }
            console.log(a);
            console.log('shiuwguj');
            console.log(result1[0]);
            console.log('---------------------------');
            console.log(result1[0]);
            console.log('---------------------------');
            // connection.commit();

            var sql4 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'} (ChestNo, YSS_ID, ParticipantName, DOB, Organisation, Sex, GroupName) VALUES ( ${result1[0].EndChestNo + 1}, '${req.body.YSS_CANDIDATE_ID}' ,'${req.body.fullName}', '${req.body.dob}', '${req.body.organisation}', '${req.body.sex}','${req.body.groupName}')`;
            connection.query(sql4, (err, result3, field3) => {
                if (err) throw err;
            });

            var sql10 = `SELECT * FROM ${req.body.YSS_ID.toLowerCase()}.asanas WHERE GroupName = '${req.body.groupName}'`;
            connection.query(sql10, (err, result10, field10) => {
                if (err) throw err;
                num_list = [];
                question_array = [];
                for (let i = 0; i < result10.length; i++) {
                    num_list.push(-1);
                    question_array.push('?');
                }
                var sql11 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.judge1_${req.body.groupName.replace(/ /g, '_').toLowerCase()} VALUES(${result1[0].EndChestNo + 1}, '' ,${question_array}, '${req.body.groupName}')`;
                connection.query(sql11, num_list, (err, result11, field11) => {
                    if (err) throw err;
                });
                var sql12 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.judge2_${req.body.groupName.replace(/ /g, '_').toLowerCase()} VALUES(${result1[0].EndChestNo + 1}, '' ,${question_array}, '${req.body.groupName}')`;
                connection.query(sql12, num_list, (err, result12, field12) => {
                    if (err) throw err;
                });
                var sql13 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.judge3_${req.body.groupName.replace(/ /g, '_').toLowerCase()} VALUES(${result1[0].EndChestNo + 1}, '' ,${question_array}, '${req.body.groupName}')`;
                connection.query(sql13, num_list, (err, result13, field13) => {
                    if (err) throw err;
                });
                var sql14 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.judge4_${req.body.groupName.replace(/ /g, '_').toLowerCase()} VALUES(${result1[0].EndChestNo + 1}, '' ,${question_array}, '${req.body.groupName}')`;
                connection.query(sql14, num_list, (err, result14, field14) => {
                    if (err) throw err;
                });
                var sql15 = `INSERT INTO ${req.body.YSS_ID.toLowerCase()}.judge5_${req.body.groupName.replace(/ /g, '_').toLowerCase()} VALUES(${result1[0].EndChestNo + 1}, '' ,${question_array}, '${req.body.groupName}')`;
                connection.query(sql15, num_list, (err, result15, field15) => {
                    if (err) throw err;
                });
                res.send('SUCCESS');
                res.end();
            });


        });
    });



});

app.get('/getGroupCriteria', (req, res) => {
    console.log(req.query);
    var sql = `SELECT GroupName, MinAge, MaxAge, Sex FROM ${req.query.YSS_ID}.group_criteria`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        res.send(result);
        res.end();
    });
});

app.get('/competitionRegistration', (req, res) => {
    console.log(req.query);
    var sql = 'SELECT CompetitionName, CutOffDate FROM yoga_scoring_system.yoga_competitions WHERE YSS_ID = ?';
    connection.query(sql, [req.query.YSS_ID], (err, result, field) => {
        if (err) throw err;
        res.status(200).render('competitionRegistration', { YSS_ID: req.query.YSS_ID, CompetitionName: result[0].CompetitionName, Organiser: 'IYC', CutOffDate: result[0].CutOffDate });
    });
});

app.get('/candidatePortal', (req, res) => {
    console.log(req.query);
    var sql = 'SELECT CandidateName FROM yoga_scoring_system.candidate WHERE YSS_ID = ?';
    connection.query(sql, [req.query.YSS_ID], (err, result, field) => {
        if (err) throw err;
        res.status(200).render('candidatePortal', { YSS_ID: req.query.YSS_ID, CandidateName: result[0].CandidateName });
        // res.end();
    });
});

app.post('/candidateLoginSubmit', (req, res) => {
    console.log(req.body);
    var sql = 'SELECT * FROM yoga_scoring_system.candidate WHERE YSS_ID = ? AND Password = ?';
    connection.query(sql, [req.body.YSS_ID, req.body.password], (err, result, field) => {
        if (err) throw err;
        if (result.length == 1) {
            res.write('SUCCESS');
        } else {
            res.write('ERROR')
        }
        res.end();
    });
});

app.get('/candidateLogin', (req, res) => {
    fs.readFile("HTML/candidateLogin.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    })
});

app.post('/insertJudgeData', (req, res) => {
    var sql = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${req.body.competitionName}'`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        if (result.length == 0) {
            res.send([]);
            res.end();
        } else {
            var sql1 = `UPDATE ${result[0].YSS_ID.toLowerCase()}.${req.body.judgeSelection.toLowerCase()}_${req.body.groupName.replace(/ /g, '_').toLowerCase()} SET ${req.body.asana} = ${req.body.markSelection} WHERE ChestNo = ${req.body.chestNo}`;
            connection.query(sql1, (err, result1, field1) => {
                if (err) throw err;
            });
            var sql2 = `UPDATE ${result[0].YSS_ID.toLowerCase()}.${req.body.judgeSelection.toLowerCase()}_${req.body.groupName.replace(/ /g, '_').toLowerCase()} SET JudgeName = '${req.body.judgeName}' WHERE ChestNo = ${req.body.chestNo}`;
            connection.query(sql2, (err, result2, field2) => {
                if (err) throw err;
                res.send("SUCCESS");
                res.end();
            });
        }
    });
});

app.post('/getCandidateData', (req, res) => {
    console.log(req.body);
    var sql = `SELECT YSS_ID FROM yoga_scoring_system.yoga_competitions WHERE CompetitionName = '${req.body.competitionName}'`;
    connection.query(sql, (err, result, field) => {
        if (err) throw err;
        if (result.length == 0) {
            res.send([]);
            res.end();
        } else {
            var sql1 = `SELECT ChestNo FROM ${result[0].YSS_ID.toLowerCase()}.${req.body.groupName.replace(/ /g, '_').toLowerCase() + '_registration'}`;
            connection.query(sql1, (err, result1, field1) => {
                if (err) throw err;
                res.send(result1);
                res.end();
            });
        }
    });
});

function recognizeChiefJudge(val) {

    let data = recognizeChiefJudgePromise.then(
        function (value) {
            return value;
        },
        function (err) {
            return err;
        }
    );
}

app.get('/groupSelection', (req, res) => {
    let recognizeChiefJudgePromise = new Promise(function (resolve, reject) {
        var sql2 = `SELECT * FROM yoga_scoring_system.yoga_competitions WHERE Status = 'UpComing'`;
        connection.query(sql2, async (err, result2, field2) => {
            if (err) throw err;
            let flag = [];
            let i = 0;
            for (i = 0; i < result2.length; i++) {
                var sql3 = `SELECT YSS_ID, GroupName FROM ${result2[i].YSS_ID}.chief_judge_info WHERE YSS_ID = '${req.query.YSS_ID}'`;
                let result3 = await runQuery(sql3);
                if (result3 != 'ERR' && result3.length > 0) {
                    resolve([result2[i], result3]);
                    break;
                }
            }
            if (i >= result2.length) {
                resolve(0);
            }
        });
    });
    var sql = `SELECT Name FROM yoga_scoring_system.judge WHERE YSS_ID = ?`;
    connection.query(sql, [req.query.YSS_ID], async (err, result, field) => {
        if (err) throw err;
        console.log('lkvadfubvuiVUOvnuiHVIUOx');
        let data = await recognizeChiefJudgePromise;
        console.log('---------------SPECIAL-------------------');
        console.log(data);
        console.log('---------------SPECIAL-------------------');
        if (data == 0) {
            res.status(200).render('groupSelection', { judgeName: result[0].Name, yss_id: req.query.YSS_ID });
            res.end();
        } else {
            res.status(200).render('chiefJudgePortal', { judgeName: result[0].Name, yss_id: req.query.YSS_ID, yss_admin_id: data[0].YSS_ID, competitionName: data[0].CompetitionName, group: data[1][0].GroupName });
            res.end();
        }
    });
});

app.post('/judgeLoginSubmit', (req, res) => {
    console.log(req.body);
    var sql = 'SELECT * FROM yoga_scoring_system.judge WHERE YSS_ID = ? AND Password = ?';
    connection.query(sql, [req.body.YSS_ID, req.body.password], (err, result, field) => {
        if (err) throw err;
        if (result.length == 1) {
            res.write('SUCCESS');
        } else {
            res.write('ERROR')
        }
        res.end();
    });
});

app.get('/judgeLogin', (req, res) => {
    fs.readFile("HTML/judgeLogin.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    })
});

app.get('/home', (req, res) => {
    fs.readFile("HTML/index.html", 'utf-8', (err, html_res) => {
        if (err) {
            res.writeHead(500);
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(html_res);
        }
        res.end();
    })
});

http.listen(5500, () => {
    console.log('Listening at port 5500.................');
})