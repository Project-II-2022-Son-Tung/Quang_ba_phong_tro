import { Request, Response } from "express";
import { upload, deleteImage } from './provider/imageProvider';

export default [
    {
        path: "/uploadImages",
        method: "post",
        handler: [
            async (req: Request, res: Response) => {
                upload(req, res, async (err) => {
                    try {
                        if (err) {
                            return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
                        }

                        const file = req.file;
                        if (!file) {
                            return res.status(400).json({
                                "status": "failed",
                                "code": "400",
                                "message": "Please upload file"
                            });
                        }
                        

                        return res.status(200).send(`https://quang-ba-phong-tro.s3.ap-southeast-1.amazonaws.com/${req.file!.key}`);
                    } catch (err) {
                        return res.status(200).json({
                            "status": "failed",
                            "code": "500",
                            "message": err.message
                        });
                    }
                });
            }
        ]
    },
    {
        path: "/deleteImages",
        method: "delete",
        handler: [
            async (req: Request, res: Response) => {
                const fileKey = req.body.key;
                        if (!fileKey) {
                            return res.status(400).json({
                                "status": "failed",
                                "code": "400",
                                "message": "Please provide file key"
                            });
                        }
                const response = await deleteImage(fileKey);
                if(response[0]) {
                    return res.status(200).json({
                        "status": "failed",
                        "code": "500",
                        "message": response[0].message
                    });
                }
                return res.status(200).json({
                    "status": "success",
                    "code": "200",
                    "message": "Delete image success"
                });
            }
        ]
    }
];