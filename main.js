//Start
let firstrun=true;
//Add event listener to form
let Form1 = document.querySelector('#form1');

Form1.addEventListener("submit",function(event){
    add(event);
});

//Add: All the magic happen here
async function add(event){
    event.preventDefault();
    //if the program were run,clear canvas
    
    if (firstrun==false){
        $('#stockchart').remove();
        $('#stockinfo').append('<canvas id="stockchart"></canvas>');
        $('#revennueChart').remove();
        $('#trading').append('<canvas id="revennueChart"></canvas>');
    }
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
          
            
            
            const myChart = new Chart(
              document.getElementById('stockchart'),
              config
            );
            var signals=buyandsellsignal(stockclosing);
            document.getElementById("signal").innerText=(signals[signals.length-1]==1)?'buy/hold':"sell/no enter market";
            var used=simulation(stockclosing,signals,investment);
            console.log(used);
            //Prediction graph
            const data2 = {
            labels: fakedate,
            datasets: [{
              label: 'If our stragegy was used',
              data: used,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                
              ],
              borderWidth: 1
            }]
          };
          
          
          const config2 = {
              type: 'line',
              data: data2,
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              },
            };
            
            const myChart2 = new Chart(
              document.getElementById('revennueChart'),
              config2
            );
        const rawData2 = await fetch(
            'https://newsapi.org/v2/everything?q=bitcoin&apiKey=174b4528adfc4310bc2284cc98ab0e3b'
        );
        stocknews=[];
        const stocknew = await rawData2.json();



        firstrun=false
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
//Moving average for stock analysis
function simpleMovingAverage(prices, window = 5) {
    if (!prices || prices.length < window) {
      return [];
    }
  
    let index = window - 1;
    const length = prices.length + 1;
  
    const simpleMovingAverages = [];
  
    while (++index < length) {
      const windowSlice = prices.slice(index - window, index);
      const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
      simpleMovingAverages.push(sum / window);
    }
  
    return simpleMovingAverages;
  }
//Give adive on buy or sell
function buyandsellsignal(prices){
    var MA5=simpleMovingAverage(prices,6);
    var MA10=simpleMovingAverage(prices,9);
    let signal=[]
    while(prices.length>MA5.length){
        MA5.unshift(0);
    }
    while(prices.length>MA10.length){
        MA10.unshift(0);
    }
    for (i=0;i<prices.length;i++){
        if(MA5[i]>MA10[i]){
            signal.push(1);
        }else{
            signal.push(0);
        }
    }
    return signal

}

function simulation(prices,signal,cash){
    var holdingforstock=[0];
    var cashholding=[cash];
    var totalasset=[cash]
    for (i=1;i<signal.length;i++){
        if (signal[i]==1 && cash>0){
            cashholding.push(0);
            holdingforstock.push(cash/prices[i]);
            cash=0;
            
       
        }else if(signal[i]==0 && cash==0){
            cashholding.push(holdingforstock[i-1]*prices[i]);
            cash=holdingforstock[i-1]*prices[i]
            holdingforstock.push(0);
            


        }else{
            cashholding.push(cashholding[i-1]);
            holdingforstock.push(holdingforstock[i-1]);
        }
        totalasset.push(cashholding[i]+holdingforstock[i]*prices[i]);
    }
    return totalasset;
    
}