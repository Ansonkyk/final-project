//Start with updated the graph from locla storage data
let firstrun = false;
//declare chart
let list1 = document.getElementById("RevRanking");
let list2 = document.getElementById("Bestsuit");
savedStockandrev = JSON.parse(localStorage.getItem('savedStockwithrev'));
if (savedStockandrev === null) {
    savedStockandrev = [];
    firstrun=true;
}
savedStockandrev.sort(function (a, b) {
    return ((a.rev > b.rev) ? -1 : ((a.rev == b.rev) ? 1 : 0));
});

savedStockandrev.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item.stock.concat(" ", item.rev);
    list1.appendChild(li);
});
savedStockandrev.sort(function (a, b) {
    return ((a.bestsuit > b.bestsuit) ? -1 : ((a.bestsuit == b.bestsuit) ? 1 : 0));
});

savedStockandrev.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item.stock.concat(" ", item.bestsuit);
    list2.appendChild(li);
});
holding = JSON.parse(localStorage.getItem('holding'));
if (holding === null) {
    holding = [];
    firstrun=true;
}
list3 = document.getElementById("stockholding");
holding.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = `Stock:${item.stock},Average Price:${Math.round(item.price*100)/100},Number of stock:${Math.round(item.amount*100)/100}`
    list3.appendChild(li);
});

//Add event listener to form
let Form1 = document.querySelector('#form1');

Form1.addEventListener("submit", function (event) {
    add(event);
});

//Add: All the magic happen here
async function add(event) {
    event.preventDefault();
    //if the program were run,clear canvas and news list
    let list = document.getElementById("newslist");
    let list1 = document.getElementById("RevRanking");
    let list2 = document.getElementById("Bestsuit");
    if (firstrun == false) {
        var child = list.lastElementChild;
        $('#stockchart').remove();
        $('#stockinfo').append('<canvas id="stockchart"></canvas>');
        $('#revennueChart').remove();
        $('#trading').append('<canvas id="revennueChart"></canvas>');
        while (child) {
            list.removeChild(child);
            child = list.lastElementChild;
        };

        var child1 = list1.lastElementChild;
        var child2 = list2.lastElementChild;
        while (child1) {
            list1.removeChild(child1);
            child1 = list1.lastElementChild;
        }
        while (child2) {
            list2.removeChild(child2);
            child2 = list2.lastElementChild;
        }
    }
    //Two value from the form
    let symbol = document.querySelector("#symbol");
    let amount = document.querySelector("#amount");
    let investment = amount.value;
    let stock = symbol.value;

    //check if the input are valid
    if (onlyLetters(stock) && onlynumbers(investment)) {
        investment = Number(investment);
        console.log(investment);
        console.log(stock);
        //Getting date for stock
        var today = dategetter();
        var startdate = lastyeardategetter();
        console.log(today);
        console.log(startdate);
        //Geting stock data

        let apiKey = $("#apikey").val();
        console.log(apiKey)
        const rawData = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startdate}/${today}?adjusted=true&sort=asc&apiKey=${apiKey}`
        );
        //This api us used to grab sock data on daily bases
        stockclosing = [];
        const stockdata = await rawData.json();
        console.log(stockdata);
        for (var j = 0; j < stockdata.results.length; j++) {
            stockclosing.push(stockdata.results[j].c);

        }
        console.log(stockclosing)
        //Output some of the highlight
        document.getElementById("latestprice").innerHTML = stockclosing[stockclosing.length - 1];
        var rev = (stockclosing[stockclosing.length - 1] - stockclosing[0]) / stockclosing[0];
        document.getElementById("lastyearrev").innerText = rev;
        document.getElementById("SD").innerText = dev(stockclosing)
        var fakedate = [...Array(stockclosing.length).keys()];
        //Plot last year price
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
                        beginAtZero: false
                    }
                }
            },
        };



        const myChart = new Chart(
            document.getElementById('stockchart'),
            config

        );
        //Caluclate data for next chart
        var signals = buyandsellsignal(stockclosing);
        document.getElementById("signal").innerText = (signals[signals.length - 1] == 1) ? 'buy/hold' : "sell/not enter market";
        var used = simulation(stockclosing, signals, investment);
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
                        beginAtZero: false
                    }
                }
            },
        };

        const myChart2 = new Chart(
            document.getElementById('revennueChart'),
            config2
        );
        document.getElementById("usedrev").innerText = ((used[used.length - 1] - used[0]) / used[0])
        document.getElementById("SDused").innerText = dev(used)
        //Geting stock news
        let apiKey2 = $("#apikey2").val();
        console.log(apiKey2)
        //This api will grab stock data
        const rawData2 = await fetch(
            `https://newsapi.org/v2/everything?q=${stock}&apiKey=${apiKey2}`
        );
        const stocknews = await rawData2.json();
        console.log(stocknews);
        stocknewslist = [];
        for (var j = 0; j < stocknews.articles.length; j++) {
            stocknewslist.push(stocknews.articles[j].title);

        }
        console.log(stocknewslist)
        //Puting news in to stock list

        stocknewslist.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);
        });
        //Save stock and rev start with renew both table

        savedStockandrev = JSON.parse(localStorage.getItem('savedStockwithrev'));
        if (savedStockandrev === null) {
            savedStockandrev = [];
        }

        savedStockandrev.push({ "stock": stock, "rev": rev, "bestsuit": ((used[used.length - 1] - used[0]) / used[0]) });
        savedStockandrev.sort(function (a, b) {
            return ((a.rev > b.rev) ? -1 : ((a.rev == b.rev) ? 1 : 0));
        });

        savedStockandrev.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item.stock.concat(" ", item.rev);
            list1.appendChild(li);
        });
        savedStockandrev.sort(function (a, b) {
            return ((a.bestsuit > b.bestsuit) ? -1 : ((a.bestsuit == b.bestsuit) ? 1 : 0));
        });

        savedStockandrev.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item.stock.concat(" ", item.bestsuit);
            list2.appendChild(li);
        });
        //localStorage.setItem('key','value') - adds a key value pair into your local storage that will persist even after you refresh or exist the page
        localStorage.setItem('savedStockwithrev', JSON.stringify(savedStockandrev));

        firstrun = false
    } else {
        alert('error input!!')
    }
};

