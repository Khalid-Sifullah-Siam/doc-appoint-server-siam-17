import { Router } from "express";
import { 
  getAllAppointments, 
  getSingleAppointment, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from "../controllers/appointmentController.js";

const router = Router();

router.get("/", getAllAppointments);
router.get("/:id", getSingleAppointment);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;