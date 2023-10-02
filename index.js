import { ethers } from "./ethers-6.7.0.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect")
const fundButton = document.getElementById("fund")
const withdrawButton = document.getElementById("withdraw")
const balanceButton = document.getElementById("balance")

console.log(ethers)
const Connect = async () => {
    console.log("connect")
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Not Connected"
    }
}
connectButton.onclick = Connect

//fund function
const Fund = async () => {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        //to send transaction
        //provider /connection to the blockchain
        // signer/ wallet/ someone with some gas
        // contract that we are interacting with
        // ABI & Address
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.BaseContract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.parseEther(ethAmount),
            })
            //listen for the tx to be mined
            //wait for this to be finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done!!")
        } catch (error) {
            console.error(error)
        }
    }
}
async function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash} . . .`)
    //create a listener for blockchain
    //listen for this trasaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, async (transactionReceipt) => {
            const confirmation = await transactionReceipt.confirmations()
            console.log(`Completed with ${confirmation} confirmations. `)
            resolve()
        })
    })
}

fundButton.onclick = Fund

const getBalance = async()=>{
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        document.getElementById("balanceValue").innerText = `${ethers.formatEther(balance)} ETH`
        console.log(ethers.formatEther(balance))
    }
}
balanceButton.onclick = getBalance

const Withdraw = async() =>{
    if(typeof window.ethereum !== "undefined"){
        console.log("WithDrawing . . .")
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.BaseContract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        }
        catch(e){
            console.log(e)
        }
    }
}
withdrawButton.onclick = Withdraw