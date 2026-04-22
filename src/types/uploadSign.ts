export interface UploadSignInput {
  uid: string;
}

export interface UploadSignResult {
  signature: string;
  timestamp: number;
  apiKey: string | undefined;
  cloudName: string | undefined;
  folder: string;
}
