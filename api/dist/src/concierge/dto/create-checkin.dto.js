"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckInDto = exports.RegimenAdherenceDto = exports.PillarMetricDto = void 0;
class PillarMetricDto {
    category;
    score;
    notes;
}
exports.PillarMetricDto = PillarMetricDto;
class RegimenAdherenceDto {
    regimenId;
    adherent;
    notes;
}
exports.RegimenAdherenceDto = RegimenAdherenceDto;
class CreateCheckInDto {
    patientId;
    type;
    date;
    pillars;
    adherence;
    notes;
}
exports.CreateCheckInDto = CreateCheckInDto;
//# sourceMappingURL=create-checkin.dto.js.map