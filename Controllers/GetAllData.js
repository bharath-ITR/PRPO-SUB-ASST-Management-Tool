import EmailModel from "../Models/EmailModelSchema.js";
export const GetAllData = async (request, response) => {
  try {
    const getApproversResponse = await EmailModel.find();
    response.status(200).json(getApproversResponse);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};