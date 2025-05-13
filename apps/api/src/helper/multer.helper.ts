import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const maxSize = 1048576

const multerOptions: multer.Options = {
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

        if (file.mimetype.split("/")[0] != "image") {
            return cb(new Error("file type is not image"));
        }
        if (file.mimetype.split("/")[1] !== "png" && file.mimetype.split("/")[1] !== "jpg" && file.mimetype.split("/")[1] !== "jpeg") {
            return cb(new Error("image format is not png, jpg, or jpeg"));
        }
        // console.log(file.mimetype.split("/")[1]);

        const fileSize = parseInt(req.headers["content-length"] || "");

        if (fileSize > maxSize) {
            return cb(new Error("max size 1mb"));
        }
        return cb(null, true);
    },
    limits: {
        fileSize: maxSize, //1mb
    },
}

export const uploader = () => multer({ ...multerOptions })