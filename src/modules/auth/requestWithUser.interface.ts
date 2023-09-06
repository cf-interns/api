import { Request } from "express";

import { User } from "../user/user.entity";

interface RequestObjectWithUser extends Request {
    user: User
}


export default RequestObjectWithUser;