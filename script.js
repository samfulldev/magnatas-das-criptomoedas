

    // --- TICKER: busca cotações via CoinGecko (projeto protótipo) ---
    const coins = ['bitcoin','ethereum','tether','usd-coin','binancecoin','ripple'];
    async function fetchPrices(){
      try{
        const ids = coins.join(',');
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        const track = document.getElementById('tickerTrack');
        track.innerHTML='';
        coins.forEach(id=>{
          if(data[id]){
            const price = data[id].usd.toLocaleString('en-US',{style:'currency',currency:'USD'});
            const change = (data[id].usd_24h_change||0).toFixed(2);
            const item = document.createElement('span');
            item.className='ticker-item';
            item.innerHTML=`${id.toUpperCase()}: ${price} <small style="color:${change>=0? 'var(--accent-green)':'var(--accent-red)'}">(${change}% 24h)</small>`;
            track.appendChild(item);
          }
        });
        // duplicate items so the scroll looks continuous
        track.innerHTML += track.innerHTML;
      }catch(e){
        console.error('Erro ao buscar preços',e);
      }
    }
    fetchPrices();
    setInterval(fetchPrices,30000); // atualiza a cada 30s

    // --- Gráficos com Chart.js (dados simulados no protótipo) ---
    const ctx1 = document.getElementById('marketCapChart').getContext('2d');
    const marketChart = new Chart(ctx1,{
      type:'bar',
      data:{labels:['Jan','Mar','May','Jul','Sep','Nov'],datasets:[{label:'Market Cap (US$ bi)',data:[800,820,860,900,940,980],backgroundColor:'rgba(255,255,255,0.06)'}]},
      options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
    });

    const ctx2 = document.getElementById('dominanceChart').getContext('2d');
    const domChart = new Chart(ctx2,{type:'doughnut',data:{labels:['Bitcoin','Ethereum','Outras'],datasets:[{data:[45,20,35]}]}});

    // Accessibility: enable keyboard focus for ticker (pause on focus)
    const ticker = document.querySelector('.ticker');
    ticker.tabIndex=0;
    ticker.addEventListener('focus', ()=>{document.querySelector('.ticker-track').style.animationPlayState='paused'});
    ticker.addEventListener('blur', ()=>{document.querySelector('.ticker-track').style.animationPlayState='running'});

    // Fallback: se CORS bloquear CoinGecko, o protótipo continua com placeholders
