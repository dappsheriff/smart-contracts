import {Provider} from "zksync-web3";
import * as ethers from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

// load env file
import dotenv from "dotenv";
// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/DappSheriff.sol/DappSheriff.json";

dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
    throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

    // Initialize the provider.
    // @ts-ignore
    const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const anotherSigner = new ethers.Wallet(
        process.env.ANOTHER_PRIVATE_KEY, provider
    );

    // Initialize contract instance
    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractArtifact.abi,
        signer
    );

    // let tx = await contract.safeMint(signer.address, "I like this dapp", {value: ethers.utils.parseEther("0.003")});
    // await tx.wait();
    //
    // console.log("Minted token 1");
    //
    // let priceTx = await contract.setPrice(ethers.utils.parseEther("0.001"));
    // await priceTx.wait();
    //
    // tx = await contract.safeMint(signer.address, "This one I like too", {value: ethers.utils.parseEther("0.001")});
    // await tx.wait();
    //
    // console.log("Minted token 2");
    //
    // await contract.balanceOf(signer.address).then((balance) => {
    //     console.log(`Your balance is: ${balance}`);
    // });
    //
    // await signer.provider.getBalance(signer.address).then((balance) => {
    //     console.log(`Balance of deployer is: ${balance}`);
    // });
    //
    // await signer.provider.getBalance(CONTRACT_ADDRESS).then((balance) => {
    //     console.log(`Balance of contract is: ${balance}`);
    // });

    let withdrawTx = await contract.withdraw();
    await withdrawTx.wait();

    await signer.provider.getBalance(signer.address).then((balance) => {
        console.log(`Balance of deployer is: ${balance}`);
    });

    await signer.provider.getBalance(CONTRACT_ADDRESS).then((balance) => {
        console.log(`Balance of contract is: ${balance}`);
    });

    // const anotherContract = new ethers.Contract(
    //     CONTRACT_ADDRESS,
    //     ContractArtifact.abi,
    //     anotherSigner,
    // );
    // let anotherTx = await anotherContract.withdraw();
    // console.log("Withdrawed from another signer");
}
