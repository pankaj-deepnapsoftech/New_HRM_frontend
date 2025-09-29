import * as Yup from 'yup';

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

// Allow existing string URLs/paths during edit. Only validate when a new File/Blob is provided
const isPassingFileSize = (value) => {
  if (!value) return true; // handled by required
  if (typeof value === 'string') return true; // existing uploaded file URL/path
  const file = Array.isArray(value) ? value[0] : value;
  return file && typeof file.size === 'number' ? file.size <= FILE_SIZE : true;
};

const isPassingFileType = (value) => {
  if (!value) return true;
  if (typeof value === 'string') return true;
  const file = Array.isArray(value) ? value[0] : value;
  return file && file.type ? SUPPORTED_FORMATS.includes(file.type) : true;
};

const EmpDetailsSchema = Yup.object().shape({


  // File validations
  aadhaar: Yup.mixed()
    .required('Aadhaar file is required')
    .test('fileSize', 'File too large', value => isPassingFileSize(value))
    .test('fileType', 'Unsupported file format', value => isPassingFileType(value)),

  pancard: Yup.mixed()
    .required('PAN card is required')
    .test('fileSize', 'File too large', value => isPassingFileSize(value))
    .test('fileType', 'Unsupported file format', value => isPassingFileType(value)),

  Driving_Licance: Yup.mixed()
    .required('Driving license is required')
    .test('fileSize', 'File too large', value => isPassingFileSize(value))
    .test('fileType', 'Unsupported file format', value => isPassingFileType(value)),

  Voter_Id: Yup.mixed()
    .required('Voter ID is required')
    .test('fileSize', 'File too large', value => isPassingFileSize(value))
    .test('fileType', 'Unsupported file format', value => isPassingFileType(value)),

  Bank_Proof: Yup.mixed()
    .required('Bank proof is required')
    .test('fileSize', 'File too large', value => isPassingFileSize(value))
    .test('fileType', 'Unsupported file format', value => isPassingFileType(value)),

  UAN_number: Yup.string()
    .matches(/^\d+$/, 'UAN must be numeric')
    .required('UAN number is required'),

  Back_Name: Yup.string().required('Bank name is required'),
  Bank_Account: Yup.string().required('Bank account number is required'),
  IFSC_Code: Yup.string().required('IFSC code is required')
});

export default EmpDetailsSchema;
