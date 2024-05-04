import { eventModel } from "@/models/event-models";
import { userModel } from "@/models/user-model";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/utils/data-util";
import mongoose from "mongoose";

const getAllEvents = async (query) => {
  try {
    let allEvents = [];
    if (query) {
      const regex = new RegExp(query, "i");
      allEvents = await eventModel.find({ name: { $regex: regex } }).lean();
    } else {
      allEvents = await eventModel.find().lean();
    }

    return replaceMongoIdInArray(allEvents);
  } catch (error) {
    console.log(error.message);
  }
};
const getEventById = async (eventId) => {
  try {
    const event = await eventModel.findById(eventId).lean();
    return replaceMongoIdInObject(event);
  } catch (error) {
    console.log(error.message);
  }
};

const createUser = async (user) => {
  return await userModel.create(user);
};

const findUserByCredentials = async (credential) => {
  const user = await userModel.findOne(credential).lean();
  if (user) {
    return replaceMongoIdInObject(user);
  }
  return null;
};

const updateInterest = async (eventId, authId) => {
  const event = await eventModel.findById(eventId);

  if (event) {
    const foundUsers = event.interested_ids.find(
      (id) => id.toString() === authId
    );

    if (foundUsers) {
      event.interested_ids.pull(new mongoose.Types.ObjectId(authId));
    } else {
      event.interested_ids.push(new mongoose.Types.ObjectId(authId));
    }

    event.save();
  }
};

const updateGoing = async (eventId, authId) => {
  const event = await eventModel.findById(eventId);
  event.going_ids.push(new mongoose.Types.ObjectId(authId));
  event.save();
};

export {
  getAllEvents,
  getEventById,
  createUser,
  findUserByCredentials,
  updateInterest,
  updateGoing,
};
