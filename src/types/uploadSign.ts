export interface UploadSignInput {
  uid: string;
}

export interface UploadSignResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}
