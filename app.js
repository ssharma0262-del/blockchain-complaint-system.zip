const contractAddress = "0x2D9C4D9631511032463cbe62493c05072A4FC44e";

const abi = [
    {
        "inputs": [{ "internalType": "string", "name": "_desc", "type": "string" }],
        "name": "submitComplaint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
        "name": "getComplaint",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "address", "name": "", "type": "address" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalComplaints",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("submitBtn").onclick = submitComplaint;
document.getElementById("getBtn").onclick = getComplaint;
document.getElementById("allBtn").onclick = loadAllComplaints;

async function connectWallet() {

    if (typeof window.ethereum === "undefined") {

        alert("Please install MetaMask");

        return;

    }

    provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();

    contract = new ethers.Contract(contractAddress, abi, signer);

    alert("Wallet Connected");

}

async function submitComplaint() {

    const text = document.getElementById("complaintText").value;

    if (text === "") {

        alert("Please write complaint");

        return;

    }

    const tx = await contract.submitComplaint(text);

    await tx.wait();

    alert("Complaint submitted to blockchain");

}

async function getComplaint() {

    const index = document.getElementById("complaintIndex").value;

    const data = await contract.getComplaint(index);

    document.getElementById("result").innerText =
        "Complaint: " + data[0] +
        "\nCitizen: " + data[1];

}

async function loadAllComplaints() {

    const total = await contract.totalComplaints();

    let html = "<table>";

    html += "<tr><th>ID</th><th>Complaint</th><th>Citizen</th></tr>";

    for (let i = 0; i < total; i++) {

        const data = await contract.getComplaint(i);

        html += "<tr>";

        html += "<td>" + i + "</td>";

        html += "<td>" + data[0] + "</td>";

        html += "<td>" + data[1] + "</td>";

        html += "</tr>";

    }

    html += "</table>";

    document.getElementById("complaintList").innerHTML = html;

}