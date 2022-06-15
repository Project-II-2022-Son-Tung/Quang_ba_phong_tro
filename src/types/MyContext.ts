import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { EntityManager } from "typeorm";
export type MyContext = {
    req: Request & 
    { session: Session & Partial<SessionData> & {name?: string, userId?: string, role?: string} };
    res: Response;
    connection: EntityManager;
}