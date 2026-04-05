type SyncUserInput = {
  id: string;
  name: string;
  email: string;
};

type SyncUserServiceResult = {
  id: string;
  alreadySynced: boolean;
};

export { SyncUserInput, SyncUserServiceResult };
