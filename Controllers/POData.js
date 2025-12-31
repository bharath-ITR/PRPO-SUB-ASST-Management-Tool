import EmailModel from "../Models/EmailModelSchema.js";

export const POData = async (request,response) => {
    try {
  
    const getAllData = await EmailModel.find({ status: 'Ready For Purchase' }).sort({_id:-1}) ;
  
      response.status(200).json(getAllData);
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: error.message });
    }
  };
  