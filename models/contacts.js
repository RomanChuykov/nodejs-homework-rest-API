import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import contact from "../models/mongo.js";

const contactsPath=path.resolve("models","contacts.json");
// const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//  TODO: задокументувати кожну функцію

  
// }
async function listContacts(req,res) {
  try {
    const{id:owner}=req.user;
    const data = await contact.find({owner});
    return data;

  } catch (error) {
    return{
      message:error.message
    }
    
  }
}

 async function  getContactById(req,res) {
    // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
    try {
      const { contactId } = req.params;
      const { _id: owner } = req.user;
      // const result= await contact.findById({_id});
      const result = await contact.findOne({ _id: contactId,owner});
      return result ||null;
      
    } catch (error) {
      return null
    }
   
  }

   async function removeContact(req,res) {
    // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
    try {
      const { contactId } = req.params;
      const { _id: owner } = req.user;
      const result= await contact.findByIdAndDelete({ _id: contactId,owner})
    
      if (!result) {
        return null;
      }
      return result;
     
    } catch (error) {
     return null;
    }
  }
  
  async function addContact(object) {
    // ...твій код. Повертає об'єкт доданого контакту.
    const {id:owner}=object.user
 
      const result= await contact.create({...object.body,owner});
      console.log(result)  
      return result 
  }

  async function updateContactById(req,res){
   try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    console.log(contactId,owner)
    // const result= await contact.findByIdAndUpdate(id,data,{new:true})
    // const result = await contact.findOneAndUpdate({contactId, owner}, req.body);
    const result = await contact.findOneAndUpdate({ _id: contactId, owner }, req.body, { new: true }); 
    console.log(result)
    if (!result) {
       return null;
     }
     return result;
    
   } catch (error) {
    return null;
   }

  }
  /*module.exports = {
    listContacts: listContacts
  };*/
  export { listContacts, getContactById, addContact, removeContact,updateContactById };
  // module.exports = {
  //   listContacts:listContacts,
  //   getContactById:getContactById,
  //   addContact:addContact,
  //   removeContact:removeContact
  // };