//Add event listener to clear button
let clear = document.querySelector('#clear');

clear.addEventListener("click", function (event) {
    clearhitory(event);

});
// this botton is created to delete all browsing history
function clearhitory(event) {
    event.preventDefault();
    localStorage.setItem('savedStockwithrev', JSON.stringify([]));
    let list1 = document.getElementById("RevRanking");
    let list2 = document.getElementById("Bestsuit");
    //update list
    if (firstrun == false) {
        var child1 = list1.lastElementChild;
        var child2 = list2.lastElementChild;
        while (child1) {
            list1.removeChild(child1);
            child1 = list1.lastElementChild;
        }
        while (child2) {
            list2.removeChild(child2);
            child2 = list2.lastElementChild;
        }
    }
}


//Add buy and sell function
//Add event listener to form
let buy = document.querySelector('#buy');
let sell = document.querySelector('#sell');
buy.addEventListener("click", function (event) {
    buystock(event);


});

sell.addEventListener("click", function (event) {
    sellstock(event);

});

async function buystock(event) {
    event.preventDefault()

    //grab user input
    let symbol = document.querySelector("#symbol");
    let amount = document.querySelector("#amount");
    let investment = Number(amount.value);
    let stock = symbol.value;
    var today = dategetter();
    var startdate = lastyeardategetter();
    let apiKey = $("#apikey").val();
    console.log(apiKey)
    const rawData = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startdate}/${today}?adjusted=true&sort=asc&apiKey=${apiKey}`
    );
    stockclosing = [];
    const stockdata = await rawData.json();
    console.log(stockdata);
    for (var j = 0; j < stockdata.results.length; j++) {
        stockclosing.push(stockdata.results[j].c);

    }
    console.log(stockclosing)
    //Output some of the highlight
    var latestprice = stockclosing[stockclosing.length - 1];
    holding = JSON.parse(localStorage.getItem('holding'));
    if (holding === null) {
        holding = [];
    }

    let founded = false;
    for (i = 0; i < holding.length; i++) {
        if (holding[i].stock == stock) {
            //Update price
            holding[i].price = (holding[i].price * holding[i].amount + investment) / (holding[i].amount + investment / latestprice);
            //Update amount
            holding[i].amount += investment / latestprice;
            alert(`You bought ${investment / latestprice} of ${stock} for ${latestprice} per share,new total stock is ${holding[i].amount} with average of ${holding[i].price}`);
            founded = true;
            break;
        }

    }
    if (founded == false) {
        //We didn't bought this stock before
        holding.push({ "stock": stock, "price": latestprice, "amount": investment / latestprice, "date": today });
        alert(`You bought ${investment / latestprice} of ${stock} for ${latestprice} per share`)

    }
    $('#stockholding').remove();
    $('#previousstock').append('<ul id="stockholding"></ul>');
    var list3 = document.getElementById("stockholding");

    holding.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = `Stock:${item.stock},Average Price:${Math.round(item.price*100)/100},Number of stock:${Math.round(item.amount*100)/100}`
        list3.appendChild(li);
    });
    console.log(holding)
    localStorage.setItem('holding', JSON.stringify(holding));


};
async function sellstock(event) {
    let list3 = document.getElementById("stockholding");
    let symbol = document.querySelector("#symbol");
    let stock = symbol.value;
    var today = dategetter();
    var startdate = lastyeardategetter();
    let apiKey = $("#apikey").val();
    console.log(apiKey)
    const rawData = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startdate}/${today}?adjusted=true&sort=asc&apiKey=${apiKey}`
    );
    stockclosing = [];
    const stockdata = await rawData.json();
    console.log(stockdata);
    for (var j = 0; j < stockdata.results.length; j++) {
        stockclosing.push(stockdata.results[j].c);

    }
    console.log(stockclosing)
    //Output some of the highlight
    var latestprice = stockclosing[stockclosing.length - 1];
    holding = JSON.parse(localStorage.getItem('holding'));
    console.log(holding)
    if (holding === null) {
        holding = [];
        alert("Sorry, this stock was not bought,error1")
        return;
    }
    let c = 1;
    let used = false;
    for (i = 0; i < holding.length; i++) {
        if (holding[i].stock == stock) {
            c = i;
            let stockbuyingprice = holding[c].price;
            let rev = (latestprice - stockbuyingprice) * holding[c].amount;
            alert(rev > 0 ? `You gain ${rev} on ${holding[i].stock}!!` : `You lose ${rev} on ${holding[i].stock}, Good luck next time`);
            holding.splice(c, 1);
            console.log(holding)
            used = true;
            break;
        } else {
            c++;
        }

    }
    if (used == false) { alert("Sorry, this stock was not bought,error2"); return; };



    $('#stockholding').remove();
    $('#previousstock').append('<ul id="stockholding"></ul>');
    list3 = document.getElementById("stockholding");
    holding.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = `Stock:${item.stock},Average Price:${Math.round(item.price*100)/100},Number of stock:${Math.round(item.amount*100)/100}`
        list3.appendChild(li);
    });

    localStorage.setItem('holding', JSON.stringify(holding));
}




