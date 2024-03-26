require('dotenv').config();
const pool = require('../config/db');

const addProperty = async ( 
    propertyId, landlordId, propertyLocation, furnished, toatalArea,
    numberOfBedrooms, numberOfBathrooms, numberOfKitchen, 
    parkingSpaces,type) =>{

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('INSERT INTO property(property_id,landlord_id,property_location,furnished,total_area,number_of_bedrooms,number_of_bathrooms,number_of_kitchen,parking_spaces,type)VALUES(?,?,?,?,?,?,?,?,?,?);', 
           [propertyId,landlordId,propertyLocation,furnished,toatalArea,numberOfBedrooms,numberOfBathrooms,numberOfKitchen,parkingSpaces,type]);    
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const removeProperty = async (propertyId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('DELETE FROM property WHERE property_id = ?;', [propertyId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }   
}

const modifyProperty = async (propertyId, attrVal) => {
    const connection = await pool.getConnection();
    try {
        const updates = attrVal.map(({ attribute, value }) => `${attribute} = ?`).join(', ');
        const values = attrVal.map(({ value }) => value);
        const query = `UPDATE property SET ${updates} WHERE property_id = ?`;
        values.push(propertyId);
        const [rows] = await connection.execute(query, values);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
}


const getProperty = async (propertyId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM property WHERE property_id = ?;', [propertyId]);
        connection.release();
        return rows[0];
    } catch (err) {
        throw err;
    }   
}

const getAllProperties = async () =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM property;');
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }   
}

const setAvaliable = async (propertyId) =>{
    const val = 1000;
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE property SET ? =  WHERE property_id = ?;', [val,propertyId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }     
} 

const setUnAvaliable = async (propertyId) =>{
    const val = 2000;
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE property SET ? =  WHERE property_id = ?;', [val,propertyId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }     
}

const addAmenities = async (propertyId, amenities) => {
    const connection = await pool.getConnection();
    try {
      const placeholders = amenities.map(() => '(?, ?)').join(',');
      const values = amenities.reduce((acc, amenity) => {
        acc.push(propertyId, amenity.amenityName);
        return acc;
      }, []);
  
      const query = `INSERT INTO amenities (property_id, ameniry_name) VALUES ${placeholders}`;
      const [rows] = await connection.execute(query, values);
      connection.release();
      return rows;
    } catch (err) {
      throw err;
    }
};
  
module.exports = {
    addAmenities,
    addProperty,
    removeProperty,
    modifyProperty,
    getAllProperties,
    getProperty,
    setAvaliable,
    setUnAvaliable
}