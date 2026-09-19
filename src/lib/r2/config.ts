export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

export function isR2Configured() {
  return (
    (process.env.R2_ACCOUNT_ID ?? "") !== "" &&
    (process.env.R2_ACCESS_KEY_ID ?? "") !== "" &&
    (process.env.R2_SECRET_ACCESS_KEY ?? "") !== "" &&
    (process.env.R2_BUCKET ?? "") !== ""
  );
}

export function getR2Config(): R2Config {
  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 is not configured: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET",
    );
  }
  return {
    accountId: process.env.R2_ACCOUNT_ID as string,
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    bucket: process.env.R2_BUCKET as string,
  };
}
