/* import mongoose from 'mongoose';
import EmailModel from '../Models/EmailModelSchema.js';
import WorkflowState from '../Models/WorkflowStateModel.js';

const resumeWorkflow = async () => {
  try {
    /* const savedState = await mongoose.connection.collection('workflowState').findOne({ _id: 'workflow_state_id' }); *
    const savedState = await WorkflowState.findOne({ _id: 'workflow_state_id' });

    if (savedState && savedState.state) {
      const { currentStage: savedCurrentStage, emailModel: savedEmailModel } = savedState.state;

      // Resume the workflow from the saved state
      currentStage = savedCurrentStage;
      const emailModel = new EmailModel(savedEmailModel);
     await emailModel.save();
      // Modify the emailModel as needed based on your workflow
    } else {
      console.log('No saved workflow state found');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export { resumeWorkflow };
 */

// resumeWorkflow.js

import WorkflowState from '../Models/WorkflowStateModel.js';

const resumeWorkflow = async () => {
  try {
    const savedState = await WorkflowState.findOne({ _id: 'workflow_state_id' });

    console.log('Saved workflow state document:', savedState);

    if (savedState && savedState.state) {
      console.log('Resume workflow state:', savedState.state);
      return savedState.state;
    } else {
      console.log('No saved workflow state found');
      return null;
    }
  } catch (error) {
    console.error('Error while resuming workflow:', error);
    return null;
  }
};

export { resumeWorkflow };
