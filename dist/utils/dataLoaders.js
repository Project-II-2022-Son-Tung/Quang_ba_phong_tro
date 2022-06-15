"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDataLoaders = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const SubjectTutor_1 = require("../entities/SubjectTutor");
const SpecialityTutor_1 = require("../entities/SpecialityTutor");
const batchGetSubjectTutors = async (subjectIds) => {
    const subjectTutors = await SubjectTutor_1.SubjectTutor.find({
        join: {
            alias: "subjectTutor",
            innerJoinAndSelect: {
                tutor: "subjectTutor.tutor",
            }
        },
        where: {
            subjectId: (0, typeorm_1.In)(subjectIds)
        }
    });
    const subjectIdToTutors = {};
    subjectTutors.forEach(subjectTutor => {
        if (subjectTutor.subjectId in subjectIdToTutors) {
            subjectIdToTutors[subjectTutor.subjectId].push(subjectTutor.__tutor__);
        }
        else {
            subjectIdToTutors[subjectTutor.subjectId] = [subjectTutor.__tutor__];
        }
    });
    return subjectIds.map(subjectId => subjectIdToTutors[subjectId]);
};
const batchGetSpecialityTutors = async (specialityIds) => {
    const specialityTutors = await SpecialityTutor_1.SpecialityTutor.find({
        join: {
            alias: "specialityTutor",
            innerJoinAndSelect: {
                tutor: "specialityTutor.tutor",
            }
        },
        where: {
            specialityId: (0, typeorm_1.In)(specialityIds)
        }
    });
    const specialityIdToTutors = {};
    specialityTutors.forEach(specialityTutor => {
        if (specialityTutor.specialityId in specialityIdToTutors) {
            specialityIdToTutors[specialityTutor.specialityId].push(specialityTutor.__tutor__);
        }
        else {
            specialityIdToTutors[specialityTutor.specialityId] = [specialityTutor.__tutor__];
        }
    });
    return specialityIds.map(specialityId => specialityIdToTutors[specialityId]);
};
const batchGetTutorSubjects = async (tutorIds) => {
    const subjectTutors = await SubjectTutor_1.SubjectTutor.find({
        join: {
            alias: "subjectTutor",
            innerJoinAndSelect: {
                subject: "subjectTutor.subject",
            }
        },
        where: {
            tutorId: (0, typeorm_1.In)(tutorIds)
        }
    });
    const tutorIdToSubjects = {};
    subjectTutors.forEach(subjectTutor => {
        if (subjectTutor.tutorId in tutorIdToSubjects) {
            tutorIdToSubjects[subjectTutor.tutorId].push(subjectTutor.__subject__);
        }
        else {
            tutorIdToSubjects[subjectTutor.tutorId] = [subjectTutor.__subject__];
        }
    });
    return tutorIds.map(tutorId => tutorIdToSubjects[tutorId]);
};
const batchGetTutorSpecialities = async (tutorIds) => {
    const specialityTutors = await SpecialityTutor_1.SpecialityTutor.find({
        join: {
            alias: "specialityTutor",
            innerJoinAndSelect: {
                speciality: "specialityTutor.speciality",
            }
        },
        where: {
            tutorId: (0, typeorm_1.In)(tutorIds)
        }
    });
    const tutorIdToSpecialities = {};
    specialityTutors.forEach(specialityTutor => {
        if (specialityTutor.tutorId in tutorIdToSpecialities) {
            tutorIdToSpecialities[specialityTutor.tutorId].push(specialityTutor.__speciality__);
        }
        else {
            tutorIdToSpecialities[specialityTutor.tutorId] = [specialityTutor.__speciality__];
        }
    });
    return tutorIds.map(tutorId => tutorIdToSpecialities[tutorId]);
};
const buildDataLoaders = () => ({
    subjectTutorsLoader: new dataloader_1.default(subjectIds => batchGetSubjectTutors(subjectIds)),
    tutorSubjectsLoader: new dataloader_1.default(tutorIds => batchGetTutorSubjects(tutorIds)),
    specialityTutorsLoader: new dataloader_1.default(subjectIds => batchGetSpecialityTutors(subjectIds)),
    tutorSpecialitiesLoader: new dataloader_1.default(tutorIds => batchGetTutorSpecialities(tutorIds)),
});
exports.buildDataLoaders = buildDataLoaders;
//# sourceMappingURL=dataLoaders.js.map