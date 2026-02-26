import { identityTool } from './identity.tool';
import { proofOfAddressTool } from './proof-of-address.tool';
import { powerOfAttorneyTool } from './power-of-attorney.tool';
import { medicalPrescriptionTool } from './medical-prescription.tool';
import { anvisaAuthorizationTool } from './anvisa-authorization.tool';
import { unknownDocumentTool } from './unknown-document.tool';

export function getTools() {
  return [
    identityTool(),
    proofOfAddressTool(),
    powerOfAttorneyTool(),
    medicalPrescriptionTool(),
    anvisaAuthorizationTool(),
    unknownDocumentTool(),
  ];
}
