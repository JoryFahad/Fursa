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
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const stream_1 = require("stream");
let FileUploadService = class FileUploadService {
    configService;
    s3;
    bucket;
    constructor(configService) {
        this.configService = configService;
        const accessKeyId = this.configService.get('MINIO_ACCESS_KEY');
        const secretAccessKey = this.configService.get('MINIO_SECRET_KEY');
        if (!accessKeyId || !secretAccessKey) {
            throw new Error('Missing S3 credentials');
        }
        this.s3 = new client_s3_1.S3Client({
            region: this.configService.get('MINIO_REGION'),
            endpoint: `https://${this.configService.get('MINIO_ENDPOINT')}`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });
        this.bucket = this.configService.get('MINIO_BUCKET');
    }
    async uploadFile(file, userId, internshipId, type) {
        const timestamp = Date.now();
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const key = `${type || 'file'}_${userId || 'u'}_${internshipId || 'i'}_${timestamp}_${(0, uuid_1.v4)()}_${safeOriginalName}`;
        try {
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            return key;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('File upload failed', error?.message);
        }
    }
    async getFileAsBase64(key) {
        try {
            const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
            const response = await this.s3.send(command);
            const chunks = [];
            for await (const chunk of response.Body) {
                chunks.push(Buffer.from(chunk));
            }
            const buffer = Buffer.concat(chunks);
            return buffer.toString('base64');
        }
        catch (error) {
            return null;
        }
    }
    async streamFile(key, res) {
        try {
            const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
            const response = await this.s3.send(command);
            res.setHeader('Content-Type', response.ContentType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
            if (response.Body) {
                const stream = stream_1.Readable.from(response.Body);
                stream.pipe(res);
            }
            else {
                res.status(404).send('File not found');
            }
        }
        catch (error) {
            res.status(404).send('File not found');
        }
    }
    async getFileStream(key) {
        try {
            const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
            const response = await this.s3.send(command);
            if (!response.Body) {
                throw new common_1.InternalServerErrorException('File not found');
            }
            return stream_1.Readable.from(response.Body);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('File not found');
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map