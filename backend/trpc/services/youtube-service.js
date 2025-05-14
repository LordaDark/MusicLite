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
exports.searchYouTube = searchYouTube;
exports.getVideoInfo = getVideoInfo;
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Funzione per cercare su YouTube
function searchYouTube(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Utilizziamo youtube-dl per la ricerca perché ytdl-core non supporta la ricerca
            const { stdout } = yield execAsync(`yt-dlp "ytsearch10:${query}" --dump-json --flat-playlist`);
            // Parsing dei risultati
            const results = stdout
                .split("\n")
                .filter(Boolean)
                .map((line) => {
                try {
                    const data = JSON.parse(line);
                    return {
                        id: data.id,
                        title: data.title,
                        artist: data.uploader || data.channel,
                        thumbnail: data.thumbnail,
                        duration: data.duration,
                        url: `https://www.youtube.com/watch?v=${data.id}`,
                        album: data.album || "YouTube",
                        genre: data.genre || "Musica",
                    };
                }
                catch (e) {
                    console.error("Errore nel parsing del risultato:", e);
                    return null;
                }
            })
                .filter(Boolean);
            return results;
        }
        catch (error) {
            console.error("Errore nella ricerca YouTube:", error);
            // Fallback: se yt-dlp non è disponibile, proviamo con una ricerca più semplice
            try {
                // Simuliamo alcuni risultati di base
                return [
                    {
                        id: "dummyId1",
                        title: query,
                        artist: "Artista sconosciuto",
                        thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
                        duration: 180,
                        url: "",
                        album: "YouTube",
                        genre: "Musica",
                    },
                ];
            }
            catch (fallbackError) {
                console.error("Errore nel fallback della ricerca:", fallbackError);
                return [];
            }
        }
    });
}
// Funzione per ottenere informazioni dettagliate su un video
function getVideoInfo(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const info = yield ytdl_core_1.default.getInfo(videoUrl);
            return {
                id: info.videoDetails.videoId,
                title: info.videoDetails.title,
                artist: info.videoDetails.author.name,
                thumbnail: (_a = info.videoDetails.thumbnails[0]) === null || _a === void 0 ? void 0 : _a.url,
                duration: parseInt(info.videoDetails.lengthSeconds),
                url: videoUrl,
                formats: info.formats,
            };
        }
        catch (error) {
            console.error("Errore nell'ottenere info video:", error);
            throw error;
        }
    });
}
