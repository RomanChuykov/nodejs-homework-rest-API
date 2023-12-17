import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
// const fs = require("fs/promises");
// const path = require("path");
// const { nanoid } = require("nanoid");

const contactsPath=path.resolve("models","contacts.json");
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
// TODO: задокументувати кожну функцію

  
// }
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);

  } catch (error) {
    return{
      message:error.message
    }
    
  }
}
  
  async function  getContactById(contactId) {
    // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
    const allContacts= await listContacts();
    const result= allContacts.find(item=>item.id===contactId);
    return result ||null;
   
  }
   async function removeContact(contactId) {
    // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
    const allContacts= await listContacts();
    const index=allContacts.findIndex(item=>item.id===contactId)
    if (index===-1) {
      return null;
    }
    const result=allContacts.splice(index,1);
    await updateContacts(allContacts);
    return result[0];
  }
  
  async function addContact(object) {
    // ...твій код. Повертає об'єкт доданого контакту. 
    const allContacts= await listContacts();
    const newContact={
      id:nanoid(),
      name:object.name,
      email:object.email,
      phone:object.phone
    };
    allContacts.push(newContact);
    await updateContacts(allContacts);    
    return newContact

  }

  async function updateContactById(id,data){
    const allContacts= await listContacts();
    const index=allContacts.findIndex(item=> item.id==id)
    if (index===-1){ return null}
    allContacts[index]={...allContacts[index],...data}
    await updateContacts(allContacts);
    return allContacts[index]

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