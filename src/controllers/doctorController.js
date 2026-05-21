// doctorController.js
import { ObjectId } from "mongodb";
import { db } from "../database/db.js";


// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { search, specialty, sort } = req.query;
    
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }
    
    let sortOption = {};
    if (sort === 'fee_asc') {
      sortOption.fee = 1;
    } else if (sort === 'fee_desc') {
      sortOption.fee = -1;
    } else if (sort === 'experience') {
      sortOption.experience = -1;
    } else if (sort === 'rating') {
      sortOption.rating = -1;
    }
    
    const doctorsCollection = db.collection("doctors");
    const doctors = await doctorsCollection.find(query).sort(sortOption).toArray();
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

// Get single doctor
export const getSingleDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    const doctorsCollection = db.collection("doctors");
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
};

// Create doctor
export const createDoctor = async (req, res) => {
  try {
    const { name, specialty, image, experience, availability, description, hospital, location, fee } = req.body;
    
    if (!name || !specialty || !image || !experience || !hospital || !location || !fee) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, specialty, image, experience, hospital, location, fee'
      });
    }
    
    const newDoctor = {
      name,
      specialty,
      image,
      experience,
      availability: availability || ["09:00 AM - 12:00 PM", "04:00 PM - 07:00 PM"],
      description: description || "",
      hospital,
      location,
      fee: Number(fee),
      rating: 0,
      totalReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const doctorsCollection = db.collection("doctors");
    const result = await doctorsCollection.insertOne(newDoctor);
    
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { ...newDoctor, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
};

// Edit doctor
export const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    const doctorsCollection = db.collection("doctors");
    const existingDoctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const updatedFields = {
      ...req.body,
      updatedAt: new Date()
    };
    
    if (updatedFields.fee) {
      updatedFields.fee = Number(updatedFields.fee);
    }
    
    delete updatedFields._id;
    
    const result = await doctorsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedFields },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    const doctorsCollection = db.collection("doctors");
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    await doctorsCollection.deleteOne({ _id: new ObjectId(id) });
    
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error.message
    });
  }
};