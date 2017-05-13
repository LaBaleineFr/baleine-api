import express from "express";

import wordDefinitionRoutes from "./word-definitions";

const router = express.Router();

router.use("/word-definitions", wordDefinitionRoutes);

export default router;