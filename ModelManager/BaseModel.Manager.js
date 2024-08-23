const mongoose = require("mongoose");

module.exports.baseManager = class baseManager {
  constructor(model) {
    this.model = model;
  }

  // Create a new record
  async create(data, session) {
    try {
      const collectionName = this.model.collection.name;
      //const newRecord = await this.model.create(data,{session});
      const newRecord = new this.model(data);
      await newRecord
        .save({ session })
        .then((newRecord) => {
          console.log(`${collectionName} saved successfully:`, newRecord);
        })
        .catch((error) => {
          console.error(`${collectionName} saving:`, error);
        });

      return newRecord;
    } catch (error) {
      throw new Error(`Error creating record: ${error.message}`);
    }
  }

  // Retrieve all records
  async getAll() {
    try {
      const allRecords = await this.model.find();
      return allRecords;
    } catch (error) {
      throw new Error(`Error retrieving records: ${error.message}`);
    }
  }

  // Retrieve a record by ID
  async getById(id) {
    try {
      const record = await this.model.findById(id);
      return record;
    } catch (error) {
      throw new Error(`Error retrieving record: ${error.message}`);
    }
  }

  // Update a record by ID
  async updateById(id, data, session) {
    try {
      const updatedRecord = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        session,
      });
      return updatedRecord;
    } catch (error) {
      throw new Error(`Error updating record: ${error.message}`);
    }
  }

  // Delete a record by ID
  async deleteById(id, session) {
    try {
      const deletedRecord = await this.model.deleteOne(
        { _id: id },
        { session }
      );
      return deletedRecord;
    } catch (error) {
      throw new Error(`Error deleting record: ${error.message}`);
    }
  }

  // Delete many records by some criteria
  async deleteMany(criteria, session) {
    try {
      const deletedRecords = await this.model.deleteMany(criteria, {
        session,
      });
      return deletedRecords;
    } catch (error) {
      throw new Error(`Error deleting record: ${error.message}`);
    }
  }

  // find one document by some criteria
  async findOne(data) {
    try {
      const record = await this.model.findOne(data);
      return record;
    } catch (error) {
      throw new Error(`Error retrieving record: ${error.message}`);
    }
  }

  // get many records by some criteria
  async getManyByCriteria(criteria) {
    try {
      let records = await this.model.find(criteria).exec();
      return records;
    } catch (error) {
      throw new Error(`Error getting record: ${error.message}`);
    }
  }
};
