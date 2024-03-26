require('dotenv').config();
const pool = require('../config/db');

const createListing = async ( 
    listingId, listingDate, title, description, pricePerDay, stays
    ) =>{

    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(            
        'INSERT INTO listing(listing_id, list_date, title, description, stays, price_per_day)VALUES(?,?,?,?,?,?);', 
        [listingId, listingDate, title, description, pricePerDay, stays]);    

        connection.release();
        return result;
    } catch (err) {
        throw err;
    }
}

const removeListing = async (listingId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('DELETE FROM listing WHERE listing_id = ?;', [listingId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }   
}

const getListing = async (listingId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM listing WHERE listing_id = ?;', [listingId]);
        connection.release();
        return rows[0];
    } catch (err) {
        throw err;
    }   
}

const getPageListing = async (page) => {
    const connection = await pool.getConnection();
    try {
        const offset = (page - 1) * 20; // Assuming 20 rows per page
        const [rows] = await connection.execute(`SELECT * FROM property LIMIT 20 OFFSET ${offset};`);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }   
}


const reportListing = async (userId,listingId,reportDate,reportBody) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('INSERT INTO reports(user_id,listing_id,report_date,report_body)VALUES(?,?,?,?)', [userId,listingId,reportDate,reportBody]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }     
} 

const viewListing = async (listingId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE listing SET views = views + 1 WHERE property_id = ?;', [listingId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }     
}
  
module.exports = {
    createListing,
    removeListing,
    getPageListing ,
    getListing ,
    reportListing,
    viewListing,
}