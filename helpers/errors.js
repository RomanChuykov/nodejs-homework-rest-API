export function HttpError(status,message){
    const error= new Error(message);
    error.status=status;
    return error;
}
export function handleSaveError(error,data,next){
    const {name, code}=error;
    error.status=400;
    next()
}
export default HttpError;