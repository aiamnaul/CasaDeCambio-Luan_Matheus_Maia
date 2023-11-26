(async function () {
  let coin = await searchCoinFETCH()
  loadSelectCoin(coin)
})()

async function searchCoinFETCH() {
  var response = await fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado,tipoMoeda")
  return response.json();
  
}

function loadSelectCoin(coin) {
  let coinList = document.querySelectorAll('.selectCoinsList')
  for (let i = 0; i < coin.value.length; i++) {
      let optionCoin = document.createElement("option")
      optionCoin.value = coin.value[i].simbolo
      optionCoin.innerText = coin.value[i].nomeFormatado

      coinList.forEach(select => {
          select.appendChild(optionCoin.cloneNode(true))
      })
  }
}

var currentDate = new Date();
var day = String(currentDate.getDate()).padStart(2, '0');
var month = String(currentDate.getMonth() + 1).padStart(2, '0');
var year = currentDate.getFullYear();

formattedDate = month + '-' + day + '-' + year;

selectIn.addEventListener('change', async () => {
  let response = await fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + selectIn.value + "'&@dataCotacao='" + formattedDate + "'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,tipoBoletim");
  let object = await response.json();

  let index = object.value[0];
  buy = index.cotacaoCompra;
  sale = index.cotacaoVenda;
});


selectFor.addEventListener('change', async () => {
  let response = await fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + selectFor.value + "'&@dataCotacao='" + formattedDate + "'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,tipoBoletim");
  let object = await response.json();

  let index = object.value[0];
  buy = index.cotacaoCompra;
  sale = index.cotacaoVenda;
});

async function quoteSearchFETCH(coin) {
  let response = await fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + coin + "'&@dataCotacao='" + formattedDate + "'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,tipoBoletim");
  let object = await response.json();

  let index = object.value[0];
  return index;
}


document.getElementById('convert').addEventListener('click', async function () {
  let coinIn = document.getElementById('selectIn').value;
  let coinFor = document.getElementById('selectFor').value;
  let valueCoin = Number(document.getElementById('valorInput').value);
  let conversion = document.querySelector('input[name="radioCheckInput"]:checked').value;

  let quoteIn
  

  if (coinIn == 'BRL') {
    quoteIn = 1;
  } else{
      let selectIn = await buscarCotacaoFETCH(coinIn);
      quoteIn = conversion === 'buy' ? selectIn.cotacaoVenda : selectIn.cotacaoCompra;
  }
    
  let quoteFor

  if (coinFor == 'BRL') {
    let quoteFor= 1;
  } else{
      let selectFor = await buscarCotacaoFETCH(coinFor);
      cotacaoPara = operacao === 'sell' ? selectFor.cotacaoCompra : selectFor.cotacaoVenda;
  }

  let quote = quoteIn * valueCoin / quoteFor;

  document.querySelector('#idOut').innerText = `Valor convertido: ${quote.toFixed(2)}`;
});