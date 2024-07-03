import { RowDataPacket } from "mysql2";

// export interface User extends RowDataPacket {
//   id?: string;
//   username: string;
//   password: string;
// }

declare global {
  namespace Express {
    interface User extends RowDataPacket {
      id: string;
      password: string;
    }

    interface Request {
      user?: User;
    }
  }
}
