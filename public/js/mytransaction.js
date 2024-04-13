$(document).ready(function() {  

    if(typeof window.ethereum !== "undefined")
    {
        const getAccount = async () => {
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            return accounts[0];
        }


        getAccount().then((account) => {    
            $.ajax({
                url: "https://api-sepolia.etherscan.io/api",
                type: "GET",
                data:{
                    module: "account",
                    action:"txlist",
                    address:account,
                    startblock:0,
                    endblock:99999999,
                    page:1,
                    offset:10,
                    sort:"desc",
                    apikey:"CV7WQDZZGPVU18RZP4QHNJGPQUDZH2Z11K",
                }
            }).done(function(response) {

                if(response.result.length > 0){
                
                    let html = '';
                    let i=0;
                    window.web3 = new Web3(window.ethereum);
                    
            
                    for (let key in response.result) {
                        const priceWei = window.web3.utils.fromWei(String(response.result[key].value), 'ether');
                        let date = new Date(response.result[key].timeStamp * 1000);
                        html += '<div class="card card-5">' +
                                '<h5> Transaction: ' + ++i + '</h5>' +
                                '<h5> Hash: ' + response.result[key].hash + '</h5>' +
                                '<h5> From: ' + response.result[key].from + '</h5>' +
                                '<h5> To: ' + response.result[key].to + '</h5>' +
                                '<h5> Amount: ' + priceWei + ' ETH </h5>' +
                                '<h5> Date: ' + date.toString() + '</h5>' +
                                '<h5> Block: ' + response.result[key].blockNumber + '</h5>' +
                                '<h5> Type: ' + response.result[key].functionName + '</h5>' +
                                '</div>';
                    }
            
                    $('#transactions').empty();
                    $('#transactions').append(html);
                }else{
                    $('#transactions').empty();
                    $('#transactions').append('<h3>No transactions found</h3>');
                }
        
            });

        });
    }
    

    
});