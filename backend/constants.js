module.exports = Object.freeze({
    SECRET : 'somesupersecretsecret',

    validationFail : 'Validation failed.',
    userCreated : 'User created!',
    notFoundUserWithEmail : 'A user with this email could not be found.',
    wrongPassword : 'Wrong password!',
    notAuthenticated : 'Not authenticated.',
    logoutSuccess : "User logged out successfully",

    useUpdate : 'Slot already created for this user. Use update',
    slotCreated : 'Slot created',
    notFoundSlot : 'Could not find slot.',
    slotUpdated : 'Slot updated!',
    provideRating : 'Rating must be provided.',
    notFoundInterviewer : 'Could not find interviewer.',
    notFoundInterview : 'Could not find interview.',
    feedbackAlreadyGiven : 'Feedback already given.',
    feedbackGiven : 'Feedback given',
    notFoundCandidate : 'No such candidate exists.',
    cannotUpdateAfterScheduled : "Cannot update slot after candidate is scheduled.",

    taexecOperations : '1. OnboardCandidate 2. OnboardInterviewer 3. Add/update Candidate’s availability',
    interviewerOperations : '1. Add/update own availability 2.Provide ratings for a candidate. 3. Accept/Reject Candidate’s availability',
    notFoundUser : 'Could not find user.',

    validationError : 'Validation error, please enter correct data',
    onboardedInterviewer : 'Interviewer onboarded successfully!',
    removeOnlyInterviewer : 'Only interviewer can be removed!',
    deletedUser : 'Deleted user.',
    candidateAlreadyOnboarded : 'This candidate is already onboarded',
    noResume : 'No resume provided.',
    onboardedCandidate : 'Candidate onboarded successfully!',
    candidateSlotUpdated : 'Candidate slot availability updated!',
    notScheduledCandidateInterview : 'No scheduled interview for this candidate.',
    interviewScheduled : 'Interview scheduled...',
    candidateJourney : 'Candidate Journey',

    notAuthenticated : 'Not authenticated.',
    loginAgain : 'User was logged out. Login again',

    interviewerAlreadyExist : 'This named interviewer already exist',
    userNotInterviewer : 'Not an interviewer to perform this operation',

    userNotTAE : 'Not a TA Executive to perform this operation',

    candidateStatus : {
        created : "created",
        scheduled : "scheduled",
        selected : "selected",
        rejected : "rejected"
    },

    feedbackNA : "Candidate feedback not available",
    interviewStatus : {
        created : "created",
        selected : "selected",
        rejected : "rejected"
    },

    userType : {
        ta_exec : "ta_exec",
        interviewer : "interviewer"
    },

    errorInterviewer : 'Error extracting interviewer',
    errorCandidate : 'Error extracting candidate',
    candidateNotScheduled : 'Candidate was not scheduled',
    interviewScheduled : 'Interviews scheduled ',

});