import express from'express';
import joi from "joi";
import * as contactsFunctions from "../../models/contacts.js";
import HttpError from "../../helpers/errors.js";
const router = express.Router()

const contactAddChema = joi.object({
  name: joi.string().required().messages({
    'any.required': 'missed required name field',
  }),
  email: joi.string().required().messages({
    'any.required': 'missed required email field',
  }),
  phone: joi.string().required().messages({
    'any.required': 'missed required phone field',
  }),
  favorite:joi.boolean(),
});

const contactPutChema=joi.object({
  name:joi.string(),
  email:joi.string(),
  phone:joi.string()
})
const contactFavoriteChema=joi.object({
  favorite: joi.boolean().required()
})
// ==========================================================

router.get('/', async (req, res, next) => { 
  const result= await contactsFunctions.listContacts();
  console.log(result)
  res.json(result)
})

router.get('/:contactId', async (req, res, next) => {
  try{
    const id=req.params.contactId
    const result=await contactsFunctions.getContactById(id);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    return res.json(result)
  }catch(error){
    next(error);
  }
})


router.post('/', async (req, res, next) => {
  try {
    const {error}= contactAddChema.validate(req.body)
console.log(error)
  if (error) {
    throw HttpError(400,error.message)
  }
  const result=await contactsFunctions.addContact(req.body)
   res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const id=req.params.contactId
    const result=await contactsFunctions.removeContact(id);
    if (!result) {
      throw HttpError(404, `Not found`)
    }
    res.json({message:"contact deleted"} )
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const id=req.params.contactId;
    if (Object.keys(req.body).length === 0) {
      
      // Возвращаем ошибку или отправляем сообщение, в зависимости от требований
      throw HttpError(400, 'Missing fields');
    }
    const {error}= contactPutChema.validate(req.body)
    
  if (error) {
    throw HttpError(400,error.message)
  }
  const result=await contactsFunctions.updateContactById(id,req.body)
  if (!result) {
    throw HttpError(404, `Not found`)
  } 
  res.json(result)
  } catch (error) {
    next(error) 
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
   
    const id=req.params.contactId;
    if (Object.keys(req.body).length === 0) {
      
      // Возвращаем ошибку или отправляем сообщение, в зависимости от требований
      throw HttpError(400, 'Missing fields');
    }
    const {error}= contactFavoriteChema.validate(req.body)
    
  if (error) {
    throw HttpError(400,error.message)
  }
  const result=await contactsFunctions.updateContactById(id,req.body)
  if (!result) {
    throw HttpError(404, `Not found`)
  } 
  res.json(result)
  } catch (error) {
    next(error) 
  }
})


// module.exports = router
export default router;
