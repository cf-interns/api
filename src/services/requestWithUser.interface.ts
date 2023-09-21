import { Request } from "express";

import { User } from "../domains/user.entity";

interface RequestObjectWithUser extends Request {
    user: User
}


export default RequestObjectWithUser;