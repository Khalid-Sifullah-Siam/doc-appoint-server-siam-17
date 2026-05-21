import { ObjectId } from "mongodb";
import { db } from "../database/db.js";


// Get all appointments (with optional filtering)
export const getAllAppointments = async (req, res) => {
  try {
    const { userEmail, doctorId, status } = req.query;
    
    let query = {};
    
    if (userEmail) {
      query.userEmail = userEmail;
    }
    
    if (doctorId) {
      query.doctorId = doctorId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const appointmentsCollection = db.collection("appointments");
    const appointments = await appointmentsCollection
      .find(query)
      .sort({ appointmentDate: -1, createdAt: -1 })
      .toArray();
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Get single appointment
export const getSingleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    
    const appointmentsCollection = db.collection("appointments");
    const appointment = await appointmentsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
};

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { 
      userEmail, 
      doctorName, 
      doctorId,
      patientName, 
      gender, 
      phone, 
      appointmentDate, 
      appointmentTime,
      fee,
      hospital 
    } = req.body;
    
    if (!userEmail || !doctorName || !patientName || !gender || !phone || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const newAppointment = {
      userEmail,
      doctorName,
      doctorId,
      patientName,
      gender,
      phone,
      appointmentDate,
      appointmentTime,
      fee: fee || 0,
      hospital: hospital || '',
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const appointmentsCollection = db.collection("appointments");
    const result = await appointmentsCollection.insertOne(newAppointment);
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: { ...newAppointment, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    
    const appointmentsCollection = db.collection("appointments");
    const existingAppointment = await appointmentsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    const updatedFields = {
      ...req.body,
      updatedAt: new Date()
    };
    
    delete updatedFields._id;
    delete updatedFields.userEmail;
    delete updatedFields.doctorName;
    delete updatedFields.doctorId;
    
    const result = await appointmentsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedFields },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully!',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    
    const appointmentsCollection = db.collection("appointments");
    const appointment = await appointmentsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    await appointmentsCollection.deleteOne({ _id: new ObjectId(id) });
    
    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
};