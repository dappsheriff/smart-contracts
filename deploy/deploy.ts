import {Wallet} from "zksync-web3";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployer} from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
import {ethers} from "ethers";

dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
    throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the DappSheriff contract`);

    // Initialize the wallet.
    const wallet = new Wallet(PRIVATE_KEY);

    // Create deployer object and load the artifact of the contract you want to deploy.
    const deployer = new Deployer(hre, wallet);
    const artifact = await deployer.loadArtifact("DappSheriff");

    // Estimate contract deployment fee

    // ⚠️ OPTIONAL: You can skip this block if your account already has funds in L2
    // Deposit funds to L2
    // const depositHandle = await deployer.zkWallet.deposit({
    //   to: deployer.zkWallet.address,
    //   token: utils.ETH_ADDRESS,
    //   amount: ethers.utils.parseEther("10"),
    // });
    // // Wait until the deposit is processed on zkSync
    // await depositHandle.wait();

    const deploymentFee = await deployer.estimateDeployFee(artifact, []);
    // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
    // `greeting` is an argument for contract constructor.
    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

    const dappsheriffContract = await deployer.deploy(artifact);

    //obtain the Constructor Arguments
    console.log(
        "Constructor args:" + dappsheriffContract.interface.encodeDeploy()
    );

    // Show the contract info.
    const contractAddress    = dappsheriffContract.address;
    console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

    // verify contract for tesnet & mainnet
    if (process.env.NODE_ENV != "test") {
        // Contract MUST be fully qualified name (e.g. path/sourceName:contractName)
        const contractFullyQualifedName = "contracts/DappSheriff.sol:DappSheriff";

        // Verify contract programmatically
        const verificationId = await hre.run("verify:verify", {
            address: contractAddress,
            contract: contractFullyQualifedName,
            bytecode: artifact.bytecode,
        });
    } else {
        console.log(`Contract not verified, deployed locally.`);
    }
}
