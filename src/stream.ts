import { ethers, Transaction } from "ethers";
import { syncBuiltinESMExports } from "module";

const alchemy_web_sockets =
  "wss://eth-mainnet.alchemyapi.io/v2/vvhzsVtuHax-1LePk528uK7uLcwY1FI8";

enum ErrorCodes {
  ALCHEMY_RATE_LIMIT_ERROR = 429,
}

const init = () => {
  const provider = new ethers.providers.WebSocketProvider(alchemy_web_sockets);

  console.log("----------------Monitoring Transaction Pool-----------------");

  provider.on("pending", async (tx: Transaction["hash"]) => {
    if (tx) {
      await provider
        .getTransaction(tx)
        .then((txResponse) => {
          console.log(txResponse.hash);
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
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    setTimeout(init, 3000);
  });

  const handleError = (error: { code: number }) => {
    if (error.code === ErrorCodes.ALCHEMY_RATE_LIMIT_ERROR) {
      console.log("---- Rate limit reached ----");
    } else {
      console.log(error);
    }
  };
};

init();
