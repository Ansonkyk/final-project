//Add event listener to form
let Form1 = document.querySelector('#form1');

Form1.addEventListener("submit",function(event){
    add(event);
});

//Add: All the magic happen here
function add(event){
    event.preventDefault();
    //Two value from the form
    let symbol = document.querySelector("#symbol");
    let amount = document.querySelector("#amount");
    let investment=amount.value;
    let stock=symbol.value;

   //check if the input are valid
    if (onlyLetters(stock)&&onlynumbers(investment)){
        investment=Number(investment)
        console.log(investment)
        console.log(stock)
        var today=dategetter();
        var startdate=lastyeardategetter();
        console.log(today)
        console.log(startdate)


    }else{
        alert('error input!!')
    }
};



//Function for Checking input
function onlynumbers(str){
    return /^\d+$/.test(str)
}
function onlyLetters(str) {
    return /^[a-zA-Z]+$/.test(str);
}

//Date getter
function dategetter(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}
//Last year today
function lastyeardategetter(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear()-1;
    
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}