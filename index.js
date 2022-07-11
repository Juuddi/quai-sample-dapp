const detectEthereumProvider = require ('@metamask/detect-provider');
const connectButton = document.getElementById('connect');
const connectButtonContainer = document.getElementById('connect-button');
const balanceDisplay = document.getElementById('balance-display');
const accountsList = document.getElementById('accounts-list');
const accountsAlert = document.getElementById('connect-accounts-alert');
const flaskAlert = document.getElementById('flask-notinstalled-alert');
flaskAlert.style.display = "none";


const initialize = async () => { 
    let accounts = [];
    let currentAccount = "";

    const provider = await detectEthereumProvider();
    const isFlask = (
        await provider?.request({ method: 'web3_clientVersion' })
    )?.includes('flask');
    
    const onClickConnect = async () => {
        await ethereum.request({
            method: 'wallet_enable',
            params: [{wallet_snap: { ['npm:@quainetwork/quai-snap']: {version: '0.1.0-pre.25'} },
            }]
        }); 
        let newAccounts = await ethereum.request({        
            method: 'wallet_invokeSnap', 
            params: ['npm:@quainetwork/quai-snap', {
                method: 'getAccounts'
            }]
        });
        newAccounts.sort(compare);
        if (newAccounts.length > 0) {
            handleNewAccounts(newAccounts);
        } else {
            const response = await ethereum.request({
                method: 'wallet_invokeSnap',
                params: ['npm:@quainetwork/quai-snap', {
                        method: 'generateAllAccounts'
                    }]
            })
        }
    }

    const isFlaskConnected = () => accounts && accounts.length > 0

    const updateConnectButton = () => {
        const connectionCheck = !isFlaskConnected() && !isFlask;
        if (!isFlask) {
            console.log('Flask is not installed.');
            connectButton.innerHTML = '<a href="https://metamask.io/flask/" target="_blank">Install MetaMask Flask</a>';
            $('flask-notinstalled-alert').show();
            flaskAlert.style.display = "block";
        } if (isFlaskConnected()) {
            console.log('Flask connected, accounts recieved.');
            connectButton.disabled = true;
            setCurrentAccount(accounts);
        } else if (isFlask) {
            console.log('Flask is installed but not connected.');
            connectButton.onclick = onClickConnect;
            connectButton.innerHTML = 'Connect with Flask';
            connectButton.disabled = false;
        }
    }

    function handleNewAccounts(newAccounts) {
        accounts = newAccounts;
        populateAccounts(accounts);
        updateConnectButton();
    }
    updateConnectButton();

    const setCurrentAccount = async (accounts) => {
        const currentAccount = accounts[0].addr;
        let slice1 = currentAccount.slice(0,6);
        let slice2 = currentAccount.slice(38,42);
        let displayAddr = slice1 + "..." + slice2;
        connectButton.innerHTML = 'Connected: ' + displayAddr;
        const response = await ethereum.request({
            method: 'wallet_invokeSnap',
            params: ['npm:@quainetwork/quai-snap', {
                    method: 'setCurrentAccount',
                    address: currentAccount
                }]
        })
        console.log("The Current Account has been set to: " + currentAccount);
        getAccountBalance(currentAccount);
    }

    const getAccountBalance = async (currentAccount) => {
        const balance = await ethereum.request({
            method: 'wallet_invokeSnap',
            params: ['npm:@quainetwork/quai-snap', {
                    method: 'getBalance',
                    address: currentAccount
                }]
        })
        console.log("The Balance of the Current Account is: " + balance);
        balanceDisplay.innerHTML = balance + " QUAI";

    }

    function populateAccounts() {
        console.log(accounts)
        for (let i=0; i < accounts.length; i++) {
            let accountObj = accounts[i];
            let address = accountObj.addr;
            let displayAccount = address.slice(0,10);
            let newAccount = document.createElement('div');
            newAccount.id = address;
            newAccount.innerHTML = accountObj.shard + ":" + displayAccount + "...";
            newAccount.style.padding = '6px';
            $('accounts-list').show();
            accountsList.appendChild(newAccount);
            accountsAlert.style.display = "none";
        }
    }

}
window.addEventListener('DOMContentLoaded', initialize); // Initialize the app when the DOM loads

//sort accounts array numerically by the name of the account
function compare(a,b) {
    if (a.name.slice(-2) < b.name.slice(-2))
        return -1;
    if (a.name.slice(-2) > b.name.slice(-2))
        return 1;
    return 0;
}
