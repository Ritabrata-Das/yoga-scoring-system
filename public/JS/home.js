let judgeCard = document.getElementById('judgeCard');
let candidateCard = document.getElementById('candidateCard');
let adminCard = document.getElementById('adminCard');

adminCard.addEventListener('click',(e)=>{
    window.open('/adminLogin');
}); 

judgeCard.addEventListener('click', ()=>{
    window.open('/judgeLogin');
});

candidateCard.addEventListener('click',(e)=>{
    window.open('/candidateLogin');
});