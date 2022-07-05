import fileUpload from './file-upload/routes';
import fileDelete from './file-delete/routes';

export default [
    ...fileUpload,
    ...fileDelete
];