import * as express from "express";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
    return res.status(200).send('OK');
});
router.get("/info", async (req: express.Request, res: express.Response) => {
    return res.status(200).send('OK');
});

export default router;