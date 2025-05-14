"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const create_context_1 = require("./create-context");
const route_1 = __importDefault(require("./routes/example/hi/route"));
const route_2 = __importDefault(require("./routes/youtube/search/route"));
const route_3 = __importDefault(require("./routes/youtube/download/route"));
exports.appRouter = (0, create_context_1.createTRPCRouter)({
    example: (0, create_context_1.createTRPCRouter)({
        hi: route_1.default,
    }),
    youtube: (0, create_context_1.createTRPCRouter)({
        search: route_2.default,
        download: route_3.default,
    }),
});
