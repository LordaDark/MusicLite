"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicProcedure = exports.createTRPCRouter = exports.createContext = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
// Context creation function
const createContext = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        req: opts.req,
        // You can add more context items here like database connections, auth, etc.
    };
});
exports.createContext = createContext;
// Initialize tRPC
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
});
exports.createTRPCRouter = t.router;
exports.publicProcedure = t.procedure;
