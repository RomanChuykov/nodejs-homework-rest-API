import express from'express';
import joi from "joi";
import * as contactsFunctions from "../../models/contacts.js";
import HttpError from "../../helpers/errors.js";
const router = express.Router()

const contactAddChema=joi.object({
  name:joi.string().required(),
  email:joi.string(),
  phone:joi.string().required()
})
const contactPutChema=joi.object({
  name:joi.string(),
  email:joi.string(),
  phone:joi.string()
})


router.get('/', async (req, res, next) => { 
  // res.json({ message: 'template message all  ' })
  const result= await contactsFunctions.listContacts();
  res.json(result)
})

router.get('/:contactId', async (req, res, next) => {
  try{
    const id=req.params.contactId
    const result=await contactsFunctions.getContactById(id);
    if (!result) {
      throw HttpError(404, `contact with id=${id} not found`)
    }
    return res.json(result)
  }catch(error){
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error}= contactAddChema.validate(req.body)
  if (error) {
    throw HttpError(400,error.message)
  }
  const result=await contactsFunctions.addContact(req.body)
   res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const id=req.params.contactId
    const result=await contactsFunctions.removeContact(id);
    if (!result) {
      throw HttpError(404, `contact with id=${id} not found`)
    }
    res.json(result )
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const id=req.params.contactId
    const {error}= contactPutChema.validate(req.body)
  if (error) {
    throw HttpError(400,error.message)
  }
  const result=await contactsFunctions.updateContactById(id,req.body)
   res.json(result)
  } catch (error) {
    next(error)
  }
  
  res.json(result)
})

// module.exports = router
export default router;
