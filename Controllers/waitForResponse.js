import EmailModel from "../Models/EmailModelSchema.js";

export const waitForResponse=async(tokens, sendTo)=>{
    try {
      return new Promise(async (resolve) => {
        const interval = setInterval(async () => {
          const email = await EmailModel.findOne({
            'reportingToAndSupervisor.sendTo': sendTo,
            $or: [
              { 'reportingToAndSupervisor.tokens.approve': tokens.approve },
              { 'reportingToAndSupervisor.tokens.reject': tokens.reject },
            ],
          });
  
          if (email) {
            const reportingToResponse = email.reportingToAndSupervisor.find(entry => entry.sendTo === sendTo);
            if (reportingToResponse && reportingToResponse.response !== '') {
              clearInterval(interval);
              resolve(reportingToResponse.response);
            }
          }
        }, 1000); // Poll every 1 second
      } );
    } catch (error) {
      console.error('Error waiting for response:', error);
    }
  }