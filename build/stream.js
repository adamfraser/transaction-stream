import { ethers } from "ethers";
const alchemy_web_sockets = "wss://eth-mainnet.alchemyapi.io/v2/vvhzsVtuHax-1LePk528uK7uLcwY1FI8";
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["ALCHEMY_RATE_LIMIT_ERROR"] = 429] = "ALCHEMY_RATE_LIMIT_ERROR";
})(ErrorCodes || (ErrorCodes = {}));
const init = () => {
    const provider = new ethers.providers.WebSocketProvider(alchemy_web_sockets);
    console.log("----------------Monitoring Transaction Pool-----------------");
    provider.on("pending", async (tx) => {
        if (tx) {
            await provider
                .getTransaction(tx)
                .then((txResponse) => {
                if (txResponse) {
                    console.log(txResponse.hash);
                }
            })
                .catch((error) => {
                handleError(error);
            });
        }
    });
    provider.on("error", async (error) => {
        handleError(error);
    });
    provider.on("close", async (code) => {
        console.log("---------------- CLOSE -----------------");
        console.log(`Connection lost with code ${code}! Attempting reconnect in 3s...`);
        setTimeout(init, 3000);
    });
    const handleError = (error) => {
        if (error.code === ErrorCodes.ALCHEMY_RATE_LIMIT_ERROR) {
        }
        else {
            console.log(error);
        }
    };
};
init();
