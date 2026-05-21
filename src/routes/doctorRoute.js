// doctorRoute.js
import { Router } from "express";
import { getAllDoctors, getSingleDoctor, createDoctor, editDoctor, deleteDoctor } from "../controllers/doctorController.js";

const router = Router();

router.get("/", getAllDoctors);
router.get("/:id", getSingleDoctor);
router.post("/", createDoctor);
router.put("/:id", editDoctor);
router.delete("/:id", deleteDoctor);

export default router;