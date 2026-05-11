import "dotenv/config";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "../../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    //change the image uri to your image uri obtained from nft_image.ts
    const image =
      "https://gateway.irys.xyz/BjPcATdHaXmRH9zQPMCkwj9paEmcJHHjQymp5BKfaNUY";

    const metadata = {
      name: "Solana secure note",
      description:
        "SSN is a secure note NFT that allows you to store your secrets on chain",
      image,
      attributes: [{ trait_type: "Rarity", value: "Legendary" }],

      properties: {
        files: [
          {
            type: "image/jpeg",
            uri: image,
          },
        ],
        category: "image",
      },
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log(`metadata uri: ${myUri} `);
  } catch (error) {
    console.log("error", error);
  }
})();

// metadata uri: https://gateway.irys.xyz/65kmGsSvTFDadegNktvS7yNZ8tYAeMgCxp3MwzkWSzVT
