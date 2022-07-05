import { Request, Response } from "express";
import { deleteImage } from '../file-upload/provider/imageProvider';

export default [
    {
        path: "/deleteImages",
        method: "delete",
        handler: [
            async (req: Request, res: Response) => {
                const fileKey = req.body.key;
                if (!fileKey) {
                    res.status(400).json({
                        "status": "failed",
                        "code": "400",
                        "message": "Please provide file key"
                    });
                }
                const response = await deleteImage(fileKey);
                if(response[0]) {
                    res.status(200).json({
                        "status": "failed",
                        "code": "500",
                        "message": response[0].message
                    });
                }
                res.status(200).json({
                    "status": "success",
                    "code": "200",
                    "message": "Delete image success"
                });
            }
        ]
    }
];