// Define buttons and modules
const detectEthereumProvider = require ('@metamask/detect-provider');
const connectButton = document.getElementById('connect');
const balanceDisplay = document.getElementById('balance-display');
const accountsList = document.getElementById('accounts-list');
const accountsAlert = document.getElementById('connect-accounts-alert');
const flaskAlert = document.getElementById('flask-notinstalled-alert');
flaskAlert.style.display = "none";

const initialize = async () => { 
    // Flask logic goes here
}
window.addEventListener('DOMContentLoaded', initialize); // Initialize the app when the DOM loads