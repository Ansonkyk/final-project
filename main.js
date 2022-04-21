
//Add event listener to form
let Form1 = document.querySelector('#form1');

Form1.addEventListener("submit",function(event){
    add(event);
});

//Add: All the magic happen here
async function add(event){
    event.preventDefault();
    //Two value from the form
    let symbol = document.querySelector("#symbol");
    let amount = document.querySelector("#amount");
    let investment=amount.value;
    let stock=symbol.value;

   //check if the input are valid
    if (onlyLetters(stock)&&onlynumbers(investment)){
        investment=Number(investment);
        console.log(investment);
        console.log(stock);
        //Getting date for stock
        var today=dategetter();
        var startdate=lastyeardategetter();
        console.log(today);
        console.log(startdate);
        //Geting stock data
        let apiKey = $("#apikey").val();
        console.log(apiKey)
        const rawData = await fetch(
           `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startdate}/${today}?adjusted=true&sort=asc&apiKey=${apiKey}`
        );
        stockclosing=[];
        const stockdata = await rawData.json();
        console.log(stockdata);
        for (var j = 0; j < stockdata.results.length; j++){
            stockclosing.push(stockdata.results[j].c);
            
        }
        console.log(stockclosing)
        //Output some of the highlight
        document.getElementById("latestprice").innerHTML=stockclosing[stockclosing.length-1];
        var rev=(stockclosing[stockclosing.length-1]-stockclosing[0])/stockclosing[0];
        document.getElementById("lastyearrev").innerText=rev;
        var fakedate=[...Array(stockclosing.length).keys()];
        const data = {
            labels: fakedate,
            datasets: [{
              label: 'Last year stock data',
              data: stockclosing,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                
              ],
              borderWidth: 1
            }]
          };
          
          
          const config = {
              type: 'line',
              data: data,
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              },
            };
          
          
          
            const myChart2 = new Chart(
              document.getElementById('stockchart'),
              config
            );


        
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
    var dd = String(today.getDate()).padStart(2, '0')-1;
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}
//Last year today
function lastyeardategetter(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear()-1;
    
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

