import express from "express";

import wordDefinitionsCtrl from "../controllers/word-definitions";

const router = express.Router();

router.route("/")
    /** GET /word-definitions - Get list of word definitions */
    .get(wordDefinitionsCtrl.list);

export default router;