//Function for Checking input
function onlynumbers(str) {
    return /^\d+$/.test(str)
}
function onlyLetters(str) {
    return /^[a-zA-Z]+$/.test(str);
}

//Date getter
function dategetter() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0') - 1;
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}
//Last year today
function lastyeardategetter() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear() - 1;

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
function buyandsellsignal(prices) {
    var MA5 = simpleMovingAverage(prices, 6);
    var MA10 = simpleMovingAverage(prices, 9);
    let signal = []
    while (prices.length > MA5.length) {
        MA5.unshift(0);
    }
    while (prices.length > MA10.length) {
        MA10.unshift(0);
    }
    for (i = 0; i < prices.length; i++) {
        if (MA5[i] > MA10[i]) {
            signal.push(1);
        } else {
            signal.push(0);
        }
    }
    return signal

}

function simulation(prices, signal, cash) {
    var holdingforstock = [0];
    var cashholding = [cash];
    var totalasset = [cash]
    for (i = 1; i < signal.length; i++) {
        if (signal[i] == 1 && cash > 0) {
            cashholding.push(0);
            holdingforstock.push(cash / prices[i]);
            cash = 0;


        } else if (signal[i] == 0 && cash == 0) {
            cashholding.push(holdingforstock[i - 1] * prices[i]);
            cash = holdingforstock[i - 1] * prices[i]
            holdingforstock.push(0);



        } else {
            cashholding.push(cashholding[i - 1]);
            holdingforstock.push(holdingforstock[i - 1]);
        }
        totalasset.push(cashholding[i] + holdingforstock[i] * prices[i]);
    }
    return totalasset;

}

function dev(arr) {
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => {
        return acc + curr
    }, 0) / arr.length;

    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k) => {
        return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr) => acc + curr, 0);

    // Calculating the variance
    let variance = sum / arr.length

    // Returning the Standered deviation
    return Math.sqrt(sum / arr.length)
}

let killall = document.getElementById("killswitch");
killall.addEventListener("click", function (event) {
    localStorage.clear();
});






