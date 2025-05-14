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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create_context_1 = require("../../../create-context");
const youtube_service_1 = require("../../../services/youtube-service");
// Schema di input per la ricerca
const searchInputSchema = zod_1.z.object({
    query: zod_1.z.string().min(1),
});
exports.default = create_context_1.publicProcedure
    .input(searchInputSchema)
    .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
    try {
        const results = yield (0, youtube_service_1.searchYouTube)(input.query);
        return {
            items: results,
        };
    }
    catch (error) {
        console.error("Errore nella ricerca YouTube:", error);
        throw new Error("Errore nella ricerca YouTube");
    }
}));
