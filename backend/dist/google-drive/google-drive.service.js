"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const stream_1 = require("stream");
const path = require("path");
let GoogleDriveService = class GoogleDriveService {
    driveClient;
    constructor() {
        const keyFile = path.join(__dirname, '../../secrets/fursa-resume-storage-64b60f941786.json');
        this.driveClient = googleapis_1.google.drive({
            version: 'v3',
            auth: new googleapis_1.google.auth.GoogleAuth({
                keyFile,
                scopes: ['https://www.googleapis.com/auth/drive'],
            }),
        });
    }
    async uploadFile({ fileBuffer, filename, folderId, mimeType, }) {
        try {
            const res = await this.driveClient.files.create({
                requestBody: {
                    name: filename,
                    parents: [folderId],
                },
                media: {
                    mimeType,
                    body: stream_1.Readable.from(fileBuffer),
                },
                fields: 'id, webViewLink',
            });
            const file = res.data;
            if (!file.webViewLink) {
                throw new common_1.InternalServerErrorException('Google Drive did not return a webViewLink for the uploaded file.');
            }
            return { fileId: file.id, webViewLink: file.webViewLink };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to upload file to Google Drive', error.message);
        }
    }
    async streamFile(fileId, res) {
        try {
            const driveRes = await this.driveClient.files.get({
                fileId,
                alt: 'media',
            }, { responseType: 'stream' });
            res.setHeader('Content-Type', driveRes.headers['content-type'] || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${fileId}"`);
            driveRes.data.pipe(res);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to download file from Google Drive', error.message);
        }
    }
};
exports.GoogleDriveService = GoogleDriveService;
exports.GoogleDriveService = GoogleDriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleDriveService);
//# sourceMappingURL=google-drive.service.js.map