const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// remove sync for default build directory
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// compile the campaign contract
const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source,1).contracts;

fs.ensureDirSync(buildPath);

// output to build directory & different contract
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','')+'.json'),
        output[contract]
    );
}