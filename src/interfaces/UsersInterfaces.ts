export interface ICreate {
    name: string;
    email: string;
    password: string;
}

export interface IUpdate {
    name: string;
    old_password: string;
    new_password: string;
    avatar_url?: FileUpload;
    user_id: string
}

interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}