let account = null;
 //   connect the contract with window
 const ABI = [
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
];
const contractAddress = "0xaa30f0Cd5624c50E58460D95af25B630495Fa60E";


function setCookie(name, value){
    const d = new Date();
    d.setTime(d.getTime() + (2*24*60*60*1000)); // 2 days
    let expires = "expires="+ d.toUTCString();
    document.cookie = name+"="+value+";"+expires+";path=/";
    return;
}

function getCookie(name){
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i=0; i<ca.length; i++){
        let c = ca[i];
        while(c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(cname) == 0){
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

const deleteCookie = async (name) =>{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return;
}



const checkLogin = async () => { 
    let userStatus = false;
    await ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
        if(err.code === -32002)
        {
            $('.loginDub').show();
            $('#bannerBuyNow').hide();
        }
    });
}

const getAccount = async () => {
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    return accounts[0];
}

const logout = async () => {  
    if (window.ethereum) {
        // Request Metamask to clear accounts
        await window.ethereum.request({ 
            method: 'wallet_revokePermissions', 
            params: [
                {
                    eth_accounts: {},
                },
            ], 
        }).then((response) => {
            deleteCookie("loggedIn");
        }).catch((error) => {
            console.error(error);
        });
    }
}



  const getBalance = async () => { // const getBalance is the HTML function & .contract.getBalance is the smart contract function
    
    window.web3 = new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    
    const data = await window.contract.methods.getBalance().call();
    const ETHBalance = window.web3.utils.fromWei(data, "ether");
    $('#balInput').val(`Contract Balance: ${ETHBalance} ETH`);
  }

  const depositContract = async (account) => {
    
    const amount = $("#depositAmt").val();
    if(amount!==''){
        window.web3 = new Web3(window.ethereum);
        window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
        const amountInWei = window.web3.utils.toWei(amount, "ether");
        $('#preloader').show();

      try {
        await window.contract.methods.deposit().send({ from: account, value: amountInWei }).then((response) => {
            alert('deposit successful');
            location.reload();
        });
        
      } catch (error) {

        alert('failed to deposit');
        location.reload();
      }

    }else{
        alert('Please enter the amount to deposit');
    }
    
  }

  const withDrawAmount = async (amount, address, account) => {
    window.web3 = new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    // Convert Ether amount to Wei
    const amountInWei = window.web3.utils.toWei(amount.toString(), "ether");
    $('#preloader').show();

    // Withdraw the amount from the contract
    try {
      const result= await window.contract.methods
      .withdraw(address, amountInWei)
      .send({ from: account })
      .then((response) => {
        alert("Withdrawal successful");
        location.reload();
      });
      
    } catch (error) {
      alert("failed");
      location.reload();
    }
    

  };


$(document).ready(function(){
    // ethereum account changed event listener
    if(typeof window.ethereum !== "undefined")
    {
        window.ethereum.on("accountsChanged", function(accounts){
            setCookie("loggedIn", "true");
            location.reload();
        });

        //  check if user is logged in
        if(getCookie("loggedIn") == "true")
        {
            getAccount().then((account) => {
                $('.login').hide();
                $('.preloader2').fadeOut(); 
		        $('#preloader2').delay(550).fadeOut('slow'); 
            });
        }
    }

    if (typeof window.ethereum == "undefined") {
        $('.login').hide();
        deleteCookie("loggedIn");
        $('.metamaskBtn').show();
        if(!document.getElementById("homepage")){
            window.location.href = "/";
        }
    }

    $('.login').click(function(){
        checkLogin();
    });

    $('#logout').click(function(){
        logout();
    });

    // methods
    $('#getMyAccount').click(function(e){
        e.preventDefault();
        getAccount().then((myAccount) => {
            $('#accInput').val(`Account Address: ${myAccount}`);
        });
        

    })

    $('#DepoloyedContractAddress').click(function(e){
        e.preventDefault();
        $('#conInput').val(`Contract Address: ${contractAddress}`);
    });

    $('#getBalance').click(function(e){
        e.preventDefault();
        getBalance();
    });

    $('#depositFund').click(function(e){
        e.preventDefault();
        getAccount().then((myAccount) => {
            depositContract(myAccount);
        });
    });

    $('#withdraw').click(function(e){
        e.preventDefault();
        getAccount().then((myAccount) => {
            var address= $('#accAddress').val();
            var eth= $('#eth').val();
            if(eth == "" || address == ""){
                alert("Please enter the amount and address to withdraw");
            }
            withDrawAmount(eth, address, myAccount);
        });
    });

    $('.contact_form_inner').submit(function(e){
        e.preventDefault();
        alert('Message received. We will get back to you shortly.');
        location.reload();
    });
});