import { Request, Response } from "express";
import { createTinyUrl, getLongUrl } from "../services/urlService";
import { sendClickEvent } from "../services/event.service";

const getUrl = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    let url: string = await getLongUrl(id);
    if (!url) {
      return res.status(404).send({
        error: "URL not found",
      });
    }

    sendClickEvent(
      id,
      url,
      req?.clientIp,
      req?.headers["user-agent"],
      req?.headers["referrer"]?.toString()
    );

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }

    return res.redirect(url);
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

  let url = body.url;
  if (!body.url.startsWith("http://") && !body.url.startsWith("https://")) {
    url = `http://${body.url}`;
  }

  try {
    const tinyUrl = await createTinyUrl(url);
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
