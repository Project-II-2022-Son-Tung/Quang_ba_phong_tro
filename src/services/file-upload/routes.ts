import { Request, Response } from "express";
import { upload } from './provider/imageProvider';

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
                        
                        const key = req.file! as (Express.Multer.File | undefined) & {key: string};
                        return res.status(200).send(`https://quang-ba-phong-tro.s3.ap-southeast-1.amazonaws.com/${key.key}`);
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
    }
];