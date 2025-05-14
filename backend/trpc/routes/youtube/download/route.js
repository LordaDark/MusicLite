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
const zod_1 = require("zod");
const create_context_1 = require("../../../create-context");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
// Schema di input per il download
const downloadInputSchema = zod_1.z.object({
    videoId: zod_1.z.string().min(1),
});
// Directory per i file temporanei
const TEMP_DIR = path_1.default.join(process.cwd(), "temp");
// Assicurati che la directory esista
if (!fs_1.default.existsSync(TEMP_DIR)) {
    fs_1.default.mkdirSync(TEMP_DIR, { recursive: true });
}
exports.default = create_context_1.publicProcedure
    .input(downloadInputSchema)
    .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
    try {
        const videoId = input.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // Verifica che il video esista
        const info = yield ytdl_core_1.default.getInfo(videoUrl);
        // Trova il formato audio con la migliore qualità
        const audioFormat = ytdl_core_1.default.chooseFormat(info.formats, { quality: "highestaudio" });
        if (!audioFormat) {
            throw new Error("Nessun formato audio disponibile");
        }
        // Genera un nome file univoco
        const fileName = `${(0, uuid_1.v4)()}.mp3`;
        const filePath = path_1.default.join(TEMP_DIR, fileName);
        // Scarica il file
        const stream = (0, ytdl_core_1.default)(videoUrl, { format: audioFormat });
        const fileStream = fs_1.default.createWriteStream(filePath);
        // ✅ CORRETTO: funzione senza parametri
        yield new Promise((resolve, reject) => {
            stream.pipe(fileStream);
            fileStream.on("finish", () => resolve()); // ✅ fix qui
            fileStream.on("error", reject);
        });
        // Restituisci l'URL per il download
        return {
            downloadUrl: `/api/download/${fileName}`,
            title: info.videoDetails.title,
            artist: info.videoDetails.author.name,
            duration: parseInt(info.videoDetails.lengthSeconds),
        };
    }
    catch (error) {
        console.error("Errore nel download:", error);
        throw new Error("Errore nel download del video");
    }
}));
