import { Request, Response } from "express";
import { createTinyUrl, getUrl as getLongUrl } from "../services/urlService";

const getUrl = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({
            error: "URL ID is required",
        });
    }

    try {
        const url = await getLongUrl(id);
        if (!url) {
            return res.status(404).send({
                error: "URL not found",
            });
        }
        return res.send({
            message: `Redirecting to ${url}`,
        });
    } catch (error) {
        return res.status(500).send({
            error: "Something went wrong, please try again later",
        });
    }
};

const createUrl = (host: string) => async (req: Request, res: Response) => {
    const body = req.body;
    if (!body?.url) {
        return res.status(400).send({
            error: "Field 'url' is required to create a tiny URL",
        });
    }

    try {
        const tinyUrl = await createTinyUrl(body.url);
        return res.send({
            tinyUrl: `${host}/${tinyUrl}`,
        });
    } catch (error) {
        return res.status(500).send({
            error: "Something went wrong, please try again later",
        });
    }
};

export { getUrl, createUrl };
