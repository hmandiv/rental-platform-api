type SyncUserInput = {
  id: string;
  name: string;
  email: string;
};

type SyncUserResult =
  | {
      type: "validation_error";
      message: string;
    }
  | {
      type: "already_synced";
      data: {
        id: string;
        alreadySynced: true;
      };
    }
  | {
      type: "created";
      data: {
        id: string;
        alreadySynced: false;
      };
    };

export { SyncUserInput, SyncUserResult };
